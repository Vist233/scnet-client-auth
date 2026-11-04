#!/usr/bin/env bash
# Open the Magpie login page. Agents can run this instead of asking the user
# to open it manually.
set -euo pipefail

URL="${1:-http://localhost:3430/?k=${MAGPIE_WEB_KEY:-scnet-local-dev-20261104}}"

if command -v powershell.exe >/dev/null 2>&1; then
  if powershell.exe -NoProfile -Command "Start-Process '$URL'" >/dev/null 2>&1; then
    echo "$URL"
    exit 0
  fi
fi

if command -v wslview >/dev/null 2>&1; then
  wslview "$URL" >/dev/null 2>&1 || true
  echo "$URL"
  exit 0
fi

if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL" >/dev/null 2>&1 || true
  echo "$URL"
  exit 0
fi

echo "$URL"
