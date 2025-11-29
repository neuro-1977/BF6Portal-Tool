@echo off
REM START: Launches the local server on localhost:8000

REM Try Python HTTP server first
where python >nul 2>nul
if %ERRORLEVEL%==0 (
    python -m http.server 8000
    exit /b
)

where python3 >nul 2>nul
if %ERRORLEVEL%==0 (
    python3 -m http.server 8000
    exit /b
)

REM Try Node.js http-server if available
where npx >nul 2>nul
if %ERRORLEVEL%==0 (
    npx http-server -p 8000
    exit /b
)

echo No suitable server found. Please install Python or Node.js.
exit /b 1
