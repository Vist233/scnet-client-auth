// Magpie plugin: SCNet 计算服务 (the Windows desktop app "计算服务").
//
// It reuses the login the desktop client already stored in
// ~/.sclaw/agent/scnet-credentials, exposes all 30 models in the client's
// models.json (1M context, 128k output where the catalog says so), and sends
// only OpenAI Chat Completions requests to api.scnet.cn.
//
// This is NOT the Token Plan plugin (bbingz/scnet-auth). Token Plan uses a
// sk-tp- key and a different console; the 计算服务 app stores a plain sk- key.

import { readFileSync } from "node:fs"
import { detectLocalLogin } from "./credentials.mjs"
import { SCNET_MODELS } from "./models.mjs"

const ID = "scnet-client"
const NPM = "@ai-sdk/openai-compatible"
const BASE = "https://api.scnet.cn/api/llm/v1"
const CHAT_PATH = "/api/llm/v1/chat/completions"
const ORIGIN = "https://api.scnet.cn"
const ICON = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")).magpie.icon

function requireKey(auth) {
  if (auth?.type !== "api" || typeof auth.key !== "string" || !auth.key.trim()) {
    throw new Error("缺少超算互联网计算服务的 API Key，请重新登录，或使用手动 Key")
  }
  return auth.key.trim()
}

function imageInput(known) {
  const input = known?.input
  if (!Array.isArray(input)) return false
  return input.some((value) => /image|vision|视觉/i.test(String(value)))
}

// Magpie's provider model shape, as used by scnet-auth's Magpie plugin.
function model(id, known) {
  return {
    ...known,
    id,
    name: known?.name ?? id,
    providerID: ID,
    api: { id, url: BASE, npm: NPM },
    limit: {
      context: Number.isFinite(known?.contextWindow) ? known.contextWindow : 0,
      output: Number.isFinite(known?.maxTokens) ? known.maxTokens : 0,
    },
    capabilities: {
      reasoning: Boolean(known?.reasoning),
      toolcall: known?.toolCalling !== false,
      input: { text: true, image: imageInput(known) },
      output: { text: true },
    },
  }
}

function modelMap(models) {
  const list = Array.isArray(models) && models.length ? models : SCNET_MODELS
  return Object.fromEntries(list.map((entry) => [entry.id, model(entry.id, entry)]))
}

function modelsFromCatalog(provider) {
  const list = provider?.models
  return Array.isArray(list) && list.length ? list : SCNET_MODELS
}

function modelIds(list) {
  return list.map((entry) => entry.id).join(",")
}

async function localLogin() {
  try {
    return await detectLocalLogin()
  } catch {
    return null
  }
}

export async function SCNetClientPlugin() {
  return {
    async config(config) {
      config.provider ??= {}
      config.provider[ID] ??= {
        name: "超算互联网 · 计算服务",
        npm: NPM,
        api: BASE,
        models: modelMap(SCNET_MODELS),
      }
    },

    auth: {
      provider: ID,
      icon: ICON,
      methods: [autoMethod(), manualMethod()],
      async loader(getAuth) {
        requireKey(await getAuth())
        return {
          baseURL: BASE,
          // The real key is attached below, after any client-supplied headers.
          apiKey: "scnet-client-plugin",
          async fetch(input, init) {
            const request = new Request(input, init)
            const url = new URL(request.url)
            if (
              url.origin !== ORIGIN ||
              url.pathname !== CHAT_PATH ||
              url.username ||
              url.password ||
              url.hash
            ) {
              throw new Error("Refusing a request outside the SCNet Chat Completions endpoint")
            }
            request.signal.throwIfAborted()
            const key = requireKey(await getAuth())
            const headers = new Headers(request.headers)
            for (const name of [
              "authorization",
              "x-api-key",
              "x-goog-api-key",
              "cookie",
              "proxy-authorization",
            ]) {
              headers.delete(name)
            }
            headers.set("authorization", `Bearer ${key}`)
            // Preserve body, tool calls, stream and cancellation. Never follow
            // a redirect with credentials, and never buffer the response.
            return fetch(new Request(request, { headers, redirect: "error" }))
          },
        }
      },
    },

    provider: {
      id: ID,
      async models(provider, { auth } = {}) {
        if (auth?.type !== "api") return provider.models
        const found = await localLogin()
        return modelMap(modelsFromCatalog(found?.provider))
      },
    },
  }
}

function autoMethod() {
  return {
    type: "oauth",
    label: "读取计算服务客户端的登录（本机）",
    async authorize() {
      // Magpie's oauth flow expects a sign-in flow object; the callback runs
      // after the user confirms. There is no browser page for the desktop
      // client, so the flow is an instruction plus an immediate callback.
      return {
        url: "",
        opened: false,
        method: "auto",
        instructions:
          "正在读取计算服务客户端的登录信息（%USERPROFILE%\\.sclaw\\agent 或 SCNET_SCLAW_DIR）。读取不到时请改用手动 Key。",
        async callback() {
          const found = await localLogin()
          if (found) {
            const models = modelsFromCatalog(found.provider)
            return {
              type: "success",
              key: found.key,
              metadata: {
                email: `超算互联网 · 计算服务 · ${found.keyFile.split(/[\\/]/).pop().replace(/\.json$/, "")}`,
                source: "sclaw",
                agentDir: found.agentDir,
                models: modelIds(models),
              },
            }
          }
          const env = typeof process.env.SCNET_API_KEY === "string" ? process.env.SCNET_API_KEY.trim() : ""
          if (env) {
            return {
              type: "success",
              key: env,
              metadata: {
                email: "超算互联网 · 计算服务 · 环境变量",
                source: "env",
                models: modelIds(SCNET_MODELS),
              },
            }
          }
          return {
            type: "failed",
            error:
              "未找到计算服务客户端的登录信息。请确认已安装并登录「计算服务」，或设置 SCNET_SCLAW_DIR 指向 .sclaw/agent；也可以改用手动 Key。",
          }
        },
      }
    },
  }
}

function manualMethod() {
  const prompts = [
    {
      type: "text",
      key: "label",
      message: "账号备注 · 显示为「超算互联网 · 备注」",
      placeholder: "例如：本机计算服务 / 工作号",
      validate: (value) =>
        typeof value !== "string" ||
        !value.trim() ||
        value.trim().length > 60 ||
        /[\x00-\x1f\x7f]/.test(value)
          ? "请输入 1–60 字的账号备注，不要填写 API Key"
          : undefined,
    },
  ]
  return {
    type: "api",
    label: "手动填写计算服务 API Key",
    placeholder: "粘贴计算服务的 sk- Key（不是 Token Plan 的 sk-tp- Key）",
    prompts,
    async authorize(inputs = {}) {
      for (const prompt of prompts) {
        const error = prompt.validate?.(inputs[prompt.key])
        if (error) return { type: "failed", error }
      }
      return {
        type: "success",
        metadata: {
          email: `超算互联网 · ${inputs.label.trim()}`,
          source: "manual",
          models: modelIds(SCNET_MODELS),
        },
      }
    },
  }
}
