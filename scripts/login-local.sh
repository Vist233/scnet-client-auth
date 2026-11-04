#!/usr/bin/env bash
# Sign in to SCNet in the local dev Magpie (same config as run-local.sh).
# Usage: bash scripts/login-local.sh [provider]
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUN="${MAGPIE_BUN:-$ROOT/.runtime/npm2/node_modules/@oven/bun-linux-x64/bin/bun}"
SCLAW="${SCNET_SCLAW_DIR:-/mnt/c/Users/86138/.sclaw/agent}"

if [[ ! -x "$BUN" ]]; then
  echo "Bun not found at $BUN" >&2
  echo "Set MAGPIE_BUN=/path/to/bun, or install Bun." >&2
  exit 1
fi

export HOME="$ROOT/.runtime/home"
export XDG_CONFIG_HOME="$ROOT/.runtime/config"
export XDG_CACHE_HOME="$ROOT/.runtime/cache"
export XDG_DATA_HOME="$ROOT/.runtime/data"
export XDG_STATE_HOME="$ROOT/.runtime/state"
export SCNET_SCLAW_DIR="$SCLAW"
export MAGPIE_BUN="$BUN"

exec "$ROOT/.runtime/magpie" plugin login "${1:-scnet-client}"
