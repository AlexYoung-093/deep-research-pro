---
name: nextjs-app-router
description: Next.js 14 App Router 最佳实践和模式
version: 1.0.0
author: Deep Research Pro Team
tags:
  - nextjs
  - react
  - app-router
  - server-components
---

# Next.js App Router Skill

## 概述

Next.js 14 App Router 开发最佳实践，包括服务端组件、客户端组件、API Routes 和数据获取模式。

## 项目结构

```
app/
├── layout.tsx              # 根布局
├── page.tsx               # 首页
├── loading.tsx            # 加载状态
├── error.tsx              # 错误边界
├── not-found.tsx          # 404 页面
├── globals.css            # 全局样式
├── api/                   # API Routes
│   ├── research/
│   │   └── route.ts       # POST /api/research
│   └── download/
│       └── route.ts       # GET /api/download
├── research/
│   └── [id]/
│       └── page.tsx       # 动态路由
└── _components/           # 页面级私有组件
```

## 布局模式

### 根布局 (Root Layout)

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Deep Research Pro',
  description: '深度研究报告生成器',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 加载状态

```tsx
// app/loading.tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="container py-10 space-y-8">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
```

### 错误边界

```tsx
// app/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h2 className="text-2xl font-semibold">出错了</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>重试</Button>
    </div>
  )
}
```

## API Routes 模式

### 基础 API Route

```tsx
// app/api/research/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { inputs } = body

    // 验证输入
    if (!inputs?.research_topic) {
      return NextResponse.json(
        { error: '缺少研究主题' },
        { status: 400 }
      )
    }

    // 调用外部 API
    const response = await fetch(process.env.DIFY_API_URL!, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs }),
    })

    if (!response.ok) {
      throw new Error(`API 错误: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('API 错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
```

### SSE 流式 API Route

```tsx
// app/api/research/stream/route.ts
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { inputs } = body

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch(process.env.DIFY_API_URL!, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs,
            response_mode: 'streaming',
            user: 'web-user',
          }),
        })

        const reader = response.body?.getReader()
        if (!reader) throw new Error('No reader')

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          controller.enqueue(value)
        }

        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
```

## 客户端组件模式

### 使用 'use client' 指令

```tsx
// components/research/ResearchForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ResearchForm() {
  const [topic, setTopic] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // ...
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        value={topic} 
        onChange={(e) => setTopic(e.target.value)} 
        placeholder="研究主题"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? '研究中...' : '开始研究'}
      </Button>
    </form>
  )
}
```

### 使用 React Hooks

```tsx
// lib/hooks/useSSE.ts
'use client'

import { useState, useCallback } from 'react'

interface SSEState {
  status: 'idle' | 'connecting' | 'connected' | 'error'
  data: any[]
  error: Error | null
}

export function useSSE(url: string) {
  const [state, setState] = useState<SSEState>({
    status: 'idle',
    data: [],
    error: null,
  })

  const connect = useCallback(async (body: any) => {
    setState(s => ({ ...s, status: 'connecting' }))

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      setState(s => ({ ...s, status: 'connected' }))

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        const lines = text.split('\n').filter(Boolean)

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))
            setState(s => ({ ...s, data: [...s.data, data] }))
          }
        }
      }
    } catch (error) {
      setState(s => ({ 
        ...s, 
        status: 'error', 
        error: error as Error 
      }))
    }
  }, [url])

  return { ...state, connect }
}
```

## 环境变量

```env
# .env.local
DIFY_API_URL=http://dify-dev.xtalpi.xyz/v1/workflows/run
DIFY_API_KEY=app-xxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```tsx
// 服务端使用
const apiKey = process.env.DIFY_API_KEY

// 客户端使用 (需要 NEXT_PUBLIC_ 前缀)
const appUrl = process.env.NEXT_PUBLIC_APP_URL
```

## TypeScript 类型

```tsx
// types/research.ts
export interface ResearchInputs {
  research_topic: string
  research_purpose: string
  depth_level: 'deep' | 'medium' | 'overview'
  word_count: string
}

export interface ResearchResult {
  htmlContent: string
  markdownContent?: string
  downloadUrl?: string
  generatedAt: string
}

export interface SSEEvent {
  event: 'workflow_started' | 'node_started' | 'node_finished' | 'workflow_finished' | 'error'
  data: Record<string, any>
}
```

## 检查清单

- [ ] 根布局包含必要的 providers
- [ ] API Routes 有适当的错误处理
- [ ] 客户端组件使用 'use client' 指令
- [ ] 环境变量正确配置
- [ ] TypeScript 类型定义完整
- [ ] 加载和错误状态处理
- [ ] SSE 连接有正确的清理逻辑


