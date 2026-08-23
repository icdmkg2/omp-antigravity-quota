@echo off
setlocal
echo =====================================================
echo   OMP Live Google Antigravity Quota Installer
echo =====================================================
echo.

where bun >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Bun runtime is not installed or not in PATH.
    echo Please install Bun first: powershell -c "irm bun.sh/install.ps1 | iex"
    pause
    exit /b 1
)

bun "%~dp0install.ts"
pause
