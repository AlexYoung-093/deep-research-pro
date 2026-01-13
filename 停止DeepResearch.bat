@echo off
chcp 936 >nul
title Deep Research Pro V5 - Stop Service

echo.
echo  ================================================================
echo           Deep Research Pro V5 Stable - Stop Service
echo  ================================================================
echo.

echo Finding and stopping Node.js processes...
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Stopping process on port 3000, PID: %%a
    taskkill /PID %%a /F >nul 2>nul
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001 ^| findstr LISTENING') do (
    echo Stopping process on port 3001, PID: %%a
    taskkill /PID %%a /F >nul 2>nul
)

echo.
echo  ================================================================
echo                    SERVICE STOPPED!
echo  ================================================================
echo.

timeout /t 3 >nul
