// Locate and read the SCNet 计算服务 desktop client's own login files.
//
// The client (Electron app "计算服务") stores:
//   <agentDir>/scnet-credentials/<hash>.json  -> {"scnet":{"type":"api_key","key":"sk-..."}}
//   <agentDir>/models.json                    -> { providers: { scnet: { baseUrl, api, models: [...] } } }
//   <agentDir>/settings.json                  -> { defaultProvider, defaultModel }
//
// agentDir is %USERPROFILE%\.sclaw\agent on Windows and ~/.sclaw/agent on
// Linux. A container or remote Magpie can point at a mounted copy with
// SCNET_SCLAW_DIR (e.g. /sclaw/agent).

import { promises as fs, readdirSync } from "node:fs"
import path from "node:path"
import os from "node:os"

const CREDENTIALS = "scnet-credentials"
const MODELS = "models.json"
const SETTINGS = "settings.json"

function uniq(values) {
  return [...new Set(values.filter(Boolean).map((value) => path.resolve(value)))]
}

export function candidateAgentDirs() {
  const dirs = []
  const add = (value) => {
    if (typeof value === "string" && value.trim()) dirs.push(value.trim())
  }
  add(process.env.SCNET_SCLAW_DIR)
  add(process.env.SCNET_AGENT_DIR)
  add(path.join(os.homedir(), ".sclaw", "agent"))
  // Native Windows Node: USERPROFILE is the real profile.
  add(process.env.USERPROFILE ? path.join(process.env.USERPROFILE, ".sclaw", "agent") : "")
  // WSL: the Windows profile is visible under /mnt/c/Users.
  if (process.env.WSL_DISTRO_NAME) {
    for (const user of safeNames("/mnt/c/Users")) {
      add(path.join("/mnt/c/Users", user, ".sclaw", "agent"))
    }
  }
  return uniq(dirs)
}

function safeNames(dir) {
  try {
    return readdirSync(dir).filter((name) => !name.startsWith("."))
  } catch {
    return []
  }
}

async function exists(target) {
  try {
    await fs.access(target)
    return true
  } catch {
    return false
  }
}

export async function findAgentDirs() {
  const found = []
  for (const dir of candidateAgentDirs()) {
    if (await exists(path.join(dir, CREDENTIALS))) found.push(dir)
  }
  return found
}

export async function readKeys(agentDir) {
  const dir = path.join(agentDir, CREDENTIALS)
  let names = []
  try {
    names = await fs.readdir(dir)
  } catch {
    return []
  }
  const keys = []
  for (const name of names) {
    if (!name.endsWith(".json")) continue
    const file = path.join(dir, name)
    try {
      const stat = await fs.stat(file)
      const data = JSON.parse(await fs.readFile(file, "utf8"))
      const scnet = data?.scnet
      if (scnet?.type === "api_key" && typeof scnet.key === "string" && scnet.key.trim()) {
        keys.push({ file, key: scnet.key.trim(), mtimeMs: stat.mtimeMs })
      }
    } catch {
      // A half-written or unrelated file is not a login.
    }
  }
  // The app writes the newest login last; prefer it.
  keys.sort((a, b) => b.mtimeMs - a.mtimeMs)
  return keys
}

export async function readProvider(agentDir) {
  try {
    const data = JSON.parse(await fs.readFile(path.join(agentDir, MODELS), "utf8"))
    const provider = data?.providers?.scnet
    if (!provider || !Array.isArray(provider.models) || provider.models.length === 0) return null
    return provider
  } catch {
    return null
  }
}

export async function readSettings(agentDir) {
  try {
    return JSON.parse(await fs.readFile(path.join(agentDir, SETTINGS), "utf8"))
  } catch {
    return null
  }
}

// Returns the first usable login found on this machine, or null.
export async function detectLocalLogin() {
  for (const agentDir of await findAgentDirs()) {
    const keys = await readKeys(agentDir)
    if (!keys.length) continue
    const provider = await readProvider(agentDir)
    const settings = await readSettings(agentDir)
    return { agentDir, key: keys[0].key, keyFile: keys[0].file, keys, provider, settings }
  }
  return null
}

// Never put a key in a log line or an error message.
export function maskKey(key) {
  if (typeof key !== "string" || !key) return "<missing>"
  if (key.length <= 10) return `${key.slice(0, 2)}…`
  return `${key.slice(0, 6)}…${key.slice(-4)}`
}
