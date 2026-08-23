# OMP Antigravity Quota 1-Click Installer for Windows (PowerShell)
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  OMP Live Google Antigravity Quota Installer" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

$bunPath = (Get-Command bun -ErrorAction SilentlyContinue).Source
if (-not $bunPath) {
    Write-Host "[ERROR] Bun runtime is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Bun first: powershell -c `"irm bun.sh/install.ps1 | iex`""
    Exit 1
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
bun "$scriptDir\install.ts"
