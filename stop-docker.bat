@echo off
cd /d "%~dp0"

echo Stopping LOGIN 2K26 containers...
docker compose down
pause
