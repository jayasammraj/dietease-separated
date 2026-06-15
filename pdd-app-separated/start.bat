@echo off
title DietEase+ Backend
color 0A

echo.
echo  ██████╗ ██╗███████╗████████╗███████╗ █████╗ ███████╗███████╗
echo  ██╔══██╗██║██╔════╝╚══██╔══╝██╔════╝██╔══██╗██╔════╝██╔════╝
echo  ██║  ██║██║█████╗     ██║   █████╗  ███████║███████╗█████╗
echo  ██║  ██║██║██╔══╝     ██║   ██╔══╝  ██╔══██║╚════██║██╔══╝
echo  ██████╔╝██║███████╗   ██║   ███████╗██║  ██║███████║███████╗
echo  ╚═════╝ ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝
echo.
echo            + Smart Barcode Food Tracker (Separated App)
echo.

:: Try to find node.exe — check common install paths
set "NODE_EXE="

:: Check system PATH first
where node >nul 2>&1
if not errorlevel 1 (
    set "NODE_EXE=node"
    goto :node_found
)

:: Check standard install paths
if exist "C:\Program Files\nodejs\node.exe" (
    set "NODE_EXE=C:\Program Files\nodejs\node.exe"
    set "NPM_CMD=C:\Program Files\nodejs\npm.cmd"
    goto :node_found
)
if exist "C:\Program Files (x86)\nodejs\node.exe" (
    set "NODE_EXE=C:\Program Files (x86)\nodejs\node.exe"
    set "NPM_CMD=C:\Program Files (x86)\nodejs\npm.cmd"
    goto :node_found
)
if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
    set "NODE_EXE=%LOCALAPPDATA%\Programs\nodejs\node.exe"
    set "NPM_CMD=%LOCALAPPDATA%\Programs\nodejs\npm.cmd"
    goto :node_found
)

echo  [ERROR] Node.js is not installed!
echo  Please download it from: https://nodejs.org
echo  Install Node.js LTS, then run this file again.
pause
exit /b 1

:node_found
echo  [OK] Node.js found.

:: Install dependencies if backend/node_modules doesn't exist
if not exist "backend\node_modules" (
    echo.
    echo  [SETUP] Installing dependencies in backend (first-time only)...
    echo  This may take 1-2 minutes. Please wait...
    echo.
    pushd backend
    if defined NPM_CMD (
        "%NPM_CMD%" install
    ) else (
        npm install
    )
    popd
    if errorlevel 1 (
        echo.
        echo  [ERROR] Failed to install dependencies.
        echo  Make sure you have internet access and try again.
        pause
        exit /b 1
    )
    echo.
    echo  [OK] Dependencies installed!
)

echo.
echo  [START] Starting DietEase+ backend server...
echo  [INFO]  Open your browser at: http://localhost:3000
echo  [INFO]  Press Ctrl+C to stop the server.
echo.

:: Open browser after a short delay (2 seconds)
start "" /B cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000/index.html"

:: Start the server from backend folder
if defined NPM_CMD (
    "%NODE_EXE%" backend\server.js
) else (
    node backend\server.js
)

:: If server exits, pause so user can see the output
echo.
echo  Server stopped. Press any key to exit.
pause >nul
