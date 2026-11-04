#!/usr/bin/env node
// Compare a www.scnet.cn web session with the account the 计算服务 client
// signed in to. The cookie is read from SCNET_COOKIE (or stdin) and is never
// printed.
//
//   SCNET_COOKIE='Token=...; other=...' node scripts/check-cookie.mjs
//   printf '%s' "$COOKIE" | node scripts/check-cookie.mjs
//
// The app's account is read from the client's config.json; override its path
// with SCNET_CLIENT_CONFIG.

import { readFileSync } from "node:fs"

const BASE = "https://www.scnet.cn"
const CONFIG =
  process.env.SCNET_CLIENT_CONFIG ??
  "/mnt/c/Users/86138/AppData/Roaming/scnet-client/config.json"

async function readStdin() {
  if (process.stdin.isTTY) return ""
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  return Buffer.concat(chunks).toString("utf8")
}

function mask(value) {
  const text = String(value ?? "")
  if (text.length < 7) return text
  return `${text.slice(0, 3)}****${text.slice(-4)}`
}

function accountOf(user) {
  if (!user || typeof user !== "object") return null
  return {
    id: String(user.id ?? user.userId ?? ""),
    userName: String(user.userName ?? user.user_name ?? ""),
    fullName: String(user.fullName ?? user.name ?? ""),
    phone: mask(user.mobilephoneNum ?? user.phone ?? ""),
  }
}

const input = (process.env.SCNET_COOKIE ?? (await readStdin())).trim()
if (!input) {
  console.error("请把浏览器请求里的 Cookie 值放到 SCNET_COOKIE，或从 stdin 传入。")
  process.exit(2)
}
const cookie = /(?:^|;\s*)[A-Za-z0-9_.-]+=/.test(input) ? input : `Token=${input}`

const response = await fetch(`${BASE}/acx/user/users/current-user-info?includeToken=true&refresh=true`, {
  headers: { Accept: "application/json", Cookie: cookie },
  redirect: "error",
  signal: AbortSignal.timeout(20000),
})
const body = await response.json().catch(() => ({}))
if (String(body?.code ?? "") !== "0" || !body?.data) {
  console.error(`Cookie 未通过 SCNet 校验：HTTP ${response.status} ${body?.msg ?? body?.message ?? ""}`.trim())
  process.exit(1)
}

const web = accountOf(body.data)
console.log("Web  :", JSON.stringify(web))

let app = null
try {
  const config = JSON.parse(readFileSync(CONFIG, "utf8"))
  app = accountOf(config.userInfo)
} catch (error) {
  console.error(`读取客户端账号失败：${error.message}`)
}
if (app) console.log("App  :", JSON.stringify(app))

if (app) {
  const same =
    (web.id && app.id && web.id === app.id) ||
    (web.userName && app.userName && web.userName === app.userName)
  console.log(same ? "结论：同一个账号" : "结论：不是同一个账号（或客户端账号信息不完整）")
}
