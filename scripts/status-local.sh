#!/usr/bin/env bash
# Show the local dev Magpie's SCNet plugin/account state.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUN="${MAGPIE_BUN:-$ROOT/.runtime/npm2/node_modules/@oven/bun-linux-x64/bin/bun}"
SCLAW="${SCNET_SCLAW_DIR:-/mnt/c/Users/86138/.sclaw/agent}"

export HOME="$ROOT/.runtime/home"
export XDG_CONFIG_HOME="$ROOT/.runtime/config"
export XDG_CACHE_HOME="$ROOT/.runtime/cache"
export XDG_DATA_HOME="$ROOT/.runtime/data"
export XDG_STATE_HOME="$ROOT/.runtime/state"
export SCNET_SCLAW_DIR="$SCLAW"
export MAGPIE_BUN="$BUN"

echo "== plugin =="
"$ROOT/.runtime/magpie" plugin list
echo
echo "== provider =="
"$ROOT/.runtime/magpie" provider scnet-client 2>&1 || true
