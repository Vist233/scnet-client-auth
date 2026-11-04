import assert from "node:assert/strict"
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import test from "node:test"
import { SCNetClientPlugin } from "../index.mjs"

async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), "scnet-auth-"))
  const agent = path.join(root, "agent")
  await mkdir(path.join(agent, "scnet-credentials"), { recursive: true })
  await writeFile(
    path.join(agent, "scnet-credentials", "account.json"),
    JSON.stringify({ scnet: { type: "api_key", key: "sk-test-account" } }),
  )
  await writeFile(
    path.join(agent, "models.json"),
    JSON.stringify({
      providers: {
        scnet: {
          baseURL: "https://api.scnet.cn/api/llm/v1",
          models: [
            { id: "SCNet-Max", contextWindow: 1048576, maxTokens: 131072, reasoning: true, toolCalling: true, input: ["text", "image"] },
          ],
        },
      },
    }),
  )
  process.env.SCNET_SCLAW_DIR = agent
  return { root, agent }
}

test("auto sign-in reads the desktop client and returns a key", async () => {
  const { root } = await fixture()
  const plugin = await SCNetClientPlugin()
  const method = plugin.auth.methods[0]
  assert.equal(method.type, "oauth")
  const flow = await method.authorize()
  assert.equal(flow.method, "auto")
  assert.equal(typeof flow.callback, "function")
  const result = await flow.callback()
  assert.equal(result.type, "success")
  assert.match(result.key, /^sk-/)
  assert.equal(result.metadata.source, "sclaw")
  await rm(root, { recursive: true, force: true })
})

test("manual sign-in accepts a label and succeeds", async () => {
  const plugin = await SCNetClientPlugin()
  const method = plugin.auth.methods[1]
  assert.equal(method.type, "api")
  const result = await method.authorize({ label: "本机计算服务" })
  assert.equal(result.type, "success")
  assert.match(result.metadata.email, /本机计算服务/)
})

test("provider models exposes all 30 catalog models", async () => {
  const plugin = await SCNetClientPlugin()
  const provider = { models: { "SCNet-Max": {} } }
  const models = await plugin.provider.models(provider, { auth: { type: "api", key: "sk-test" } })
  assert.equal(Object.keys(models).length, 30)
  assert.equal(models["SCNet-Max"].limit.context, 1048576)
})
