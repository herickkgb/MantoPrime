$ErrorActionPreference = "Stop"

$projectDir = $PSScriptRoot
Set-Location -LiteralPath $projectDir

$nodeDir = "C:\Users\jucef\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
$node = Join-Path $nodeDir "node.exe"
$pnpm = "C:\Users\jucef\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd"
$vite = Join-Path $projectDir "node_modules\vite\bin\vite.js"

if (-not (Test-Path -LiteralPath $node)) {
  Write-Host "Nao encontrei o runtime do Codex nesta maquina." -ForegroundColor Red
  Write-Host "Instale o Node.js LTS em https://nodejs.org/ e depois rode: npm install; npm run dev"
  exit 1
}

$env:Path = "$nodeDir;$env:Path"

if (-not (Test-Path -LiteralPath ".\node_modules")) {
  if (-not (Test-Path -LiteralPath $pnpm)) {
    Write-Host "Nao encontrei o instalador pnpm do runtime do Codex." -ForegroundColor Red
    Write-Host "Instale o Node.js LTS em https://nodejs.org/ e depois rode: npm install; npm run dev"
    exit 1
  }

  Write-Host "Instalando dependencias..." -ForegroundColor Cyan
  & $pnpm install
}

$syncProducts = Join-Path $projectDir "scripts\sync-products.mjs"
if (Test-Path -LiteralPath $syncProducts) {
  Write-Host "Sincronizando catalogo com as imagens..." -ForegroundColor Cyan
  & $node $syncProducts
}

if (-not (Test-Path -LiteralPath $vite)) {
  Write-Host "Nao encontrei o Vite em node_modules." -ForegroundColor Red
  Write-Host "Tente instalar o Node.js LTS e depois rode: npm install"
  exit 1
}

Write-Host "Abrindo MantoPrime em http://127.0.0.1:5173/" -ForegroundColor Green
& $node $vite --host 127.0.0.1 --port 5173
