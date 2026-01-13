@echo off
chcp 936 >nul
title Deep Research Pro V5 Stable

echo.
echo  ================================================================
echo                Deep Research Pro V5 Stable
echo          API: app-FcTZ4Sxmj3wBtUx69h9B83e9
echo  ================================================================
echo.

cd /d E:\PersonalWeb\2026.01.05_DeepResearch_Pro\frontend

echo [1/6] Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo  ERROR: Node.js not found. Please install Node.js first.
    echo  Download: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo       OK - Node.js ready

echo [2/6] Stopping existing processes...
taskkill /F /IM node.exe >nul 2>nul
timeout /t 2 /nobreak >nul
echo       OK - Processes stopped

echo [3/6] Checking dependencies...
if not exist "node_modules" (
    echo       Installing dependencies, please wait...
    npm install >nul 2>nul
)
echo       OK - Dependencies ready

echo [4/6] Clearing cache...
if exist ".next" (
    rmdir /s /q ".next" >nul 2>nul
    echo       OK - Cache cleared
) else (
    echo       OK - No cache to clear
)

echo [5/6] Starting dev server...
echo       Please wait, first start may take 30-60 seconds...
echo.

start "" /min cmd /c "npm run dev"

echo [6/6] Waiting for server to compile...
echo       This may take a moment...

set /a count=0
:waitloop
timeout /t 3 /nobreak >nul
set /a count+=1

REM Check if port 3000 or 3001 is listening
netstat -ano | findstr ":3000.*LISTENING" >nul 2>nul
if %errorlevel% equ 0 (
    set PORT=3000
    goto :checkcompile
)
netstat -ano | findstr ":3001.*LISTENING" >nul 2>nul
if %errorlevel% equ 0 (
    set PORT=3001
    goto :checkcompile
)

if %count% lss 30 (
    echo       Waiting for server... (%count%/30)
    goto :waitloop
)

echo.
echo  WARNING: Server start timeout
set PORT=3000
goto :openurl

:checkcompile
REM Wait additional time for compilation
echo       Server detected on port %PORT%, waiting for compile...
timeout /t 10 /nobreak >nul

:openurl
echo       OK - Server ready (Port %PORT%)
echo.
echo  ================================================================
echo                    SERVER STARTED!
echo.
echo         Opening browser: http://localhost:%PORT%
echo.
echo         To stop: Run stop script or close cmd window
echo  ================================================================
echo.

start "" http://localhost:%PORT%

echo Press any key to close this window...
pause >nul
