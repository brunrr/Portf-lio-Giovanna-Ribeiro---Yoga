@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  start "" "%~dp0index.html"
  exit /b
)
start "" "http://127.0.0.1:4173/"
echo Portfolio da Giovanna Ribeiro
echo Mantenha esta janela aberta enquanto visualiza o site.
node server.mjs
pause
