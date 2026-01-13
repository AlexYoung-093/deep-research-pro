---
name: zustand-state
description: Zustand 状态管理最佳实践
version: 1.0.0
author: Deep Research Pro Team
tags:
  - zustand
  - state
  - react
  - hooks
---

# Zustand State Management Skill

## 概述

Zustand 是一个轻量级的 React 状态管理库，本技能涵盖项目中的最佳实践。

## 安装

```bash
npm install zustand
```

## 基础 Store

### 研究状态 Store

```typescript
// lib/stores/researchStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 类型定义
interface ResearchInputs {
  research_topic: string;
  research_purpose: string;
  depth_level: 'deep' | 'medium' | 'overview';
  word_count: string;
}

interface WorkflowProgress {
  status: 'idle' | 'running' | 'completed' | 'error';
  currentNode: string | null;
  completedNodes: string[];
  startTime: number | null;
  error: string | null;
}

interface ResearchResult {
  htmlContent: string;
  markdownContent: string | null;
  generatedAt: string;
}

interface ResearchState {
  // 表单输入
  inputs: ResearchInputs;
  
  // 工作流进度
  progress: WorkflowProgress;
  
  // 研究结果
  result: ResearchResult | null;
  
  // 历史记录
  history: Array<{
    id: string;
    topic: string;
    createdAt: string;
  }>;
}

interface ResearchActions {
  // 表单操作
  setInputs: (inputs: Partial<ResearchInputs>) => void;
  resetInputs: () => void;
  
  // 进度操作
  setStatus: (status: WorkflowProgress['status']) => void;
  setCurrentNode: (nodeId: string | null) => void;
  addCompletedNode: (nodeId: string) => void;
  setError: (error: string | null) => void;
  resetProgress: () => void;
  
  // 结果操作
  setResult: (result: ResearchResult | null) => void;
  
  // 历史操作
  addToHistory: (item: { topic: string }) => void;
  clearHistory: () => void;
  
  // 重置全部
  reset: () => void;
}

// 初始状态
const initialInputs: ResearchInputs = {
  research_topic: '',
  research_purpose: '',
  depth_level: 'deep',
  word_count: '3000字',
};

const initialProgress: WorkflowProgress = {
  status: 'idle',
  currentNode: null,
  completedNodes: [],
  startTime: null,
  error: null,
};

// 创建 Store
export const useResearchStore = create<ResearchState & ResearchActions>()(
  persist(
    (set, get) => ({
      // 状态
      inputs: initialInputs,
      progress: initialProgress,
      result: null,
      history: [],

      // 表单操作
      setInputs: (newInputs) =>
        set((state) => ({
          inputs: { ...state.inputs, ...newInputs },
        })),
      
      resetInputs: () => set({ inputs: initialInputs }),

      // 进度操作
      setStatus: (status) =>
        set((state) => ({
          progress: {
            ...state.progress,
            status,
            startTime: status === 'running' ? Date.now() : state.progress.startTime,
          },
        })),
      
      setCurrentNode: (nodeId) =>
        set((state) => ({
          progress: { ...state.progress, currentNode: nodeId },
        })),
      
      addCompletedNode: (nodeId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            completedNodes: [...state.progress.completedNodes, nodeId],
            currentNode: null,
          },
        })),
      
      setError: (error) =>
        set((state) => ({
          progress: { ...state.progress, error, status: error ? 'error' : state.progress.status },
        })),
      
      resetProgress: () => set({ progress: initialProgress }),

      // 结果操作
      setResult: (result) => set({ result }),

      // 历史操作
      addToHistory: (item) =>
        set((state) => ({
          history: [
            {
              id: Date.now().toString(),
              topic: item.topic,
              createdAt: new Date().toISOString(),
            },
            ...state.history.slice(0, 19), // 最多保留 20 条
          ],
        })),
      
      clearHistory: () => set({ history: [] }),

      // 重置全部
      reset: () =>
        set({
          inputs: initialInputs,
          progress: initialProgress,
          result: null,
        }),
    }),
    {
      name: 'deep-research-storage',
      // 只持久化部分状态
      partialize: (state) => ({
        inputs: state.inputs,
        history: state.history,
      }),
    }
  )
);
```

## 选择器模式

### 使用选择器避免不必要的重渲染

