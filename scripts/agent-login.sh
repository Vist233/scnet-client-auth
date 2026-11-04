#!/usr/bin/env bash
# Agent-assisted SCNet login for the local dev Magpie.
#
#   bash scripts/agent-login.sh              # open the page, print instructions, exit
#   bash scripts/agent-login.sh --wait 300   # also poll up to 300s for sign-in
#
# The agent should never ask for the password or SMS code; the user enters
# them in Magpie's native dialog.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUN="${MAGPIE_BUN:-$ROOT/.runtime/npm2/node_modules/@oven/bun-linux-x64/bin/bun}"
SCLAW="${SCNET_SCLAW_DIR:-/mnt/c/Users/86138/.sclaw/agent}"
PAGE="http://localhost:3430/?k=${MAGPIE_WEB_KEY:-scnet-local-dev-20261104}&view=providers&edit=scnet-client"

export HOME="$ROOT/.runtime/home"
export XDG_CONFIG_HOME="$ROOT/.runtime/config"
export XDG_CACHE_HOME="$ROOT/.runtime/cache"
export XDG_DATA_HOME="$ROOT/.runtime/data"
export XDG_STATE_HOME="$ROOT/.runtime/state"
export SCNET_SCLAW_DIR="$SCLAW"
export MAGPIE_BUN="$BUN"

MAGPIE="$ROOT/.runtime/magpie"
signed_in() { "$MAGPIE" plugin list 2>/dev/null | grep -q 'signed in'; }

wait_seconds=0
if [[ "${1:-}" == "--wait" ]]; then
  wait_seconds="${2:-300}"
fi

if signed_in; then
  echo "ALREADY_SIGNED_IN"
  "$MAGPIE" provider scnet-client 2>/dev/null | head -3 || true
  exit 0
fi

echo "NOT_SIGNED_IN"
"$ROOT/scripts/open-login.sh" "$PAGE" >/dev/null 2>&1 || true
cat <<EOF
OPEN $PAGE

请选择一种登录方式：
  - 账号密码登录：用户名 + 密码
  - 手机号验证码登录：手机号 -> 短信验证码（手机号只填本地号码）

登录完成后运行：
  bash scripts/status-local.sh
EOF

if [[ "$wait_seconds" -gt 0 ]]; then
  echo "WAITING up to ${wait_seconds}s..."
  end=$(( $(date +%s) + wait_seconds ))
  while [[ $(date +%s) -lt "$end" ]]; do
    if signed_in; then
      echo "SIGNED_IN"
      "$MAGPIE" provider scnet-client 2>/dev/null | head -5 || true
      exit 0
    fi
    sleep 3
  done
  echo "TIMEOUT"
  exit 1
fi
