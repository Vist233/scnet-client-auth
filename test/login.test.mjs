import assert from "node:assert/strict"
import test from "node:test"
import { encryptPassword, maskPhone, normalizePhone } from "../login.mjs"

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

test("maskPhone keeps only the edges", () => {
  assert.equal(maskPhone("+8613200000000"), "+861****9310")
})
