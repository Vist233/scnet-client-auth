// SCNet account login used by the Magpie plugin.
//
// The SCNet 计算服务 desktop client signs in through www.scnet.cn:
//   POST /ac/api/auth/sendDesktopClientPhoneCode.action     { phoneNum }
//   POST /ac/api/auth/loginDesktopClientByPhoneCode.action  { messageCode } + Cookie
//   POST /ac/api/auth/loginDesktopClient.action             { username, password(RSA), ... }
//   GET  /acx/user/users/current-user-info?includeToken=true&refresh=true
//   POST /acx/llm/api-key/createActivityApiKey              -> sk-...
//
// The password is encrypted with SCNet's own 512-bit RSA public key and sent
// base64. The login response sets cookies; the key endpoints need those
// cookies. No key or password is ever logged.

import { constants, publicEncrypt } from "node:crypto"

const BASE = "https://www.scnet.cn"
const APP_VERSION = "4.0.1"
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALaXEnbjI6fjy+t9W9AiO/KS0q+b/OZFS+7ykinLbiriUx9P8BcuuHnVbXNiZp5jW70eVGBtX4DhGUPzJa1YT/8CAwEAAQ==
-----END PUBLIC KEY-----`

const FORM_HEADERS = {
  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  Accept: "application/json, text/plain, */*",
  source: "Electron",
  version: APP_VERSION,
  Referer: "https://www.scnet.cn/",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) scnet-client/4.0.1 Safari/537.36",
}

export class CookieJar {
  constructor(initial = "") {
    this.cookies = new Map()
    if (initial) this.add(initial)
  }

  add(value) {
    const list = Array.isArray(value) ? value : value ? [value] : []
    for (const raw of list) {
      if (typeof raw !== "string") continue
      const first = raw.split(";")[0]
      const at = first.indexOf("=")
      if (at <= 0) continue
      this.cookies.set(first.slice(0, at).trim(), first.trim())
    }
    return this
  }

  header() {
    return [...this.cookies.values()].join("; ")
  }
}

function setCookies(headers) {
  if (typeof headers.getSetCookie === "function") return headers.getSetCookie()
  const raw = headers.get("set-cookie")
  return raw ? [raw] : []
}

function formBody(fields) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null) params.set(key, String(value))
  }
  return params.toString()
}

async function request(path, { method = "POST", form, json, jar, headers = {}, timeoutMs = 20000 } = {}) {
  let url = new URL(path, BASE)
  let verb = method
  let body
  const h = { ...FORM_HEADERS, ...headers }
  if (form) {
    body = formBody(form)
    h["Content-Type"] = FORM_HEADERS["Content-Type"]
  } else if (json !== undefined) {
    body = JSON.stringify(json)
    h["Content-Type"] = "application/json"
  }

  for (let hop = 0; hop < 5; hop += 1) {
    if (jar?.header()) h.Cookie = jar.header()
    else delete h.Cookie
    const response = await fetch(url, {
      method: verb,
      headers: h,
      body,
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
    })
    jar?.add(setCookies(response.headers))
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location")
      if (location) {
        url = new URL(location, url)
        if (response.status === 303 || (response.status <= 302 && verb === "POST")) {
          verb = "GET"
          body = undefined
          delete h["Content-Type"]
        }
        continue
      }
    }
    const text = await response.text()
    let data
    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      data = text
    }
    return { status: response.status, ok: response.ok, data, text }
  }
  throw new Error("SCNet 登录重定向次数过多")
}

function codeOf(data) {
  return data && typeof data === "object" ? String(data.code ?? data.status ?? "") : ""
}

function messageOf(data, fallback) {
  if (data && typeof data === "object") {
    const message = data.msg ?? data.message ?? data.error?.message
    if (typeof message === "string" && message.trim()) return message.trim()
  }
  return fallback
}

function succeeded(data) {
  const code = codeOf(data)
  return code === "" || code === "0" || code === "000000" || code === "200"
}

export function encryptPassword(password) {
  const text = String(password ?? "")
  if (!text) throw new Error("请输入密码")
  const max = 64 - 11 // 512-bit RSA key, PKCS#1 v1.5 padding
  if (Buffer.byteLength(text, "utf8") > max) throw new Error("密码过长，请改用手机号登录")
  return publicEncrypt(
    { key: PUBLIC_KEY, padding: constants.RSA_PKCS1_PADDING },
    Buffer.from(text, "utf8"),
  ).toString("base64")
}

export function normalizePhone(input) {
  const raw = String(input ?? "").trim()
  if (!raw) throw new Error("请输入手机号")
  const digits = raw.replace(/[^\d+]/g, "")
  if (digits.startsWith("+")) return digits
  if (digits.startsWith("86")) return `+${digits}`
  return `+86${digits}`
}

export function maskPhone(phone) {
  const text = String(phone ?? "")
  return text.length >= 7 ? `${text.slice(0, 4)}****${text.slice(-4)}` : text
}

export async function isNeedCaptcha(jar) {
  const res = await request("/ac/api/auth/isNeedCpatcha.action", { form: {}, jar })
  if (!succeeded(res.data)) throw new Error(messageOf(res.data, "无法确认是否需要验证码"))
  return Boolean(res.data?.data)
}

export async function getCaptcha(jar) {
  const res = await request("/ac/api/auth/getClientCaptcha.action", { form: { ph: "1" }, jar })
  if (!succeeded(res.data) || typeof res.data?.data !== "string") {
    throw new Error(messageOf(res.data, "获取图形验证码失败"))
  }
  return { image: res.data.data, key: res.data.captchaKey ?? "" }
}

export async function loginPassword({ username, password, captcha = "", captchaKey = "", jar = new CookieJar() } = {}) {
  const res = await request("/ac/api/auth/loginDesktopClient.action", {
    jar,
    form: {
      username,
      password: encryptPassword(password),
      captcha,
      captchaKey,
      encrypted: "true",
      isSevenDaysValidity: "true",
      ph: "1",
    },
  })
  if (!succeeded(res.data)) throw new Error(messageOf(res.data, "账号或密码不正确"))
  return { jar, data: res.data }
}

export async function sendSmsCode(phone, jar = new CookieJar()) {
  const res = await request("/ac/api/auth/sendDesktopClientPhoneCode.action", {
    jar,
    form: { phoneNum: normalizePhone(phone) },
  })
  if (!succeeded(res.data)) throw new Error(messageOf(res.data, "发送验证码失败"))
  return { jar, data: res.data }
}

export async function loginSmsCode(code, jar = new CookieJar()) {
  const res = await request("/ac/api/auth/loginDesktopClientByPhoneCode.action", {
    jar,
    form: { messageCode: String(code ?? ""), isSevenDaysValidity: "true" },
    headers: { Cookie: jar.header() },
  })
  if (!succeeded(res.data)) throw new Error(messageOf(res.data, "验证码不正确或已过期"))
  return { jar, data: res.data }
}

export async function currentUser(jar) {
  const res = await request("/acx/user/users/current-user-info?includeToken=true&refresh=true", {
    method: "GET",
    jar,
  })
  if (!succeeded(res.data)) throw new Error(messageOf(res.data, "读取账号信息失败"))
  const data = res.data?.data
  if (!data || typeof data !== "object") throw new Error("SCNet 未返回账号信息")
  return data
}

function extractKey(value) {
  if (typeof value === "string" && value.trim()) return value.trim()
  if (!value || typeof value !== "object") return ""
  for (const key of ["apiKey", "key", "secret", "token", "api_key"]) {
    const candidate = value[key]
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim()
  }
  if (value.data !== undefined) return extractKey(value.data)
  return ""
}

async function keyFallback(jar) {
  const detail = await request("/acx/user/users/cluster-user-detail", { method: "GET", jar })
  const rows = Array.isArray(detail.data?.data) ? detail.data.data : []
  const member = rows.find((row) => String(row?.memberType ?? "").toLowerCase() === "member")
  if (!member) throw new Error("SCNet 账号没有可用的团队账户")
  const accountId = String(member.accountId ?? "")
  const groupId = String(member.groupId ?? "")
  const createUser = String(member.userId ?? "")
  if (!accountId || !groupId || !createUser) throw new Error("SCNet 团队账户信息不完整")
  const apiKeyName = `scnet-client-member-${createUser}`

  const query = await request("/acx/llm/api-key/query", {
    jar,
    json: { createUser, accountId, groupId, serviceType: "model", page: 1, size: 100 },
  })
  const records = Array.isArray(query.data?.data) ? query.data.data : Array.isArray(query.data?.records) ? query.data.records : []
  const found = records.find(
    (row) =>
      String(row?.apiKeyName ?? "") === apiKeyName &&
      String(row?.accountId ?? "") === accountId &&
      String(row?.createUser ?? "") === createUser &&
      String(row?.keyStatus ?? "") === "100" &&
      row?.id,
  )
  if (found) {
    const detailKey = await request(`/acx/llm/api-key/detail?id=${encodeURIComponent(found.id)}`, {
      method: "GET",
      jar,
    })
    const key = extractKey(detailKey.data)
    if (key && !key.includes("*")) return key
    throw new Error("SCNet 客户端 Key 不可用，请在平台检查")
  }

  const created = await request("/acx/llm/api-key/create", {
    jar,
    json: {
      createUser,
      apiKeyName,
      serviceTypes: ["model"],
      accessibleModelScope: "ALL",
      groupId,
      accountId,
    },
  })
  const key = extractKey(created.data)
  if (!key) throw new Error(messageOf(created.data, "创建 SCNet API Key 失败"))
  return key
}

export async function createApiKey(jar) {
  const res = await request("/acx/llm/api-key/createActivityApiKey", { jar, json: {} })
  if (succeeded(res.data)) {
    const key = extractKey(res.data)
    if (key) return key
  }
  const providerCode = res.data?.providerCode ?? res.data?.code
  if (String(providerCode) === "API010010") return keyFallback(jar)
  throw new Error(messageOf(res.data, "获取 SCNet API Key 失败"))
}

// One login, then the key and the account it belongs to.
export async function finishLogin(jar, meta = {}) {
  const user = await currentUser(jar)
  const key = await createApiKey(jar)
  const userName = String(user.userName ?? user.user_name ?? user.id ?? "").trim()
  return {
    type: "success",
    key,
    metadata: {
      email: `超算互联网 · ${userName || "计算服务"}`,
      source: meta.source ?? "login",
      userId: String(user.id ?? user.userId ?? ""),
      userName,
      ...(meta.phone ? { phone: maskPhone(meta.phone) } : {}),
    },
  }
}

// Exposed for the plugin's auth methods and for tests.
export { BASE, APP_VERSION }
