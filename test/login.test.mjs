import assert from "node:assert/strict"
import test from "node:test"
import { CookieJar, encryptPassword, maskPhone, normalizePhone, sendSmsCode } from "../login.mjs"

test("encryptPassword uses the 512-bit RSA key and returns base64", () => {
  const encrypted = encryptPassword("111111aA")
  assert.match(encrypted, /^[A-Za-z0-9+/]+=*$/)
  assert.ok(Buffer.from(encrypted, "base64").length >= 64)
  assert.notEqual(encryptPassword("111111aA"), encryptPassword("111111aB"))
})

test("normalizePhone accepts common Chinese formats", () => {
  assert.equal(normalizePhone("13200000000"), "+8613200000000")
  assert.equal(normalizePhone("+8613200000000"), "+8613200000000")
  assert.equal(normalizePhone("86 132 0000 0000"), "+8613200000000")
  assert.throws(() => normalizePhone(""), /请输入手机号/)
})

test("maskPhone keeps only the local number, never +86", () => {
  assert.equal(maskPhone("+8613200000000"), "132****0000")
  assert.equal(maskPhone("8613200000000"), "132****0000")
  assert.equal(maskPhone("13200000000"), "132****0000")
})

test("sendSmsCode adds +86 in the request while the UI shows only the local number", async () => {
  const original = globalThis.fetch
  let body = ""
  globalThis.fetch = async (_url, init) => {
    body = String(init?.body ?? "")
    return new Response(JSON.stringify({ code: "0", data: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  }
  try {
    await sendSmsCode("13200000000", new CookieJar())
  } finally {
    globalThis.fetch = original
  }
  assert.match(body, /phoneNum=%2B8613200000000/)
})
