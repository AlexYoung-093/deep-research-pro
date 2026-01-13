# Deep Research Pro

> 基于 AI 的深度研究报告生成工具，支持实时进度展示和数据可视化

## 📖 项目简介

Deep Research Pro 是一个完整的深度研究报告生成解决方案，包含：

1. **Dify 工作流**：多源信息抓取、深度分析、报告撰写、数据可视化
2. **Next.js 前端**：用户友好的研究参数输入、实时进度展示、报告预览与下载

### 核心功能

- 🔍 **多源搜索**：自动从 DuckDuckGo、Brave Search 抓取搜索结果
- 📊 **深度分析**：AI 驱动的信息整合与深度分析
- 📝 **专业报告**：自然段落式的专业研究报告
- 📈 **数据可视化**：自动生成柱状图、折线图、饼图、雷达图
- ⚡ **实时进度**：SSE 流式响应，实时展示执行进度
- 🎨 **苹果风格**：极简主义设计，中性色调

---

## 🚀 快速开始

### 环境要求

- Node.js 18.x 或更高版本
- npm 或 pnpm
- Dify 平台账号

### 安装步骤

#### 1. 克隆或进入项目目录

```bash
cd E:\PersonalWeb\2026.01.05_DeepResearch_Pro
```

#### 2. 安装前端依赖

```bash
cd frontend
npm install
```

#### 3. 配置环境变量

复制环境变量示例文件并配置：

```bash
copy env.example .env.local
```

编辑 `.env.local` 文件：

```env
# Dify API 配置
DIFY_API_URL=https://dify-dev.xtalpi.xyz/v1/workflows/run
DIFY_API_KEY=app-jhoF6qA8f8ATengXDp6v8vuj

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Deep Research Pro
```

#### 4. 导入 Dify 工作流

1. 登录 Dify 平台
2. 创建新应用 → 选择"工作流"类型
3. 导入工作流文件：`dify_workflow/deep_research_workflow_v2.yml`
4. 配置 LLM 模型（需要支持 OpenAI API 兼容格式，推荐使用 DeepSeek/智谱）
5. 发布工作流并获取 API Key（在应用设置 → API 访问中获取）

> 💡 **说明**：工作流已内置 Jina Reader API Key，无需额外配置。如需使用自己的 Key，可在工作流环境变量中修改 `JINA_API_KEY`。

#### 5. 启动开发服务器

```bash
npm run dev
```

#### 6. 访问应用

打开浏览器访问：http://localhost:3000

---

## 📁 项目结构

```
2026.01.05_DeepResearch_Pro/
├── .claude/                      # Claude Skills 配置
│   ├── settings.local.json
│   └── skills/                   # 本地技能定义
│       ├── frontend-design/
│       ├── artifacts-builder/
│       ├── echarts-visualization/
│       ├── nextjs-app-router/
│       ├── sse-streaming/
│       └── zustand-state/
├── dify_workflow/               # Dify 工作流
│   └── deep_research_workflow_v2.yml
├── frontend/                    # Next.js 前端应用
│   ├── app/                     # App Router
│   │   ├── api/research/stream/ # SSE 流式 API
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                  # Shadcn/ui 组件
│   │   ├── layout/              # 布局组件
│   │   ├── research/            # 业务组件
│   │   └── charts/              # 图表组件
│   ├── lib/
│   │   ├── hooks/               # 自定义 Hooks
│   │   ├── stores/              # Zustand 状态
│   │   └── utils/               # 工具函数
│   └── types/                   # TypeScript 类型
├── scripts/                     # 脚本文件
├── CLAUDE.md                    # Claude 项目配置
├── SKILLS_SETUP.md              # Skills 配置指南
└── README.md                    # 本文件
```

---

## 🎯 使用指南

### 1. 填写研究参数

在首页表单中填写以下信息：

| 字段 | 说明 | 可选值 |
|------|------|--------|
| 研究主题 | 你想研究的主题 | 自由输入 |
| 报告类型 | 报告的分析角度 | 行业研报 / 竞品分析 / 技术调研 / 市场分析 / 趋势预测 / 政策解读 |
| 研究深度 | 分析深度 | 快速概览 / 中度分析 / 深度研究 |
| 报告字数 | 期望的报告长度 | 1500字 / 3000字 / 5000字 / 8000字 |

### 2. 等待执行

点击"开始深度研究"后：

1. 右侧进度面板会实时显示执行状态
2. 每个节点完成时会显示耗时
3. 整体进度条显示完成百分比
4. 预计耗时：5-30 分钟（取决于深度和网络）

### 3. 查看报告

执行完成后：

- **报告预览**：在 iframe 中查看渲染后的 HTML 报告
- **数据图表**：自动生成的可视化图表（柱状图、折线图、饼图等）
- **源代码**：查看原始 HTML 代码

### 4. 下载报告

- 点击"下载报告"保存 HTML 文件
- 点击"下载图表"保存图表配置 JSON
- 点击"新窗口打开"在浏览器中全屏查看

---

## 📊 图表类型

系统会根据报告内容自动生成以下类型的图表：

