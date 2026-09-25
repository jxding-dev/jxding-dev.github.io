@echo off
title kkamukgi-jeone dev server
cd /d "%~dp0"

echo ============================================
echo   "kkamukgi-jeone" dev server starting...
echo ============================================
echo.

if not exist "node_modules" (
    echo [1/2] Installing packages for the first run...
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] npm install failed. Install Node.js LTS from https://nodejs.org
        echo.
        pause
        exit /b 1
    )
    echo.
)

echo [RUN] Browser will open automatically. Press Ctrl + C to stop.
echo.

call npm run dev -- --open

echo.
echo Server stopped.
pause
