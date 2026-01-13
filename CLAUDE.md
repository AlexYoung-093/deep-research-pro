# Deep Research Pro - Claude 项目配置

## 项目概述

这是一个深度研究报告生成器的前端应用，基于 Next.js 14 构建，具备：
- 用户友好的研究参数输入界面
- 实时进度展示（SSE 流式响应）
- 报告预览与下载
- ECharts 数据可视化集成

## 技术栈

- **框架**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + Shadcn/ui
- **状态管理**: Zustand
- **动画**: Framer Motion
- **图表**: ECharts 5.x
- **图标**: Lucide Icons

## 设计风格

采用苹果官网风格的极简主义设计：
- **配色**: 中性色调（深灰、浅灰、米白），禁用蓝紫色
- **字体**: SF Pro Display / Inter
- **特点**: 大量留白、层级化字体、精致的微交互

## 开发规范

### 代码风格
- 使用 TypeScript 严格模式
- 组件使用函数式组件 + Hooks
- 文件命名使用 PascalCase（组件）或 camelCase（工具函数）

### 组件结构
- `components/ui/` - Shadcn/ui 基础组件
- `components/research/` - 业务组件
- `components/layout/` - 布局组件

### 状态管理
- 使用 Zustand 进行全局状态管理
- 复杂异步操作使用 React Query

## API 集成

### Dify Workflow API
- 端点: `http://dify-dev.xtalpi.xyz/v1/workflows/run`
- 认证: Bearer Token
- 模式: Streaming (SSE)

### SSE 事件类型
- `workflow_started` - 工作流启动
- `node_started` - 节点开始执行
- `node_finished` - 节点执行完成
- `workflow_finished` - 工作流完成
- `error` - 错误

## 目录结构

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── api/               # API Routes (BFF)
├── components/            # 组件库
│   ├── ui/               # Shadcn/ui 组件
│   ├── research/         # 业务组件
│   └── layout/           # 布局组件
├── lib/                   # 工具库
│   ├── api/              # API 封装
│   ├── hooks/            # 自定义 Hooks
│   ├── stores/           # Zustand 状态
│   └── utils/            # 工具函数
└── public/               # 静态资源
```

## Skills 加载

本项目配置了以下 Claude Skills 以增强开发能力：

### 官方 Skills
- `anthropics/frontend-design` - 避免"AI slop"风格，做出大胆的设计决策
- `anthropics/artifacts-builder` - 使用 React + Tailwind + Shadcn/ui 构建 HTML 制品
- `anthropics/canvas-design` - 设计精美的视觉艺术

### 社区 Skills
- `NakanoSanku/OhMySkills` - 前端设计系统，提供多种设计风格
- `obra/superpowers` - TDD、调试和协作模式的核心技能库

## 注意事项

1. **禁止**使用蓝紫色配色，采用苹果风格的中性色调
2. **禁止**生成"AI slop"风格的通用界面
3. **确保**所有组件支持明暗主题切换
4. **确保**响应式设计适配移动端


