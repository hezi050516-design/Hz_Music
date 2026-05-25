@echo off
cd /d %~dp0client
start "HzMusic Frontend" cmd /c "npm run dev"
echo Frontend starting... http://localhost:5173
pause
