#!/usr/bin/env bash
# Run the local (WSL) Magpie with this plugin, isolated from the user's own
# Magpie config. Stop with Ctrl-C.
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
export MAGPIE_WEB_KEY="${MAGPIE_WEB_KEY:-scnet-local-dev-20261104}"
export MAGPIE_ADDR="${MAGPIE_ADDR:-0.0.0.0:3425}"

exec "$ROOT/.runtime/magpie" web --addr "${MAGPIE_WEB_ADDR:-0.0.0.0:3430}" --no-open
