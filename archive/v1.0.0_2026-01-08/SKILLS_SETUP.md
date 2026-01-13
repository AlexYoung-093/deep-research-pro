# Claude Skills 配置指南

本文档详细介绍如何为 Deep Research Pro 项目配置和安装 Claude Skills。

## 什么是 Claude Skills？

[Claude Skills](https://github.com/travisvn/awesome-claude-skills) 是 Claude AI 的插件系统，允许通过安装不同的技能来扩展 Claude 的能力。Skills 采用**渐进式披露架构**：

1. **元数据加载** (~100 tokens): 扫描可用 Skills
2. **完整指令** (<5k tokens): 相关时才加载
3. **捆绑资源**: 按需加载

## 目录结构

```
2026.01.05_DeepResearch_Pro/
├── .claude/
│   ├── settings.local.json     # 权限和 Skills 配置
│   └── skills/                  # 本地 Skills 目录
│       ├── frontend-design/     # 前端设计技能
│       │   └── SKILL.md
│       ├── artifacts-builder/   # 制品构建技能
│       │   └── SKILL.md
│       ├── echarts-visualization/ # ECharts 可视化
│       │   └── SKILL.md
│       ├── nextjs-app-router/   # Next.js App Router
│       │   └── SKILL.md
│       ├── sse-streaming/       # SSE 流式响应
│       │   └── SKILL.md
│       └── zustand-state/       # Zustand 状态管理
│           └── SKILL.md
├── CLAUDE.md                    # 项目说明文件
└── scripts/
    └── install-skills.ps1       # 安装脚本
```

## 已配置的本地 Skills

### 1. Frontend Design (前端设计)

**用途**: 指导 Claude 避免"AI slop"或通用美学，做出大胆的设计决策。

**核心内容**:
- 苹果官网风格的配色方案
- 字体层级和间距规范
- 交互设计指南
- 组件设计规范
- 禁止事项清单

### 2. Artifacts Builder (制品构建)

**用途**: 使用 React + Tailwind CSS + Shadcn/ui 构建高质量的前端制品。

**核心内容**:
- Shadcn/ui 组件使用指南
- 组件组合示例（表单、进度、标签页）
- Tailwind CSS 最佳实践
- Lucide Icons 使用

### 3. ECharts Visualization (图表可视化)

**用途**: 使用 ECharts 5.x 创建专业的数据可视化图表。

**核心内容**:
- 苹果风格配色方案
- 柱状图、折线图、饼图、雷达图模板
- React 组件集成
- 暗色模式适配

### 4. Next.js App Router

**用途**: Next.js 14 App Router 最佳实践和模式。

**核心内容**:
- 项目结构规范
- 布局模式
- API Routes (普通和 SSE 流式)
- 客户端组件模式
- 环境变量配置

### 5. SSE Streaming (流式响应)

**用途**: Server-Sent Events 流式响应处理。

**核心内容**:
- Dify SSE 事件格式
- 前端连接实现
- React Hook 封装
- 后端代理实现
- 进度计算

### 6. Zustand State (状态管理)

**用途**: Zustand 状态管理最佳实践。

**核心内容**:
- Store 设计模式
- 选择器优化
- 派生状态
- 持久化配置
- DevTools 集成

## 市场 Skills 安装

### 官方 Skills

在 Claude Code 中运行以下命令：

```bash
# 官方技能包
/plugin marketplace add anthropics/skills

# 前端设计
/plugin marketplace add anthropics/frontend-design

# 制品构建
/plugin marketplace add anthropics/artifacts-builder

# 画布设计
/plugin marketplace add anthropics/canvas-design

# MCP 服务器构建
/plugin marketplace add anthropics/mcp-builder
```

### 社区 Skills

```bash
# OhMySkills - 前端设计系统
/plugin marketplace add NakanoSanku/OhMySkills

# Superpowers - 核心技能库 (TDD、调试、协作)
/plugin marketplace add obra/superpowers
```

## Skills 使用方法

### 自动加载

Claude 会自动扫描 `.claude/skills/` 目录下的所有 SKILL.md 文件，并在相关任务时自动加载。

### 手动触发

你可以在对话中明确提及 skill 名称来触发加载：

```
请使用 frontend-design skill 来设计登录页面
```

```
按照 echarts-visualization 的规范创建一个柱状图
```

### 验证 Skills

运行安装脚本检查配置：

```powershell
.\scripts\install-skills.ps1
```

## 参考资源

### 官方文档
- [Anthropic Skills 官方文档](https://support.claude.com/zh-CN/articles/12512198-如何创建自定义-skills)
- [Skills 解释博文](https://www.anthropic.com/news/claude-skills)

### 社区资源
- [Awesome Claude Skills](https://github.com/travisvn/awesome-claude-skills) - 精选 Skills 列表
- [Claude Skills 学习与案例库](https://www.claudeskills.org/zh/docs/skills-cases)
- [obra/superpowers](https://github.com/obra/superpowers) - 核心技能库

### 分析文章
- [Simon Willison: Claude Skills are awesome, maybe a bigger deal than MCP](https://simonwillison.net/)

## 安全注意事项

⚠️ **重要**: Skills 可以在 Claude 环境中执行任意代码。

1. **仅安装可信来源的 Skills**
2. **安装前审查 SKILL.md 和所有脚本**
3. **谨慎处理请求敏感数据访问的 Skills**
4. **在生产环境部署前仔细审计**

## 故障排除

### Skills 未加载

1. 检查 `Settings > Capabilities` 确保 Skills 已启用
2. 确认 SKILL.md 有正确的 YAML frontmatter 格式
3. 重启 Claude

### 权限错误

1. 检查 `.claude/settings.local.json` 配置
2. 验证文件权限

### Skills 执行失败

1. 检查脚本依赖是否已安装
2. 查看错误日志
3. 单独测试脚本

---

**创建日期**: 2026-01-06  
**项目**: Deep Research Pro  
**作者**: AI Assistant

