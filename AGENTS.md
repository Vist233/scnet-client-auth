# AGENTS.md

This file is for coding agents working in this repository. Humans read
[README.md](README.md). Keep README short; put operational detail here.

## Project

- Magpie plugin for the **超算互联网「计算服务」客户端** (scnet-client;
  `计算服务.exe`; data in `%USERPROFILE%\.sclaw\agent`).
- Provider id: `scnet-client`
- Upstream: `https://api.scnet.cn/api/llm/v1` (OpenAI Chat Completions)
- 30 models in `models.mjs`; generated from the client's `models.json`.
- Only `scnet-client/SCNet-Max` is usable without balance on the current key;
  other models may return `Insufficient Balance`.

### Not Token Plan

- This is **not** SCNet Token Plan. Token Plan uses `sk-tp-` keys and shows
  Credits through the console; its plugin is `bbingz/scnet-auth`.
- This plugin reverse-proxies the 「计算服务」 desktop client, uses its `sk-`
  key, and has **no quota/credits API**. Do not add quota claims to the README.


## Login decision tree

1. **User gives username + password** — log in directly; do not open the UI.
   ```sh
   printf '%s' '{"username":"...","password":"..."}' | node scripts/chat-login.mjs password
   ```
2. **User gives a phone number** — two steps, no UI:
   ```sh
   node scripts/chat-login.mjs sms --send --phone 13200000000
   # ask the user for the SMS code, then:
   node scripts/chat-login.mjs sms --code 123456
   ```
3. **User gives no credentials / asks to open the page** — open the native
   Magpie provider page and let the user type there:
   ```sh
   bash scripts/agent-login.sh
   # or wait for sign-in:
   bash scripts/agent-login.sh --wait 300
   ```
   Page: `http://localhost:3430/?k=<MAGPIE_WEB_KEY>&view=providers&edit=scnet-client`

Rules:

- Never invent credentials. Never ask for a password/SMS code if the user chose
  the page.
- Never print the full key, password, or SMS code.
- After login run `bash scripts/status-local.sh` and expect `signed in`.
- If the user gave credentials, use the chat path; if they only said “打开登录页”
  or “我自己输”, use `agent-login.sh`.

## Scripts

| Script | Purpose | Usage |
|---|---|---|
| `scripts/chat-login.mjs` | Chat-driven password/SMS login; saves the key to Magpie | See below |
| `scripts/agent-login.sh` | Opens the native provider page; optional wait | `bash scripts/agent-login.sh [--wait 300]` |
| `scripts/open-login.sh` | Low-level URL opener used by `agent-login.sh` | `bash scripts/open-login.sh [url]` |
| `scripts/status-local.sh` | Prints plugin/provider state | `bash scripts/status-local.sh` |
| `scripts/logout-local.sh` | Signs out for testing | `bash scripts/logout-local.sh` |
| `scripts/run-local.sh` | Starts the local dev Magpie web + gateway | `bash scripts/run-local.sh` |

### chat-login.mjs

```sh
# password: JSON on stdin (keep the password out of argv)
printf '%s' '{"username":"...","password":"..."}' | node scripts/chat-login.mjs password

# phone step 1: send the code; stores a cookie session
node scripts/chat-login.mjs sms --send --phone 13200000000

# phone step 2: complete the login
node scripts/chat-login.mjs sms --code 123456

# save a known key without logging in again (reads SCNET_KEY or --key)
SCNET_KEY="$KEY" node scripts/chat-login.mjs save --label my-account
```

Outputs JSON; the full key is never printed:

```json
{"ok":true,"account":"scnet-client","source":"sms","keyPrefix":"sk-…","keyLength":43,"savedVia":"api"}
{"ok":true,"step":"sms_sent","phone":"132****0000"}
{"ok":false,"error":"..."}
```

The key is written through Magpie's `POST /api/plugin-signin` (manual-key
method, index `1`, `account: "scnet-client"`), so no manual copy/paste.

### Environment

Local dev scripts set these; override only when needed:

- `MAGPIE_WEB_URL` — default `http://127.0.0.1:3430`
- `MAGPIE_WEB_KEY` — default `scnet-local-dev-20261104`
- `SCNET_SCLAW_DIR` — default `/mnt/c/Users/86138/.sclaw/agent`
- `MAGPIE_BUN` — default `.runtime/npm2/node_modules/@oven/bun-linux-x64/bin/bun`
- `HOME`, `XDG_*` — isolated under `.runtime/` by the dev scripts

`chat-login.mjs` uses the Magpie web API, so the local Magpie must be running
(`scripts/run-local.sh`). For a remote Magpie set `MAGPIE_WEB_URL` and
`MAGPIE_WEB_KEY` to that instance.

## Model usage

- Gateway: `http://127.0.0.1:3425/v1`
- Model: `scnet-client/SCNet-Max`
- Key: `magpie` (the local gateway accepts any key)
- With a Magpie-managed agent: `magpie <agent> scnet-client/SCNet-Max`

## Security

- Phone input shows the local number only; `+86` is added only in the request.
- SMS session is `.runtime/sms-session.json` (mode 600); delete it after the code
  is used (the script does this).
- Do not add passwords, codes, full keys, or account phone numbers to commits,
  logs, or README.
- Design notes and long-form history live in `.runtime/` (ignored by git), not
  in the repository.
