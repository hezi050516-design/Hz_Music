@echo off
cd /d %~dp0server
go build -o hz-music.exe .
copy /y hz-music.exe ..\
cd /d %~dp0
start "HzMusic Backend" hz-music.exe
echo Backend started on http://localhost:8080
pause
