---
name: sse-streaming
description: Server-Sent Events (SSE) 流式响应处理最佳实践
version: 1.0.0
author: Deep Research Pro Team
tags:
  - sse
  - streaming
  - real-time
  - api
---

# SSE Streaming Skill

## 概述

本技能涵盖 Server-Sent Events (SSE) 的实现模式，用于处理 Dify Workflow API 的流式响应。

## Dify SSE 事件格式

### 事件类型

```typescript
type DifyEventType = 
  | 'workflow_started'   // 工作流开始
  | 'node_started'       // 节点开始执行
  | 'node_finished'      // 节点执行完成
  | 'workflow_finished'  // 工作流完成
  | 'error';             // 错误

interface DifySSEEvent {
  event: DifyEventType;
  task_id: string;
  workflow_run_id: string;
  data: {
    id?: string;           // 节点 ID
    title?: string;        // 节点标题
    status?: string;       // 状态
    elapsed_time?: number; // 耗时（秒）
    outputs?: Record<string, any>; // 输出数据
    error?: string;        // 错误信息
  };
}
```

### 原始 SSE 数据格式

```
data: {"event":"workflow_started","task_id":"xxx","workflow_run_id":"xxx","data":{}}

data: {"event":"node_started","task_id":"xxx","workflow_run_id":"xxx","data":{"id":"2001","title":"开始"}}

data: {"event":"node_finished","task_id":"xxx","workflow_run_id":"xxx","data":{"id":"2001","title":"开始","status":"succeeded","elapsed_time":0.01}}

data: {"event":"workflow_finished","task_id":"xxx","workflow_run_id":"xxx","data":{"status":"succeeded","outputs":{"result":"..."}}}
```

## 前端实现

### 基础 SSE 连接

```typescript
// lib/api/sse.ts

export interface SSEOptions {
  onMessage: (event: DifySSEEvent) => void;
  onError: (error: Error) => void;
  onComplete: () => void;
}

export async function connectSSE(
  url: string, 
  body: object, 
  options: SSEOptions
) {
  const { onMessage, onError, onComplete } = options;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onComplete();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      
      // 处理可能的多行数据
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // 保留不完整的行

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const jsonStr = line.slice(6);
            const event = JSON.parse(jsonStr) as DifySSEEvent;
            onMessage(event);
          } catch (parseError) {
            console.warn('Failed to parse SSE data:', line);
          }
        }
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error(String(error)));
  }
}
```

### React Hook 封装

```typescript
// lib/hooks/useWorkflowSSE.ts
'use client'

import { useState, useCallback, useRef } from 'react';

interface WorkflowProgress {
  status: 'idle' | 'running' | 'completed' | 'error';
  currentNodeId: string | null;
  currentNodeTitle: string | null;
  completedNodes: Set<string>;
  nodeTimings: Map<string, number>;
  startTime: number | null;
  error: string | null;
}

interface WorkflowResult {
  outputs: Record<string, any>;
  totalTime: number;
}

export function useWorkflowSSE() {
  const [progress, setProgress] = useState<WorkflowProgress>({
    status: 'idle',
    currentNodeId: null,
    currentNodeTitle: null,
    completedNodes: new Set(),
    nodeTimings: new Map(),
    startTime: null,
    error: null,
  });

  const [result, setResult] = useState<WorkflowResult | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startWorkflow = useCallback(async (inputs: Record<string, any>) => {
    // 重置状态
    setProgress({
      status: 'running',
      currentNodeId: null,
      currentNodeTitle: null,
      completedNodes: new Set(),
      nodeTimings: new Map(),
      startTime: Date.now(),
      error: null,
    });
    setResult(null);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/research/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;

          try {
            const event = JSON.parse(line.slice(6));
            handleEvent(event);
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        setProgress(p => ({ ...p, status: 'idle' }));
      } else {
        setProgress(p => ({
          ...p,
          status: 'error',
          error: (error as Error).message,
        }));
      }
    }
  }, []);

  const handleEvent = useCallback((event: DifySSEEvent) => {
    switch (event.event) {
      case 'workflow_started':
        setProgress(p => ({
          ...p,
          status: 'running',
          startTime: Date.now(),
        }));
        break;

      case 'node_started':
        setProgress(p => ({
          ...p,
          currentNodeId: event.data.id || null,
          currentNodeTitle: event.data.title || null,
        }));
        break;

      case 'node_finished':
        setProgress(p => {
          const newCompleted = new Set(p.completedNodes);
          const newTimings = new Map(p.nodeTimings);
          
          if (event.data.id) {
            newCompleted.add(event.data.id);
            if (event.data.elapsed_time) {
              newTimings.set(event.data.id, event.data.elapsed_time);
            }
          }
          
          return {
            ...p,
            completedNodes: newCompleted,
            nodeTimings: newTimings,
            currentNodeId: null,
            currentNodeTitle: null,
          };
        });
        break;

      case 'workflow_finished':
        setProgress(p => ({
          ...p,
          status: 'completed',
          currentNodeId: null,
          currentNodeTitle: null,
        }));
        setResult({
          outputs: event.data.outputs || {},
          totalTime: Date.now() - (progress.startTime || Date.now()),
        });
        break;

      case 'error':
        setProgress(p => ({
          ...p,
          status: 'error',
          error: event.data.error || '未知错误',
        }));
        break;
    }
  }, [progress.startTime]);

  const cancelWorkflow = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return {
    progress,
    result,
    startWorkflow,
    cancelWorkflow,
    isRunning: progress.status === 'running',
    isCompleted: progress.status === 'completed',
    isError: progress.status === 'error',
  };
}
```

