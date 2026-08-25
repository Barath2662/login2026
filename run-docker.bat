@echo off
cd /d "%~dp0"

echo Starting LOGIN 2K26 with Docker Compose...
docker compose up --build

if errorlevel 1 (
    echo.
    echo Docker Compose failed. Ensure Docker Desktop is running and WSL 2 is enabled.
    pause
)
