@echo off
REM START: Launches the local web server for the BF6 Portal editor on localhost:8000

REM Try Python HTTP server first
where python >nul 2>nul
if %ERRORLEVEL%==0 (
    python -m http.server 8000 --directory web_ui
    exit /b
)

where python3 >nul 2>nul
if %ERRORLEVEL%==0 (
    python3 -m http.server 8000 --directory web_ui
    exit /b
)

REM Try Node.js http-server if available (assuming it serves from current dir, might need adjustment)
where npx >nul 2>nul
if %ERRORLEVEL%==0 (
    echo Note: Node.js http-server might need configuration to serve 'web_ui' directory.
    npx http-server -p 8000
    exit /b
)

echo No suitable web server found. Please install Python or Node.js.
exit /b 1
