import assert from "node:assert/strict"
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import test from "node:test"

test("reads the newest SCNet 计算服务 credential and catalog", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "scnet-client-"))
  const agent = path.join(root, "agent")
  await mkdir(path.join(agent, "scnet-credentials"), { recursive: true })
  await writeFile(
    path.join(agent, "scnet-credentials", "old.json"),
    JSON.stringify({ scnet: { type: "api_key", key: "sk-old" } }),
  )
  await writeFile(
    path.join(agent, "scnet-credentials", "new.json"),
    JSON.stringify({ scnet: { type: "api_key", key: "sk-new" } }),
  )
  await writeFile(
    path.join(agent, "models.json"),
    JSON.stringify({
      providers: {
        scnet: {
          name: "超算互联网",
          baseUrl: "https://api.scnet.cn/api/llm/v1",
          api: "openai-completions",
          models: [{ id: "SCNet-Max", contextWindow: 1048576, maxTokens: 131072 }],
        },
      },
    }),
  )
  process.env.SCNET_SCLAW_DIR = agent
  const { detectLocalLogin } = await import("../credentials.mjs")
  const found = await detectLocalLogin()
  assert.ok(found)
  assert.match(found.key, /^sk-/)
  assert.equal(found.provider.models.length, 1)
  assert.equal(found.provider.models[0].id, "SCNet-Max")
  await rm(root, { recursive: true, force: true })
})
