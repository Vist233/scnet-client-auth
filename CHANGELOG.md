# Changelog

## 0.2.0 — 2026-11-04

- Add account/password login: SCNet's 512-bit RSA password encryption, login, and automatic `sk-` key creation/retrieval.
- Add phone + SMS login: `sendDesktopClientPhoneCode` then `loginDesktopClientByPhoneCode`, then the same key path.
- Verify both login routes return the same `sk-` key as the desktop client's `.sclaw` credential.
- Add `scripts/check-cookie.mjs` to compare a `www.scnet.cn` web session with the desktop client account.
- Phone input shows the local number only; `+86` is added internally.
- Add Agent helpers: `scripts/open-login.sh`, `scripts/status-local.sh`, `scripts/login-local.sh`.

## 0.1.0 — 2026-11-04

- First release: reuse the SCNet 计算服务 client login, expose all 30 models with context/tool/image metadata, streaming and tool calls.
- Only `scnet-client/SCNet-Max` is usable without balance with the current key; other models return `Insufficient Balance`.
