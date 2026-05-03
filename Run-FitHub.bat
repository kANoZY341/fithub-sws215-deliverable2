@echo off
setlocal

set "ROOT_DIR=%~dp0"

echo Starting FitHub server and client...

start "FitHub Server" cmd /k "cd /d ""%ROOT_DIR%server"" && npm run dev"
start "FitHub Client" cmd /k "cd /d ""%ROOT_DIR%client"" && npm run dev"

echo.
echo Both processes launched.
echo Close this window or keep it open.

endlocal
