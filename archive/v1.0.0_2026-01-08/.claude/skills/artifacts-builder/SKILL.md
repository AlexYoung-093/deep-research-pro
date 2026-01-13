---
name: artifacts-builder
description: 使用 React、Tailwind CSS 和 Shadcn/ui 组件构建复杂的 HTML 制品
version: 1.0.0
author: Deep Research Pro Team
tags:
  - react
  - tailwind
  - shadcn
  - artifacts
  - components
---

# Artifacts Builder Skill

## 概述

这个技能帮助你使用 React + Tailwind CSS + Shadcn/ui 构建高质量的前端制品。

## Shadcn/ui 组件使用指南

### 可用组件清单

```typescript
// 布局组件
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 表单组件
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

// 反馈组件
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"

// 导航组件
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// 数据展示
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// 弹出层
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
```

### 组件组合示例

#### 表单卡片

```tsx
<Card className="w-full max-w-lg">
  <CardHeader>
    <CardTitle>研究参数配置</CardTitle>
    <CardDescription>设置您的深度研究参数</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="topic">研究主题</Label>
      <Input id="topic" placeholder="请输入研究主题" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="depth">深度要求</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="选择深度" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="deep">深度分析</SelectItem>
          <SelectItem value="medium">中度分析</SelectItem>
          <SelectItem value="overview">快速概览</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </CardContent>
  <CardFooter>
    <Button className="w-full">开始研究</Button>
  </CardFooter>
</Card>
```

#### 进度指示器

```tsx
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium">执行进度</span>
    <span className="text-sm text-muted-foreground">3/5 完成</span>
  </div>
  <Progress value={60} className="h-2" />
  <div className="space-y-2">
    {steps.map((step, index) => (
      <div key={index} className="flex items-center gap-3">
        {step.status === 'completed' && (
          <CheckCircle className="h-5 w-5 text-green-500" />
        )}
        {step.status === 'running' && (
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        )}
        {step.status === 'pending' && (
          <Circle className="h-5 w-5 text-gray-300" />
        )}
        <span className={cn(
          "text-sm",
          step.status === 'completed' && "text-green-600",
          step.status === 'running' && "text-blue-600 font-medium",
          step.status === 'pending' && "text-gray-400"
        )}>
          {step.label}
        </span>
      </div>
    ))}
  </div>
</div>
```

#### 标签页内容

```tsx
<Tabs defaultValue="preview" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="preview">预览</TabsTrigger>
    <TabsTrigger value="source">源代码</TabsTrigger>
    <TabsTrigger value="markdown">Markdown</TabsTrigger>
  </TabsList>
  <TabsContent value="preview" className="mt-4">
    <Card>
      <CardContent className="p-6">
        <iframe srcDoc={htmlContent} className="w-full h-[600px] border-0" />
      </CardContent>
    </Card>
  </TabsContent>
  <TabsContent value="source">
    <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
      <code>{htmlContent}</code>
    </pre>
  </TabsContent>
  <TabsContent value="markdown">
    <ScrollArea className="h-[600px]">
      <div className="prose max-w-none p-4">
        {markdownContent}
      </div>
    </ScrollArea>
  </TabsContent>
</Tabs>
```

## Tailwind CSS 最佳实践

### 间距规范

```tsx
// 页面级间距
<main className="px-4 py-8 md:px-8 md:py-16 lg:px-16 lg:py-24">

// 组件间距
<div className="space-y-6">  // 紧凑
<div className="space-y-8">  // 标准
<div className="space-y-12"> // 宽松
<div className="space-y-16"> // 大留白
```

### 响应式断点

```tsx
// 移动优先设计
<div className="
  grid grid-cols-1 gap-4           // 手机
  sm:grid-cols-2 sm:gap-6          // 平板竖屏
  md:grid-cols-2 md:gap-8          // 平板横屏
  lg:grid-cols-3 lg:gap-8          // 笔记本
  xl:grid-cols-4 xl:gap-10         // 桌面
">
```

### 动画类

```tsx
// 过渡动画
className="transition-all duration-200 ease-out"
className="transition-colors duration-150"
className="transition-transform duration-300"

// 悬停效果
className="hover:scale-105 hover:shadow-lg"
className="hover:bg-gray-50 dark:hover:bg-gray-800"

// 加载动画
className="animate-spin"
className="animate-pulse"
className="animate-bounce"
```

## Lucide Icons 使用

```tsx
import { 
  Search, 
  ArrowRight, 
  Check, 
  X, 
  Loader2,
  Download,
  Share2,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  Menu,
  ExternalLink
} from 'lucide-react'

// 使用示例
<Button>
  <Download className="mr-2 h-4 w-4" />
  下载报告
</Button>

<Loader2 className="h-8 w-8 animate-spin text-primary" />
```

## 构建检查清单

- [ ] 使用语义化的 HTML 结构
- [ ] 所有交互元素有合适的 hover/focus 状态
- [ ] 颜色对比度满足 WCAG AA 标准
- [ ] 所有图标有适当的 aria-label
- [ ] 响应式布局在各尺寸正常工作
- [ ] 暗色模式样式正确
- [ ] 加载状态有骨架屏或 loading 动画
- [ ] 错误状态有友好的提示信息

