import assert from "node:assert/strict"
import test from "node:test"
import { SCNetClientPlugin } from "../index.mjs"

test("config exposes the SCNet 计算服务 provider with all models", async () => {
  const plugin = await SCNetClientPlugin()
  const config = {}
  await plugin.config(config)
  const provider = config.provider["scnet-client"]
  assert.ok(provider)
  assert.equal(provider.api, "https://api.scnet.cn/api/llm/v1")
  assert.equal(Object.keys(provider.models).length, 30)
  const max = provider.models["SCNet-Max"]
  assert.equal(max.limit.context, 1048576)
  assert.equal(max.limit.output, 131072)
  assert.equal(max.capabilities.reasoning, true)
  assert.equal(max.capabilities.input.image, true)
})

test("loader refuses anything outside chat completions", async () => {
  const plugin = await SCNetClientPlugin()
  const loaded = await plugin.auth.loader(async () => ({ type: "api", key: "sk-test" }))
  assert.equal(loaded.baseURL, "https://api.scnet.cn/api/llm/v1")
  await assert.rejects(
    loaded.fetch("https://example.com/api/llm/v1/chat/completions", {}),
    /outside the SCNet Chat Completions endpoint/,
  )
  await assert.rejects(
    loaded.fetch("https://api.scnet.cn/api/llm/v1/models", {}),
    /outside the SCNet Chat Completions endpoint/,
  )
})

test("loader requires an API key", async () => {
  const plugin = await SCNetClientPlugin()
  await assert.rejects(
    plugin.auth.loader(async () => ({ type: "api", key: "" })),
    /缺少超算互联网计算服务的 API Key/,
  )
})
