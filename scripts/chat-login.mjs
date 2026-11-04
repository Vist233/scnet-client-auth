#!/usr/bin/env node
// Agent-driven SCNet login.
//
//   printf '%s' '{"username":"...","password":"..."}' | node scripts/chat-login.mjs password
//   node scripts/chat-login.mjs sms --send --phone 13200000000
//   node scripts/chat-login.mjs sms --code 123456
//
// The password/code are read from stdin or argv as the user provided them;
// the full key is never printed. After a successful login the key is written
// into Magpie through its own /api/plugin-signin (manual-key method), so the
// plugin shows signed in without opening the UI.
//
// Env:
//   MAGPIE_WEB_URL   default http://127.0.0.1:3430
//   MAGPIE_WEB_KEY   default scnet-local-dev-20261104
//   SCNET_SCLAW_DIR  optional, for the local catalog (not required)

import { mkdir, readFile, writeFile, unlink } from "node:fs/promises"
import path from "node:path"
import {
  CookieJar,
  finishLogin,
  loginPassword,
  loginSmsCode,
  maskPhone,
  normalizePhone,
  sendSmsCode,
} from "../login.mjs"

const ROOT = path.dirname(path.dirname(new URL(import.meta.url).pathname))
const SESSION = path.join(ROOT, ".runtime", "sms-session.json")
const MAGPIE = (process.env.MAGPIE_WEB_URL || "http://127.0.0.1:3430").replace(/\/+$/, "")
const WEB_KEY = process.env.MAGPIE_WEB_KEY || "scnet-local-dev-20261104"

function args(argv) {
  const out = { _: [] }
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i]
    if (value.startsWith("--")) out[value.slice(2)] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true
    else out._.push(value)
  }
  return out
}

async function stdin() {
  if (process.stdin.isTTY) return ""
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  return Buffer.concat(chunks).toString("utf8")
}

async function jsonInput() {
  const text = (await stdin()).trim()
  if (text) return JSON.parse(text)
  return {}
}

function out(value) {
  process.stdout.write(`${JSON.stringify(value)}\n`)
}

function keyInfo(key) {
  return { keyPrefix: `${key.slice(0, 6)}…`, keyLength: key.length }
}

async function getWebCookie(jar) {
  let url = `${MAGPIE}/?k=${encodeURIComponent(WEB_KEY)}`
  for (let hop = 0; hop < 4; hop += 1) {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { Accept: "text/html", ...(jar.header() ? { Cookie: jar.header() } : {}) },
    })
    jar.add(typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [])
    const location = res.headers.get("location")
    if (location && res.status >= 300 && res.status < 400) {
      url = new URL(location, url).href
      continue
    }
    break
  }
  return jar
}

async function saveToMagpie({ key, metadata, label }) {
  const jar = await getWebCookie(new CookieJar())
  const body = {
    provider: "scnet-client",
    method: 1, // manual API key
    inputs: {
      label,
      ...(metadata.source ? { source: metadata.source } : {}),
      ...(metadata.userId ? { userId: metadata.userId } : {}),
      ...(metadata.userName ? { userName: metadata.userName } : {}),
      ...(metadata.phone ? { phone: metadata.phone } : {}),
    },
    key,
    account: "scnet-client",
  }
  const res = await fetch(`${MAGPIE}/api/plugin-signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(jar.header() ? { Cookie: jar.header() } : {}) },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = text
  }
  if (!res.ok || (data && typeof data === "object" && data.ok === false)) {
    throw new Error(typeof data === "string" ? data : data?.error || data?.message || `HTTP ${res.status}`)
  }
  return { via: "api", account: data?.account || "scnet-client", metadata }
}

async function saveResult(result, label) {
  const saved = await saveToMagpie({ key: result.key, metadata: result.metadata, label })
  out({
    ok: true,
    account: saved.account,
    email: result.metadata.email,
    source: result.metadata.source,
    savedVia: saved.via,
    ...keyInfo(result.key),
  })
}

async function password() {
  const input = await jsonInput()
  const username = String(input.username ?? process.env.SCNET_USERNAME ?? "").trim()
  const passwordValue = String(input.password ?? process.env.SCNET_PASSWORD ?? "")
  if (!username || !passwordValue) throw new Error("需要 username 和 password")
  const { jar } = await loginPassword({ username, password: passwordValue })
  const result = await finishLogin(jar, { source: "password" })
  await saveResult(result, result.metadata.userName || username)
}

async function sms(opts) {
  if (opts.send) {
    const phone = normalizePhone(opts.phone)
    const { jar } = await sendSmsCode(phone)
    await mkdir(path.dirname(SESSION), { recursive: true })
    await writeFile(
      SESSION,
      JSON.stringify({ phone, cookies: [...jar.cookies.entries()] }),
      { mode: 0o600 },
    )
    out({ ok: true, step: "sms_sent", phone: maskPhone(phone) })
    return
  }
  if (opts.code) {
    const text = await readFile(SESSION, "utf8").catch(() => "")
    if (!text) throw new Error("没有待验证的短信登录，请先执行 sms --send --phone")
    const saved = JSON.parse(text)
    const jar = new CookieJar()
    for (const [name, value] of saved.cookies || []) jar.add(`${name}=${value}`)
    await loginSmsCode(String(opts.code), jar)
    const result = await finishLogin(jar, { source: "sms", phone: saved.phone })
    await unlink(SESSION).catch(() => {})
    await saveResult(result, result.metadata.userName || "SMS")
    return
  }
  throw new Error("用法：sms --send --phone <phone> 或 sms --code <code>")
}

async function save(opts) {
  const key = String(opts.key ?? process.env.SCNET_KEY ?? "").trim()
  const label = String(opts.label ?? "Agent").trim()
  if (!key) throw new Error("需要 --key 或 SCNET_KEY")
  const saved = await saveToMagpie({ key, metadata: {}, label })
  out({ ok: true, account: saved.account, savedVia: saved.via, ...keyInfo(key) })
}

try {
  const opts = args(process.argv.slice(2))
  const command = opts._[0]
  if (command === "password") await password()
  else if (command === "sms") await sms(opts)
  else if (command === "save") await save(opts)
  else throw new Error("用法：password | sms --send --phone <phone> | sms --code <code> | save --key <key>")
} catch (error) {
  out({ ok: false, error: error.message })
  process.exitCode = 1
}
