@echo off
setlocal

cd /d "%~dp0"

echo RED WINDOW ARCHIVE
echo.

if not exist "node_modules" (
  echo Installing dependencies...
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo Failed to install dependencies.
    pause
    exit /b 1
  )
)

echo.
echo Starting development server...
echo.
echo Open this URL:
echo http://127.0.0.1:5173/
echo.
echo Admin:
echo http://127.0.0.1:5173/admin
echo Password: 나는 관리자다2279
echo.

start "" "http://127.0.0.1:5173/"
call npm.cmd run dev -- --host 127.0.0.1

pause
