$ErrorActionPreference = "Stop"
$parts = Get-ChildItem -Path $PSScriptRoot -Filter "pi.b64.*" | Sort-Object Name
if (-not $parts) { throw "No pi.b64.* files found." }

$joined = Join-Path $env:TEMP "pi-windows-x64.b64"
$zip = Join-Path $PSScriptRoot "pi-windows-x64.zip"

Remove-Item $joined -Force -ErrorAction SilentlyContinue
foreach ($part in $parts) {
    Get-Content -LiteralPath $part.FullName | Add-Content -LiteralPath $joined
}

$text = Get-Content -LiteralPath $joined -Raw
$bytes = [Convert]::FromBase64String(($text -replace '\s',''))
[IO.File]::WriteAllBytes($zip, $bytes)
Remove-Item $joined -Force

Write-Host "Created $zip"
Get-FileHash -Algorithm SHA256 $zip
