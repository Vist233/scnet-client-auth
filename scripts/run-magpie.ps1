$ErrorActionPreference = "Continue"

Write-Host "== removing old container =="
docker rm -f magpie-scnet 2>$null | Out-Null

Write-Host "== starting magpie =="
docker run -d --name magpie-scnet `
  -p 13425:3425 -p 13430:3430 `
  -v magpie-scnet-config:/config `
  -v "C:\Users\86138\.sclaw:/sclaw:ro" `
  -v "D:\code\oss\scnet-client-auth:/plugin:ro" `
  -e SCNET_SCLAW_DIR=/sclaw/agent `
  -e MAGPIE_WEB_KEY=scnet-local-dev-20261104 `
  ghcr.io/yetone/magpie:stable web --addr 0.0.0.0:3430 --no-open

Start-Sleep -Seconds 3
Write-Host "== status =="
docker ps -a --filter name=magpie-scnet --format "{{.Names}} {{.Status}} {{.Ports}}"
Write-Host "== logs =="
docker logs magpie-scnet --tail 40 2>&1