| 类型 | 用途 | 示例场景 |
|------|------|----------|
| 柱状图 (bar) | 对比数据 | 市场份额对比、产品销量对比 |
| 折线图 (line) | 趋势数据 | 年度增长趋势、价格变化 |
| 饼图 (pie) | 分布数据 | 市场占比、用户构成 |
| 雷达图 (radar) | 多维评估 | 竞品能力对比、产品评分 |
| 表格 (table) | 详细数据 | 关键指标列表、参数对比 |

### 图表配色

采用苹果风格中性色调：
- 主色序列：`#1d1d1f`, `#636366`, `#86868b`, `#aeaeb2`
- 强调色：`#34c759`（绿）、`#ff9f0a`（橙）

---

## 🔧 Dify 工作流说明

### 工作流节点

| 节点 | 功能 | 输出 |
|------|------|------|
| 开始 | 接收输入参数 | research_topic, report_type, depth_level, word_count |
| HTTP抓取 (×3) | 并行抓取搜索结果 | DuckDuckGo, Brave Search, 深度搜索 结果 |
| 研究规划 | 制定研究框架 | 结构化研究计划 |
| 信息整合 | 深度分析 | 整合后的分析内容 |
| 报告撰写 | 生成报告 | 自然段落式报告 |
| 数据结构化 | 提取数据 | JSON 格式结构化数据 |
| 图表配置 | 生成图表 | ECharts 配置数组 |
| HTML转换 | 格式化 | 精美 HTML 页面 |
| 结束 | 输出结果 | HTML、图表、结构化数据 |

### 输出变量

| 变量 | 类型 | 说明 |
|------|------|------|
| html_content | string | HTML 格式的报告内容 |
| report_content | string | 纯文本格式报告 |
| charts_json | string | 图表配置 JSON 数组 |
| structured_data | string | 结构化数据 JSON |

---

## 🎨 设计规范

### 配色方案

```css
/* 主色调 - 中性色 */
--color-primary: #1d1d1f;       /* 深灰黑 - 标题文字 */
--color-secondary: #86868b;     /* 中灰 - 次要文字 */
--color-tertiary: #f5f5f7;      /* 浅灰 - 背景 */

/* 强调色（谨慎使用） */
--accent-green: #34c759;
--accent-orange: #ff9f0a;
--accent-red: #ff3b30;
```

### 字体层级

```css
.display    { font-size: 80px; font-weight: 600; }
.headline   { font-size: 48px; font-weight: 600; }
.title      { font-size: 32px; font-weight: 600; }
.callout    { font-size: 21px; font-weight: 400; }
.body       { font-size: 17px; font-weight: 400; }
```

---

## 🛠 技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 14.2 | React 框架 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 3.4 | 样式框架 |
| Shadcn/ui | - | UI 组件库 |
| Zustand | 5.x | 状态管理 |
| Framer Motion | 11.x | 动画效果 |
| ECharts | 5.5 | 数据可视化 |
| Lucide Icons | - | 图标库 |

### 后端

| 技术 | 说明 |
|------|------|
| Dify | 工作流编排平台 |
| LLM | Claude / GPT / 自定义模型 |
| Jina Reader | 网页内容抓取 |

---

## ❓ 常见问题

### Q: API Key 从哪里获取？

1. 登录 Dify 平台
2. 进入已发布的工作流应用
3. 点击"API 访问" → 复制 API Key

### Q: 为什么图表没有生成？

可能原因：
1. 报告内容中没有可提取的数值数据
2. LLM 生成的 JSON 格式不正确
3. 网络问题导致节点执行失败

解决方案：检查 Dify 工作流日志，确认"数据结构化提取"和"图表配置生成"节点正常执行。

### Q: 报告生成很慢怎么办？

影响因素：
1. 深度级别越高，耗时越长
2. 网络访问外部搜索引擎可能较慢
3. LLM 推理速度

建议：
- 选择"快速概览"模式进行测试
- 确保网络可以正常访问 Jina Reader

### Q: 如何自定义图表样式？

修改 `frontend/components/charts/ChartRenderer.tsx` 中的：
- `APPLE_THEME` 对象：调整颜色、字体等
- `enhanceChartOption` 函数：调整图表增强逻辑

---

## 📝 开发指南

### 添加新的图表类型

1. 在 `types/research.ts` 中添加类型定义
2. 在 `lib/utils/chartParser.ts` 中添加生成逻辑
3. 在 `ChartRenderer.tsx` 中添加渲染逻辑

### 修改 Dify 工作流

1. 编辑 `dify_workflow/deep_research_workflow_v2.yml`
2. 在 Dify 平台重新导入
3. 测试并发布

### 添加新的 UI 组件

```bash
# 使用 shadcn/ui CLI（如果已安装）
npx shadcn@latest add [component-name]
```

---

## 📄 许可证

本项目仅供学习和内部使用。

---

## 🙏 致谢

- [Dify](https://dify.ai) - AI 应用开发平台
- [Shadcn/ui](https://ui.shadcn.com) - UI 组件库
- [ECharts](https://echarts.apache.org) - 数据可视化库
- [Jina AI](https://jina.ai) - 网页内容抓取服务

---

**创建日期**: 2026-01-06  
**版本**: 2.0.0  
**作者**: Deep Research Pro Team

