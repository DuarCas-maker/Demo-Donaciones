param([switch]$Build, [switch]$Test)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$taskNpm = Get-Command npm.cmd -ErrorAction SilentlyContinue
if ($taskNpm) {
  if (-not (Test-Path -LiteralPath 'node_modules')) { & $taskNpm.Source install }
  if ($Build) { & $taskNpm.Source run build }
  elseif ($Test) { & $taskNpm.Source test }
  else { & $taskNpm.Source run dev }
  exit $LASTEXITCODE
}
$taskNode = Get-Command node -ErrorAction SilentlyContinue
if (-not $taskNode) { throw 'Instala Node.js 22.12+ con npm para ejecutar la demo.' }
if (-not (Test-Path -LiteralPath 'node_modules/vite/bin/vite.js')) { throw 'Faltan dependencias. Instala Node.js con npm y ejecuta npm install.' }
if ($Build) {
  & $taskNode.Source node_modules/typescript/bin/tsc -b
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  & $taskNode.Source node_modules/vite/bin/vite.js build
} elseif ($Test) { & $taskNode.Source node_modules/vitest/vitest.mjs run }
else { & $taskNode.Source node_modules/vite/bin/vite.js --host 127.0.0.1 }
exit $LASTEXITCODE
