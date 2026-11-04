import assert from "node:assert/strict"
import test from "node:test"
import { SCNET_MODELS } from "../models.mjs"

test("catalog has all 30 SCNet 计算服务 models", () => {
  assert.equal(SCNET_MODELS.length, 30)
  const ids = new Set(SCNET_MODELS.map((model) => model.id))
  for (const id of ["SCNet-Max", "DeepSeek-V4.1-Flash-1017", "Kimi-K3", "Qwen3.8-Max"]) {
    assert.ok(ids.has(id), id)
  }
})

test("SCNet-Max carries 1M context and 128k output", () => {
  const max = SCNET_MODELS.find((model) => model.id === "SCNet-Max")
  assert.ok(max)
  assert.equal(max.contextWindow, 1048576)
  assert.equal(max.maxTokens, 131072)
  assert.equal(max.reasoning, true)
  assert.ok(max.input.includes("image"))
})
