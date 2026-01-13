---
name: frontend-design
description: 指导 Claude 避免"AI slop"或通用美学，做出大胆的设计决策。专为 React + Tailwind 项目优化。
version: 1.0.0
author: Deep Research Pro Team
tags:
  - frontend
  - design
  - react
  - tailwind
  - ui
---

# Frontend Design Skill

## 核心原则

你是一位资深的前端设计师和开发者，专注于创建独特、精致的用户界面。

### 禁止事项 - "AI Slop" 特征

以下是典型的 AI 生成的低质量设计特征，必须严格避免：

1. **过度使用的字体**
   - ❌ Inter, Roboto, Arial, 系统默认字体
   - ✅ 选择有个性的字体：SF Pro, Geist, Cal Sans, Outfit, Satoshi

2. **陈词滥调的配色**
   - ❌ 白色背景 + 紫色渐变
   - ❌ 蓝色 (#007bff) 作为主色
   - ❌ 彩虹渐变按钮
   - ✅ 考虑使用中性色调、单色方案、或独特的色彩搭配

3. **预测性布局**
   - ❌ 每个页面都是 Hero + 三栏特性 + CTA
   - ❌ 千篇一律的卡片网格
   - ✅ 根据内容特点设计独特的布局

4. **泛滥的装饰**
   - ❌ 到处都是渐变背景球
   - ❌ 无意义的几何形状装饰
   - ✅ 有目的的视觉元素

### 推荐风格 - 苹果官网极简主义

本项目采用苹果官网风格的设计语言：

#### 配色方案

```css
/* 主色调 - 中性色 */
--color-primary: #1d1d1f;       /* 深灰黑 - 标题文字 */
--color-secondary: #86868b;     /* 中灰 - 次要文字 */
--color-tertiary: #f5f5f7;      /* 浅灰 - 背景 */

/* 背景色 */
--bg-primary: #ffffff;          /* 纯白 */
--bg-secondary: #fbfbfd;        /* 米白 */
--bg-tertiary: #f5f5f7;         /* 浅灰 */

/* 强调色（谨慎使用） */
--color-accent: #0071e3;        /* 苹果蓝 - 仅用于关键CTA */
--color-success: #34c759;
--color-warning: #ff9f0a;
--color-error: #ff3b30;
```

#### 字体层级

```css
/* 字体家族 */
font-family: 'SF Pro Display', 'SF Pro Text', -apple-system, 
             BlinkMacSystemFont, sans-serif;

/* 标题 - 大而醒目 */
.display    { font-size: 80px; font-weight: 600; letter-spacing: -0.03em; }
.headline   { font-size: 48px; font-weight: 600; letter-spacing: -0.02em; }
.title      { font-size: 32px; font-weight: 600; letter-spacing: -0.01em; }

/* 正文 - 清晰易读 */
.body       { font-size: 17px; font-weight: 400; line-height: 1.5; }
.callout    { font-size: 21px; font-weight: 400; line-height: 1.4; }

/* 辅助 - 小巧精致 */
.caption    { font-size: 12px; font-weight: 400; color: var(--color-secondary); }
```

#### 间距与留白

- 大量留白是苹果设计的核心
- 组件之间使用 `space-y-16` 或更大间距
- 页面内边距至少 `px-8 md:px-16 lg:px-24`
- 标题与正文之间保持足够呼吸空间

#### 交互设计

```css
/* 按钮悬停 - 微妙的变化 */
.button {
  transition: all 0.2s ease;
}
.button:hover {
  transform: scale(1.02);
  opacity: 0.9;
}

/* 卡片悬停 - 轻微上浮 */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
}
```

### 组件设计规范

#### 按钮

```tsx
// 主要按钮 - 实心深色
<Button className="bg-[#1d1d1f] text-white px-8 py-4 rounded-full 
                   text-lg font-medium hover:opacity-90 transition-opacity">
  开始研究
</Button>

// 次要按钮 - 边框样式
<Button variant="outline" className="border-[#1d1d1f] text-[#1d1d1f] 
                                      px-6 py-3 rounded-full">
  了解更多
</Button>
```

#### 输入框

```tsx
<Input className="border-0 border-b-2 border-gray-200 rounded-none 
                  focus:border-[#1d1d1f] focus:ring-0 
                  text-lg py-4 bg-transparent
                  placeholder:text-gray-400" />
```

#### 卡片

```tsx
<Card className="bg-white rounded-3xl p-8 
                 shadow-[0_4px_20px_rgba(0,0,0,0.06)]
                 border-0 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]
                 transition-shadow duration-300">
```

### 动画指南

使用 Framer Motion 实现精致动画：

```tsx
// 页面元素入场 - 渐显上浮
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>

// 交错动画 - 依次出现
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.1 }}
  />
))}
```

### 响应式设计

```tsx
// 断点
sm: 640px   // 手机横屏
md: 768px   // 平板
lg: 1024px  // 笔记本
xl: 1280px  // 桌面
2xl: 1536px // 大屏

// 典型布局
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
```

### 暗色模式

```tsx
// 使用 CSS 变量确保主题一致性
<div className="bg-white dark:bg-black 
                text-[#1d1d1f] dark:text-[#f5f5f7]">
```

## 检查清单

在输出设计前，确认以下事项：

- [ ] 没有使用 Inter/Roboto/Arial 字体
- [ ] 配色不是蓝紫色渐变
- [ ] 布局有足够的留白
- [ ] 交互有微妙但精致的动效
- [ ] 支持明暗主题切换
- [ ] 响应式适配移动端
- [ ] 没有无意义的装饰元素

