#!/usr/bin/env bash
# Remove the local dev Magpie's SCNet sign-in (for testing the login flow).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUN="${MAGPIE_BUN:-$ROOT/.runtime/npm2/node_modules/@oven/bun-linux-x64/bin/bun}"

export HOME="$ROOT/.runtime/home"
export XDG_CONFIG_HOME="$ROOT/.runtime/config"
export XDG_CACHE_HOME="$ROOT/.runtime/cache"
export XDG_DATA_HOME="$ROOT/.runtime/data"
export XDG_STATE_HOME="$ROOT/.runtime/state"
export MAGPIE_BUN="$BUN"

"$ROOT/.runtime/magpie" plugin logout scnet-client
