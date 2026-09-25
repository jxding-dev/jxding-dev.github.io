@echo off
chcp 65001 >nul
setlocal

cd /d "%~dp0"

if not exist node_modules (
  echo 의존성을 설치합니다...
  call npm.cmd install
  if errorlevel 1 exit /b %errorlevel%
)

echo 기시감 박물관을 실행합니다...
echo 브라우저에서 http://127.0.0.1:5173/ 을 여세요.
call npm.cmd run dev -- --host 127.0.0.1
