# Deep Research Pro - Claude Skills 安装脚本

Write-Host "========================================"
Write-Host "  Deep Research Pro - Skills 安装脚本"
Write-Host "========================================"
Write-Host ""

$projectRoot = $PSScriptRoot | Split-Path -Parent
Set-Location $projectRoot

Write-Host "[1/4] 检查 Claude 配置目录..."
Write-Host ""

$claudeDir = ".claude"
$skillsDir = ".claude\skills"

if (-not (Test-Path $claudeDir)) { New-Item -ItemType Directory -Path $claudeDir -Force | Out-Null }
if (-not (Test-Path $skillsDir)) { New-Item -ItemType Directory -Path $skillsDir -Force | Out-Null }

Write-Host "[2/4] 本地 Skills:"
Write-Host ""
Get-ChildItem -Path $skillsDir -Directory | ForEach-Object { Write-Host "    [OK] $($_.Name)" }

Write-Host ""
Write-Host "[3/4] 市场 Skills 安装指南"
Write-Host ""
Write-Host "请在 Claude Code 中运行以下命令:"
Write-Host ""
Write-Host "/plugin marketplace add anthropics/skills"
Write-Host "/plugin marketplace add anthropics/frontend-design"
Write-Host "/plugin marketplace add anthropics/artifacts-builder"
Write-Host "/plugin marketplace add anthropics/canvas-design"
Write-Host "/plugin marketplace add anthropics/mcp-builder"
Write-Host "/plugin marketplace add NakanoSanku/OhMySkills"
Write-Host "/plugin marketplace add obra/superpowers"
Write-Host ""

Write-Host "[4/4] 配置文件检查"
Write-Host ""
if (Test-Path ".claude\settings.local.json") { Write-Host "    [OK] settings.local.json" }
if (Test-Path "CLAUDE.md") { Write-Host "    [OK] CLAUDE.md" }

Write-Host ""
Write-Host "========================================"
Write-Host "  安装完成！"
Write-Host "========================================"