## 后端代理实现

### Next.js API Route

```typescript
// app/api/research/stream/route.ts
import { NextRequest } from 'next/server';

const DIFY_API_URL = process.env.DIFY_API_URL!;
const DIFY_API_KEY = process.env.DIFY_API_KEY!;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { inputs } = body;

  // 创建可读流
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        const response = await fetch(DIFY_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${DIFY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs,
            response_mode: 'streaming',
            user: 'web-user-' + Date.now(),
          }),
        });

        if (!response.ok) {
          const errorData = { 
            event: 'error', 
            data: { error: `API Error: ${response.status}` } 
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`));
          controller.close();
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        // 透传 Dify 的 SSE 数据
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }

        controller.close();
      } catch (error) {
        const errorData = { 
          event: 'error', 
          data: { error: (error as Error).message } 
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // 禁用 Nginx 缓冲
    },
  });
}
```

## 进度计算

### 节点进度映射

```typescript
// lib/utils/progress.ts

interface NodeConfig {
  id: string;
  title: string;
  weight: number; // 预估耗时权重
  phase: number;  // 所属阶段
}

const WORKFLOW_NODES: NodeConfig[] = [
  { id: '20021', title: 'HTTP抓取-Bing', weight: 1, phase: 1 },
  { id: '20022', title: 'HTTP抓取-Google', weight: 1, phase: 1 },
  { id: '20023', title: 'HTTP抓取-DuckDuckGo', weight: 1, phase: 1 },
  { id: '2002', title: '研究规划', weight: 3, phase: 1 },
  { id: '2003', title: '信息整合与深度分析', weight: 5, phase: 2 },
  { id: '2004', title: '报告撰写', weight: 8, phase: 3 },
  { id: '2005', title: 'HTML转换', weight: 5, phase: 4 },
  { id: '2006', title: '保存为HTML', weight: 0.5, phase: 5 },
  { id: '2007', title: '获取HTML链接', weight: 0.3, phase: 5 },
  { id: '2008', title: '拼接完整URL', weight: 0.2, phase: 5 },
];

const TOTAL_WEIGHT = WORKFLOW_NODES.reduce((sum, n) => sum + n.weight, 0);

export function calculateProgress(completedNodes: Set<string>): number {
  const completedWeight = WORKFLOW_NODES
    .filter(n => completedNodes.has(n.id))
    .reduce((sum, n) => sum + n.weight, 0);
  
  return Math.round((completedWeight / TOTAL_WEIGHT) * 100);
}

export function getNodeConfig(nodeId: string): NodeConfig | undefined {
  return WORKFLOW_NODES.find(n => n.id === nodeId);
}

export function getPhaseNodes(phase: number): NodeConfig[] {
  return WORKFLOW_NODES.filter(n => n.phase === phase);
}
```

## 错误处理

```typescript
// 重连逻辑
async function connectWithRetry(
  url: string, 
  body: object, 
  options: SSEOptions,
  maxRetries = 3
) {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await connectSSE(url, body, options);
      return; // 成功则返回
    } catch (error) {
      lastError = error as Error;
      console.warn(`SSE 连接失败 (尝试 ${attempt + 1}/${maxRetries}):`, error);
      
      // 等待后重试
      if (attempt < maxRetries - 1) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError;
}
```

## 检查清单

- [ ] SSE 数据解析正确处理不完整的行
- [ ] 事件处理覆盖所有事件类型
- [ ] 错误状态有友好提示
- [ ] 支持取消/中断正在进行的请求
- [ ] 进度计算准确反映实际进展
- [ ] API Route 正确设置 SSE 响应头
- [ ] 禁用了代理/CDN 的缓冲 (X-Accel-Buffering: no)