```typescript
// 选择器 - 只订阅需要的状态
const topic = useResearchStore((state) => state.inputs.research_topic);
const status = useResearchStore((state) => state.progress.status);
const isRunning = useResearchStore((state) => state.progress.status === 'running');

// 复合选择器
const progressInfo = useResearchStore((state) => ({
  status: state.progress.status,
  currentNode: state.progress.currentNode,
  completedCount: state.progress.completedNodes.length,
}));

// 使用 shallow 比较优化对象选择
import { shallow } from 'zustand/shallow';

const { inputs, setInputs } = useResearchStore(
  (state) => ({
    inputs: state.inputs,
    setInputs: state.setInputs,
  }),
  shallow
);
```

## 派生状态

```typescript
// lib/stores/selectors.ts
import { useResearchStore } from './researchStore';

// 派生选择器
export const useProgressPercentage = () => {
  const completedNodes = useResearchStore((state) => state.progress.completedNodes);
  const totalNodes = 10; // 工作流总节点数
  return Math.round((completedNodes.length / totalNodes) * 100);
};

export const useElapsedTime = () => {
  const startTime = useResearchStore((state) => state.progress.startTime);
  const status = useResearchStore((state) => state.progress.status);
  
  if (!startTime || status === 'idle') return 0;
  return Date.now() - startTime;
};

export const useIsFormValid = () => {
  const inputs = useResearchStore((state) => state.inputs);
  return inputs.research_topic.trim().length > 0 && 
         inputs.research_purpose.trim().length > 0;
};
```

## 组件使用示例

### 表单组件

```tsx
// components/research/ResearchForm.tsx
'use client'

import { useResearchStore } from '@/lib/stores/researchStore';
import { useIsFormValid } from '@/lib/stores/selectors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ResearchForm() {
  const inputs = useResearchStore((state) => state.inputs);
  const setInputs = useResearchStore((state) => state.setInputs);
  const isRunning = useResearchStore((state) => state.progress.status === 'running');
  const isValid = useIsFormValid();

  return (
    <form className="space-y-4">
      <Input
        value={inputs.research_topic}
        onChange={(e) => setInputs({ research_topic: e.target.value })}
        placeholder="研究主题"
        disabled={isRunning}
      />
      <Input
        value={inputs.research_purpose}
        onChange={(e) => setInputs({ research_purpose: e.target.value })}
        placeholder="研究目的"
        disabled={isRunning}
      />
      <Button 
        type="submit" 
        disabled={!isValid || isRunning}
      >
        {isRunning ? '研究中...' : '开始研究'}
      </Button>
    </form>
  );
}
```

### 进度组件

```tsx
// components/research/ProgressPanel.tsx
'use client'

import { useResearchStore } from '@/lib/stores/researchStore';
import { useProgressPercentage, useElapsedTime } from '@/lib/stores/selectors';
import { Progress } from '@/components/ui/progress';

export function ProgressPanel() {
  const status = useResearchStore((state) => state.progress.status);
  const currentNode = useResearchStore((state) => state.progress.currentNode);
  const percentage = useProgressPercentage();
  const elapsed = useElapsedTime();

  if (status === 'idle') return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span>进度: {percentage}%</span>
        <span>已用时: {Math.round(elapsed / 1000)}秒</span>
      </div>
      <Progress value={percentage} />
      {currentNode && (
        <p className="text-sm text-muted-foreground">
          正在执行: {currentNode}
        </p>
      )}
    </div>
  );
}
```

## 异步操作

### 在 Store 外处理异步

```typescript
// lib/api/research.ts
import { useResearchStore } from '@/lib/stores/researchStore';

export async function startResearch() {
  const store = useResearchStore.getState();
  const { inputs, setStatus, setCurrentNode, addCompletedNode, setResult, setError } = store;

  setStatus('running');

  try {
    const response = await fetch('/api/research/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs }),
    });

    // 处理 SSE 响应...
    const reader = response.body?.getReader();
    // ... (SSE 处理逻辑)

  } catch (error) {
    setError((error as Error).message);
  }
}
```

## DevTools

```typescript
// 开发环境启用 DevTools
import { devtools } from 'zustand/middleware';

export const useResearchStore = create<ResearchState & ResearchActions>()(
  devtools(
    persist(
      (set, get) => ({
        // ...
      }),
      { name: 'deep-research-storage' }
    ),
    { name: 'ResearchStore' }
  )
);
```

## 检查清单

- [ ] 使用选择器避免不必要的重渲染
- [ ] 复杂选择使用 shallow 比较
- [ ] 持久化只保存必要的状态
- [ ] 异步操作在 store 外处理
- [ ] 开发环境启用 DevTools
- [ ] 类型定义完整
- [ ] 状态结构扁平化

