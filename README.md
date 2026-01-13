# Deep Research Pro

> 🔬 基于 AI 的智能深度研究报告生成系统

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Dify](https://img.shields.io/badge/Dify-Workflow-purple)](https://dify.ai/)
[![License](https://img.shields.io/badge/License-Private-red)]()

---

## 📖 项目简介

**Deep Research Pro** 是一个完整的 AI 驱动深度研究报告生成解决方案。系统通过多源信息抓取、AI 深度分析、专业报告撰写和数据可视化，帮助用户快速生成高质量的研究报告。

### 🎯 应用场景

- 📊 **商务 BD 团队**：竞品调研报告、市场分析稿件
- 📈 **行业研究**：行业研报、趋势预测
- 🎓 **学术研究**：毕业论文选题资料收集、行业背景了解
- 💼 **企业决策**：技术调研、政策解读

---

## ✨ 核心功能

| 功能 | 描述 |
|------|------|
| 🔍 **多源信息抓取** | 自动从 DuckDuckGo、Brave Search 等搜索引擎抓取相关信息 |
| 🧠 **AI 深度分析** | 基于大语言模型的信息整合与深度分析 |
| 📝 **专业报告生成** | 自然段落式的专业研究报告，支持多种报告类型 |
| 📊 **数据可视化** | 自动生成柱状图、折线图、饼图、雷达图、表格等 |
| ⚡ **实时进度展示** | SSE 流式响应，实时显示每个节点的执行状态 |
| 🎨 **苹果风格 UI** | 极简主义设计，中性色调，流畅动画效果 |
| 🎉 **视觉反馈** | 步骤完成彩带效果，任务完成庆祝动画 |

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         用户浏览器                               │
│                    (Next.js 14 Frontend)                        │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTP Request
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js API Route                            │
│                  /api/research/stream                           │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │ 请求验证    │ -> │ Dify API    │ -> │ SSE 流转发  │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
└─────────────────────────┬───────────────────────────────────────┘
                          │ SSE Stream
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Dify Workflow Engine                         │
│                                                                 │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│  │ 开始节点 │ → │ HTTP抓取 │ → │ 研究规划 │ → │ 信息整合 │    │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘    │
│                       │                             │          │
│                       ▼                             ▼          │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│  │ 结束节点 │ ← │ HTML转换 │ ← │ 图表生成 │ ← │ 报告撰写 │    │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 项目结构

```
2026.01.05_DeepResearch_Pro/
│
├── 📂 dify_workflow/                    # 🔧 后端 - Dify 工作流配置
│   ├── deep_research_workflow_v2.yml    # V2 版本
│   ├── deep_research_workflow_v3.yml    # V3 版本
│   ├── deep_research_workflow_v4.yml    # V4 版本
│   └── deep_research_workflow_v5_stable.yml   # ⭐ V5 稳定版 (当前使用)
│
├── 📂 frontend/                         # 🌐 前端 - Next.js 14 应用
│   ├── app/                             # App Router
│   │   ├── api/research/stream/         # SSE 流式 API 端点
│   │   ├── page.tsx                     # 主页面
│   │   ├── layout.tsx                   # 根布局
│   │   ├── globals.css                  # 全局样式
│   │   ├── error.tsx                    # 错误处理
│   │   ├── loading.tsx                  # 加载状态
│   │   └── not-found.tsx                # 404 页面
│   │
│   ├── components/                      # React 组件
│   │   ├── charts/                      # 📊 图表组件
│   │   │   ├── ChartRenderer.tsx        # ECharts 渲染器
│   │   │   └── index.ts
│   │   ├── effects/                     # ✨ 视觉效果
│   │   │   ├── Confetti.tsx             # 完成庆祝彩带
│   │   │   ├── StepConfetti.tsx         # 步骤完成彩带
│   │   │   ├── SparkleBackground.tsx    # 背景效果
│   │   │   └── index.ts
│   │   ├── layout/                      # 📐 布局组件
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts
│   │   ├── research/                    # 🔬 业务组件
│   │   │   ├── ResearchForm.tsx         # 研究参数表单
│   │   │   ├── ProgressPanel.tsx        # 进度面板
│   │   │   ├── ReportViewer.tsx         # 报告查看器
│   │   │   └── index.ts
│   │   ├── ui/                          # 🎨 Shadcn/ui 基础组件
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── progress.tsx
│   │   │   └── ... (更多组件)
│   │   └── providers/
│   │       └── ThemeProvider.tsx        # 主题提供者
│   │
│   ├── lib/                             # 工具库
│   │   ├── hooks/
│   │   │   └── useWorkflowSSE.ts        # SSE 连接 Hook
│   │   ├── stores/
│   │   │   └── researchStore.ts         # Zustand 状态管理
│   │   ├── utils/
│   │   │   ├── chartParser.ts           # 图表解析工具
│   │   │   └── progress.ts              # 进度计算工具
│   │   └── utils.ts                     # 通用工具函数
│   │
│   ├── types/
│   │   └── research.ts                  # TypeScript 类型定义
│   │
│   ├── package.json                     # 依赖配置
│   ├── tailwind.config.ts               # Tailwind 配置
│   ├── tsconfig.json                    # TypeScript 配置
│   └── next.config.mjs                  # Next.js 配置
│
├── 📂 docs/                             # 📖 文档
│   ├── 使用说明.md                       # 使用指南
│   └── UPGRADE_PLAN_V7.md               # V7 升级计划
│
├── 📂 archive/                          # 📦 历史版本存档
│   └── v1.0.0_2026-01-08/               # V1.0 备份
│
├── 📂 scripts/                          # 🔧 脚本
│   └── install-skills.ps1               # Skills 安装脚本
│
├── 📂 .claude/                          # Claude Skills 配置
│   └── skills/                          # 本地技能定义
│
├── README.md                            # 📄 本文件
├── CLAUDE.md                            # Claude 项目配置
├── VERSION_INFO.txt                     # 版本信息
├── 启动DeepResearch.bat                 # ⚡ 一键启动
├── 停止DeepResearch.bat                 # ⏹ 一键停止
└── 创建桌面快捷方式.bat                  # 🔗 创建快捷方式
```

---

## 🔄 数据流转

### 1. 用户请求流程

```
用户填写表单 → 点击"开始研究" → 前端发起 POST 请求
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│  请求参数:                                                   │
│  {                                                          │
│    research_topic: "人工智能在医疗领域的应用",               │
│    report_type: "行业研报",                                  │
│    depth_level: "深度研究",                                  │
│    word_count: "5000字"                                     │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

### 2. 后端处理流程

```
Next.js API (/api/research/stream)
     │
     ├─→ 验证请求参数
     │
     ├─→ 调用 Dify Workflow API (blocking: false)
     │
     └─→ 建立 SSE 连接，转发工作流事件
```

### 3. Dify 工作流执行

```
开始节点 (接收参数)
     │
     ├─→ HTTP 抓取节点 (并行)
     │   ├─ DuckDuckGo 搜索
     │   ├─ Brave Search 搜索
     │   └─ 深度搜索
     │
     ├─→ 研究规划节点 (LLM)
     │   └─ 制定研究框架
     │
     ├─→ 信息整合节点 (LLM)
     │   └─ 深度分析整合
     │
     ├─→ 报告撰写节点 (LLM)
     │   └─ 生成专业报告
     │
     ├─→ 数据结构化节点 (LLM)
     │   └─ 提取结构化数据
     │
     ├─→ 图表配置节点 (LLM)
     │   └─ 生成 ECharts 配置
     │
     ├─→ HTML 转换节点 (LLM)
     │   └─ 格式化为 HTML
     │
     └─→ 结束节点
         └─ 输出: html_content, charts_json, structured_data
```

### 4. SSE 事件流

```
Dify → Next.js API → 浏览器

事件类型:
├─ workflow_started      # 工作流开始
├─ node_started          # 节点开始执行
├─ node_finished         # 节点执行完成
├─ text_chunk            # 文本流式输出
├─ workflow_finished     # 工作流完成
└─ error                 # 错误事件
```

### 5. 前端状态更新

```
useWorkflowSSE Hook
     │
     ├─→ 解析 SSE 事件
     │
     ├─→ 更新 Zustand Store
     │   ├─ progress.percentage
     │   ├─ progress.currentNode
     │   ├─ progress.completedNodes
     │   └─ progress.elapsedTime
     │
     ├─→ 触发视觉效果
     │   ├─ StepConfetti (步骤完成)
     │   └─ Confetti (任务完成)
     │
     └─→ 渲染结果
         ├─ HTML 报告
         ├─ ECharts 图表
         └─ 结构化数据
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** 18.x 或更高版本
- **npm** 或 **pnpm**
- **Dify** 平台账号

### 安装步骤

#### 1. 进入项目目录

```bash
cd E:\PersonalWeb\2026.01.05_DeepResearch_Pro
```

#### 2. 安装前端依赖

```bash
cd frontend
npm install
```

#### 3. 配置环境变量

```bash
copy env.example .env.local
```

编辑 `.env.local`：

```env
DIFY_API_URL=https://your-dify-instance/v1/workflows/run
DIFY_API_KEY=app-your-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Deep Research Pro
```

#### 4. 导入 Dify 工作流

1. 登录 Dify 平台
2. 创建新应用 → 选择"工作流"
3. 导入 `dify_workflow/deep_research_workflow_v5_stable.yml`
4. 配置 LLM 模型
5. 发布并获取 API Key

#### 5. 启动开发服务器

**方式一：一键启动**
```
双击运行 "启动DeepResearch.bat"
```

**方式二：命令行**
```bash
cd frontend
npm run dev
```

#### 6. 访问应用

打开浏览器：http://localhost:3000

---

## 🎯 使用指南

### 填写研究参数

| 参数 | 说明 | 可选值 |
|------|------|--------|
| 研究主题 | 你想研究的主题 | 自由输入 |
| 报告类型 | 报告的分析角度 | 行业研报 / 竞品分析 / 技术调研 / 市场分析 / 趋势预测 / 政策解读 |
| 研究深度 | 分析深度级别 | 快速概览 / 中度分析 / 深度研究 |
| 报告字数 | 期望的报告长度 | 1500字 / 3000字 / 5000字 / 8000字 |

### 执行过程

1. 点击"开始深度研究"
2. 右侧进度面板实时显示执行状态
3. 每个节点完成时显示耗时
4. 步骤完成时触发彩带效果
5. 预计耗时：5-30 分钟

### 查看报告

- **报告预览**：渲染后的 HTML 报告
- **数据图表**：自动生成的可视化图表
- **下载报告**：保存 HTML 文件
- **下载图表**：保存 ECharts 配置

---

## 📊 图表类型

| 类型 | 用途 | 示例场景 |
|------|------|----------|
| 柱状图 (bar) | 对比数据 | 市场份额、产品销量 |
| 折线图 (line) | 趋势数据 | 年度增长、价格变化 |
| 饼图 (pie) | 分布数据 | 市场占比、用户构成 |
| 雷达图 (radar) | 多维评估 | 竞品能力、产品评分 |
| 表格 (table) | 详细数据 | 关键指标、参数对比 |

---

## 🛠️ 技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 14.2 | React 全栈框架 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 3.4 | 原子化样式 |
| Shadcn/ui | - | UI 组件库 |
| Zustand | 5.x | 状态管理 |
| Framer Motion | 11.x | 动画效果 |
| ECharts | 5.5 | 数据可视化 |
| Lucide Icons | - | 图标库 |

### 后端

| 技术 | 说明 |
|------|------|
| Dify | 工作流编排平台 |
| LLM | Claude / GPT / DeepSeek / 智谱 |
| Jina Reader | 网页内容抓取 |
| SSE | 服务器推送事件 |

---

## 📝 版本历史

| 版本 | 日期 | 主要更新 |
|------|------|----------|
| V5.0 | 2026-01-13 | 稳定版发布，彩带效果，完整文档 |
| V4.0 | 2026-01-09 | 一键启动脚本，进度面板优化 |
| V3.0 | 2026-01-08 | 图表类型增加，UI 优化 |
| V2.0 | 2026-01-07 | SSE 流式响应，实时进度 |
| V1.0 | 2026-01-06 | 基础功能实现 |

---

## ❓ 常见问题

### Q: API Key 从哪里获取？

1. 登录 Dify 平台
2. 进入已发布的工作流应用
3. 点击"API 访问" → 复制 API Key

### Q: 报告生成很慢？

影响因素：
- 深度级别越高耗时越长
- 网络访问外部搜索引擎
- LLM 推理速度

建议：选择"快速概览"模式测试

### Q: 图表没有生成？

可能原因：
1. 报告内容无可提取数值
2. LLM 生成的 JSON 格式错误
3. 网络问题导致节点失败

---

## 📄 许可证

本项目仅供学习和内部使用。

---

## 🙏 致谢

- [Dify](https://dify.ai) - AI 应用开发平台
- [Shadcn/ui](https://ui.shadcn.com) - UI 组件库
- [ECharts](https://echarts.apache.org) - 数据可视化库
- [Jina AI](https://jina.ai) - 网页内容抓取服务
- [Framer Motion](https://www.framer.com/motion/) - 动画库

---

**创建日期**: 2026-01-06  
**最后更新**: 2026-01-13  
**版本**: 5.0.0  
**作者**: Deep Research Pro Team
