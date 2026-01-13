@echo off
chcp 65001 >nul
title 创建桌面快捷方式

echo.
echo  正在创建桌面快捷方式...
echo.

set SCRIPT_PATH=E:\PersonalWeb\2026.01.05_DeepResearch_Pro\启动DeepResearch.bat
set SHORTCUT_PATH=%USERPROFILE%\Desktop\Deep Research Pro.lnk

REM 使用 PowerShell 创建快捷方式
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT_PATH%'); $s.TargetPath = '%SCRIPT_PATH%'; $s.WorkingDirectory = 'E:\PersonalWeb\2026.01.05_DeepResearch_Pro'; $s.Description = 'Deep Research Pro - 智能研究报告系统'; $s.Save()"

if exist "%SHORTCUT_PATH%" (
    echo  ╔══════════════════════════════════════════════════════════════╗
    echo  ║                                                              ║
    echo  ║              ✓ 桌面快捷方式创建成功！                        ║
    echo  ║                                                              ║
    echo  ║         快捷方式位置: 桌面\Deep Research Pro                 ║
    echo  ║                                                              ║
    echo  ║         双击即可启动系统                                     ║
    echo  ║                                                              ║
    echo  ╚══════════════════════════════════════════════════════════════╝
) else (
    echo  ❌ 创建失败，请手动创建快捷方式
    echo     目标文件: %SCRIPT_PATH%
)

echo.
timeout /t 5 >nul



