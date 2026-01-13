# Deep Research Pro V7 升级计划

## 📋 升级概览

**目标版本**: V7.0 - 专业研究增强版
**预计开发周期**: 2-3 周
**升级范围**: 前端交互 + 工作流搜索 + 深度分析 + 用户体验

---

## 一、前端交互功能升级

### 1.1 报告链接分享功能

**功能描述**: 生成可分享的报告链接，其他人可通过链接直接查看报告

**技术方案**:
```
方案A: 本地 Blob URL + 剪贴板
├── 优点: 无需服务器存储，实现简单
├── 缺点: 链接仅在当前浏览器有效，关闭即失效
└── 适用: MVP 快速实现

方案B: Base64 编码 URL
├── 优点: 链接自包含数据，可跨设备
├── 缺点: URL 很长，大报告可能超限
└── 适用: 小型报告分享

方案C: 后端存储 + 短链接
├── 优点: 链接短、持久、可统计访问
├── 缺点: 需要数据库和后端服务
└── 适用: 商业化版本
```

**推荐方案**: 先实现方案A（本地分享），后续迭代方案C

**开发任务**:
- [ ] 创建 `ShareDialog` 组件
- [ ] 实现 Blob URL 生成逻辑
- [ ] 添加复制链接到剪贴板功能
- [ ] 添加分享成功提示

**预计工时**: 4 小时

---

### 1.2 报告二维码生成

**功能描述**: 将报告链接转为二维码，便于手机扫码查看

**技术方案**:
```
依赖库: qrcode.react 或 qrcode
├── 输入: 报告分享链接
├── 输出: 二维码 Canvas/SVG
├── 功能: 支持下载二维码图片
└── 集成: 放在分享弹窗中
```

**开发任务**:
- [ ] 安装 `qrcode.react` 依赖
- [ ] 在 `ShareDialog` 中添加二维码展示
- [ ] 实现二维码下载功能
- [ ] 添加二维码尺寸调节

**预计工时**: 2 小时

---

### 1.3 本地存储历史研究记录

**功能描述**: 将研究历史保存到浏览器本地存储，支持查看和重新打开

**技术方案**:
```
存储方式: localStorage / IndexedDB
├── localStorage: 简单，容量 5-10MB
└── IndexedDB: 复杂，容量更大，支持大报告

数据结构:
{
  id: string,           // 唯一标识
  topic: string,        // 研究主题
  type: string,         // 报告类型
  wordCount: string,    // 字数
  createdAt: Date,      // 创建时间
  htmlContent: string,  // 报告HTML
  status: string,       // 状态
  charts: number        // 图表数量
}
```

**开发任务**:
- [ ] 创建 `useResearchHistory` Hook
- [ ] 实现 IndexedDB 存储服务
- [ ] 创建 `HistoryPanel` 组件
- [ ] 添加历史记录列表展示
- [ ] 实现删除、清空功能
- [ ] 实现点击重新打开报告

**预计工时**: 8 小时

---

### 1.4 报告大纲导航（目录树快速跳转）

**功能描述**: 提取报告标题生成目录树，点击可快速跳转到对应章节

**技术方案**:
```
实现步骤:
1. 解析 HTML 报告中的 h1/h2/h3 标签
2. 构建树形目录结构
3. 渲染可折叠目录组件
4. 点击目录项时滚动到对应元素

技术点:
├── DOM 解析: DOMParser API
├── 滚动: scrollIntoView({ behavior: 'smooth' })
├── 目录组件: 递归树形结构
└── 高亮: Intersection Observer 监听当前章节
```

**开发任务**:
- [ ] 创建 `extractOutline` 工具函数
- [ ] 创建 `OutlineTree` 组件
- [ ] 实现滚动跳转逻辑
- [ ] 添加当前章节高亮
- [ ] 添加目录折叠/展开功能
- [ ] 适配 iframe 内滚动

**预计工时**: 6 小时

---

### 1.5 图表全屏放大查看

**功能描述**: 点击报告中的图表可全屏放大查看，支持交互

**技术方案**:
```
方案A: 模态框全屏
├── 提取图表 div 和 ECharts 实例
├── 在 Modal 中重新渲染
└── 支持缩放、拖拽

方案B: 浏览器全屏 API
├── 使用 Fullscreen API
├── 直接放大原图表容器
└── 退出恢复原状

推荐: 方案A（更可控，体验更好）
```

**开发任务**:
- [ ] 创建 `ChartModal` 组件
- [ ] 实现图表点击事件监听
- [ ] 提取并重渲染 ECharts 配置
- [ ] 添加关闭/缩放控制
- [ ] 优化移动端适配

**预计工时**: 6 小时

---

## 二、工作流搜索能力升级

### 2.1 新增搜索源验证

**需验证的搜索源**:

| 搜索源 | URL 模式 | Jina 兼容性 | 状态 |
|--------|----------|-------------|------|
| 财经数据 | 东方财富/同花顺 | 待测试 | ⏳ |
| Google Patents | patents.google.com | 待测试 | ⏳ |
| Google Scholar | scholar.google.com | 待测试 | ⏳ |
| Semantic Scholar | semanticscholar.org | 待测试 | ⏳ |

**验证方法**:
```bash
# 测试 Jina Reader 是否能抓取
curl "https://r.jina.ai/https://patents.google.com/..."
curl "https://r.jina.ai/https://scholar.google.com/..."
```

**备选方案**:
- 如 Google Scholar 不可用，使用 Semantic Scholar API
- 如专利搜索不可用，使用 WIPO/USPTO 公开接口
- 如财经数据不可用，使用 Yahoo Finance

**开发任务**:
- [ ] 验证 Google Scholar Jina 可行性
- [ ] 验证 Semantic Scholar Jina 可行性
- [ ] 验证 Google Patents Jina 可行性
- [ ] 验证财经数据源可行性
- [ ] 编写备选方案

**预计工时**: 4 小时

---

### 2.2 关键词自动扩展与同义词替换

**功能描述**: LLM 自动分析用户主题，生成扩展关键词提升搜索覆盖

**技术方案**:
```yaml
# 新增 LLM 节点: 关键词扩展
inputs:
  research_topic: 用户输入的主题
  
prompt: |
  分析以下研究主题，生成搜索关键词：
  主题: {{research_topic}}
  
  请输出：
  1. 核心关键词（3-5个）
  2. 同义词替换（每个核心词2-3个同义词）
  3. 英文翻译关键词
  4. 行业术语关键词
  5. 相关概念关键词
  
  输出 JSON 格式:
  {
    "core": ["关键词1", "关键词2"],
    "synonyms": {"关键词1": ["同义词A", "同义词B"]},
    "english": ["keyword1", "keyword2"],
    "industry_terms": ["术语1"],
    "related": ["相关概念1"]
  }

outputs:
  keywords_json: 结构化关键词
```

**开发任务**:
- [ ] 设计关键词扩展 LLM Prompt
- [ ] 创建「关键词扩展」节点
- [ ] 修改 HTTP 搜索节点使用扩展关键词
- [ ] 测试关键词扩展效果

**预计工时**: 4 小时

---

### 2.3 搜索结果去重与质量评分

**功能描述**: 对多源搜索结果去重，并按质量评分排序

**技术方案**:
```yaml
# 在「信息整合」节点中增加去重和评分逻辑
prompt: |
  你收到了来自多个搜索源的内容，请进行以下处理：
  
  1. 去重处理：
     - 识别重复或高度相似的内容
     - 保留信息量更大的版本
     - 合并互补信息
  
  2. 质量评分（1-10分）：
     - 数据时效性（最近1年+3分）
     - 来源权威性（官方/学术+3分）
     - 内容深度（有具体数据+2分）
     - 相关性（与主题直接相关+2分）
  
  3. 输出格式：
     - 按质量评分降序排列
     - 标注每条信息的来源和评分
     - 过滤评分低于5分的内容
```

**开发任务**:
- [ ] 优化「信息整合」节点 Prompt
- [ ] 添加去重规则
- [ ] 添加质量评分维度
- [ ] 测试去重效果

**预计工时**: 3 小时

---

### 2.4 搜索来源可信度评估

**功能描述**: 根据来源域名自动评估可信度等级

**技术方案**:
```yaml
# 可信度分级
Level 1 (高可信):
  - 政府官网 (.gov, .gov.cn)
  - 学术期刊 (nature.com, science.org)
  - 权威机构 (who.int, worldbank.org)

Level 2 (较可信):
  - 知名媒体 (reuters.com, bloomberg.com)
  - 行业报告 (mckinsey.com, gartner.com)
  - 上市公司官网

Level 3 (一般可信):
  - 新闻门户 (sina.com, sohu.com)
  - 百科类 (wikipedia.org, baike.baidu.com)
  - 垂直社区

Level 4 (需验证):
  - 个人博客
  - 论坛帖子
  - 社交媒体

# 在报告中标注来源可信度
```

**开发任务**:
- [ ] 创建来源可信度评估规则
- [ ] 在 Prompt 中加入可信度判断
- [ ] 报告中显示来源可信度标签
- [ ] 添加「数据来源」汇总章节

**预计工时**: 3 小时

---

## 三、深度分析能力升级

### 3.1 PEST/PESTEL 分析框架

**功能描述**: 自动生成 PESTEL 分析章节

**Prompt 模板**:
```
基于收集的信息，进行 PESTEL 分析：

P - 政治因素 (Political)
- 政策法规
- 政府态度
- 贸易政策

E - 经济因素 (Economic)
- 经济周期
- 利率汇率
- 消费水平

S - 社会因素 (Social)
- 人口结构
- 消费习惯
- 文化趋势

T - 技术因素 (Technological)
- 技术创新
- 研发投入
- 技术壁垒

E - 环境因素 (Environmental)
- 环保法规
- 可持续发展
- 碳中和

L - 法律因素 (Legal)
- 行业法规
- 知识产权
- 合规要求

每个因素需包含：
1. 当前现状描述
2. 具体数据支撑
3. 对行业的影响评估
4. 未来趋势预测
```

**预计工时**: 2 小时

---

### 3.2 波特五力模型分析

**功能描述**: 自动生成波特五力分析章节和雷达图

**Prompt 模板**:
```
基于收集的信息，进行波特五力分析：

1. 现有竞争者的威胁 (Rivalry)
   - 竞争者数量
   - 行业增长率
   - 差异化程度
   评分: X/10

2. 新进入者的威胁 (New Entrants)
   - 进入壁垒
   - 资本要求
   - 品牌忠诚度
   评分: X/10

3. 替代品的威胁 (Substitutes)
   - 替代品可用性
   - 替代成本
   - 客户转换意愿
   评分: X/10

4. 供应商议价能力 (Supplier Power)
   - 供应商集中度
   - 原材料稀缺性
   - 切换成本
   评分: X/10

5. 购买者议价能力 (Buyer Power)
   - 买家集中度
   - 价格敏感度
   - 产品差异化
   评分: X/10

输出雷达图数据格式:
{
  "type": "radar",
  "data": [
    {"name": "现有竞争者威胁", "value": 7},
    {"name": "新进入者威胁", "value": 5},
    ...
  ]
}
```

**预计工时**: 2 小时

---

### 3.3 行业价值链分析

**功能描述**: 分析行业上中下游价值链

**Prompt 模板**:
```
基于收集的信息，进行价值链分析：

【上游】
- 原材料/核心技术供应商
- 主要参与者
- 利润率分析
- 关键痛点

【中游】
- 产品/服务提供商
- 主要参与者
- 核心竞争力
- 利润分配

【下游】
- 渠道/终端用户
- 主要参与者
- 市场规模
- 增长潜力

【价值链优化建议】
- 整合机会
- 降本增效点
- 差异化切入点

输出流程图数据，用于生成价值链图表
```

**预计工时**: 2 小时

---

### 3.4 竞争对手矩阵图

**功能描述**: 生成竞争对手对比矩阵图表

**Prompt 模板**:
```
识别并分析主要竞争对手：

1. 识别 5-8 个主要竞争对手
2. 对比维度:
   - 市场份额
   - 产品/服务范围
   - 技术实力
   - 品牌影响力
   - 价格定位
   - 渠道覆盖
   - 创新能力

3. 输出矩阵数据:
{
  "competitors": ["A公司", "B公司", "C公司"],
  "dimensions": ["市场份额", "技术实力", ...],
  "scores": [
    [8, 7, 6, ...],  // A公司各维度得分
    [6, 9, 5, ...],  // B公司
    ...
  ]
}

4. 生成竞争定位图 (价格-质量二维矩阵)
```

**预计工时**: 2 小时

---

## 四、用户体验优化

### 4.1 研究时长预估

**功能描述**: 根据研究参数预估完成时间

**技术方案**:
```typescript
// 预估公式
function estimateTime(params: ResearchInputs): { min: number; max: number } {
  const baseTime = {
    "快速概览": { min: 3, max: 8 },
    "中度分析": { min: 10, max: 20 },
    "深度研究": { min: 25, max: 45 },
  };
  
  const wordMultiplier = {
    "1500字": 0.8,
    "3000字": 1.0,
    "5000字": 1.3,
    "8000字": 1.6,
    "13000字": 2.0,
  };
  
  const base = baseTime[params.depth_level];
  const multiplier = wordMultiplier[params.word_count];
  
  return {
    min: Math.round(base.min * multiplier),
    max: Math.round(base.max * multiplier),
  };
}
```

**开发任务**:
- [ ] 实现预估算法
- [ ] 在表单中显示预估时间
- [ ] 根据历史数据调优参数

**预计工时**: 2 小时

---

### 4.2 精准进度预测

**功能描述**: 根据实时节点完成情况动态调整预估

**技术方案**:
```typescript
// 动态进度预测
interface ProgressPredictor {
  // 已完成节点的实际耗时
  completedNodes: Map<string, number>;
  
  // 预测剩余时间
  predictRemaining(): number {
    const avgTimePerWeight = this.calculateAvgTimePerWeight();
    const remainingWeight = this.getRemainingWeight();
    return avgTimePerWeight * remainingWeight;
  }
}
```

**开发任务**:
- [ ] 记录各节点实际耗时
- [ ] 实现动态预测算法
- [ ] 更新进度面板显示

**预计工时**: 3 小时

---

### 4.3 报告加载骨架屏

**功能描述**: 报告加载时显示骨架屏占位

**技术方案**:
```tsx
// 骨架屏组件
function ReportSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200 rounded mb-4" />  {/* 标题 */}
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
      <div className="h-64 bg-gray-200 rounded mb-4" />  {/* 图表占位 */}
      {/* ... */}
    </div>
  );
}
```

**开发任务**:
- [ ] 创建 `ReportSkeleton` 组件
- [ ] 添加加载状态判断
- [ ] 优化骨架屏动画

**预计工时**: 2 小时

---

### 4.4 图表懒加载

**功能描述**: 图表进入视口时才渲染，提升首屏性能

**技术方案**:
```tsx
// 使用 Intersection Observer
function LazyChart({ config }: { config: EChartsOption }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={ref}>
      {isVisible ? <ECharts option={config} /> : <ChartPlaceholder />}
    </div>
  );
}
```

**开发任务**:
- [ ] 创建 `LazyChart` 组件
- [ ] 集成到报告 HTML 模板
- [ ] 测试滚动加载效果

**预计工时**: 3 小时

---

### 4.5 大报告分页显示

**功能描述**: 超长报告分章节分页展示

**技术方案**:
```
方案A: 前端分页
├── 解析 HTML 按 h1/h2 切分章节
├── 显示分页控制器
├── 点击翻页切换章节
└── 保留完整滚动查看选项

方案B: 虚拟滚动
├── 使用 react-window 或 tanstack-virtual
├── 只渲染可视区域内容
├── 滚动时动态加载
└── 适合超长列表

推荐: 方案A（对报告结构更友好）
```

**开发任务**:
- [ ] 实现章节解析逻辑
- [ ] 创建 `PaginatedReport` 组件
- [ ] 添加翻页控制
- [ ] 保留「查看全文」选项

**预计工时**: 4 小时

---

### 4.6 服务端渲染 (SSR)

**功能描述**: 报告页面支持 SSR 提升 SEO 和首屏速度

**技术方案**:
```
当前状态: 纯客户端渲染 (CSR)
目标状态: 混合渲染

页面渲染策略:
├── 首页: SSG (静态生成)
├── 报告列表: SSR (服务端渲染)
├── 报告详情: ISR (增量静态再生成)
└── 研究进度: CSR (客户端渲染)

Next.js 配置:
├── 使用 generateStaticParams 预生成
├── 使用 revalidate 设置更新周期
└── 保持 "use client" 组件不变
```

**开发任务**:
- [ ] 分析页面渲染策略
- [ ] 创建报告详情页路由
- [ ] 实现 SSR 数据获取
- [ ] 配置 ISR 缓存策略

**预计工时**: 6 小时

---

## 五、开发准备工作

### 5.1 依赖安装

```bash
# 前端新依赖
npm install qrcode.react        # 二维码生成
npm install idb                 # IndexedDB 封装
npm install react-window        # 虚拟滚动（可选）
npm install @tanstack/react-virtual  # 虚拟滚动（可选）
```

### 5.2 文件结构规划

```
frontend/
├── components/
│   ├── share/
│   │   ├── ShareDialog.tsx       # 分享弹窗
│   │   └── QRCodeDisplay.tsx     # 二维码显示
│   ├── history/
│   │   ├── HistoryPanel.tsx      # 历史记录面板
│   │   └── HistoryItem.tsx       # 单条记录
│   ├── report/
│   │   ├── OutlineTree.tsx       # 目录导航
│   │   ├── ChartModal.tsx        # 图表全屏
│   │   ├── ReportSkeleton.tsx    # 骨架屏
│   │   ├── PaginatedReport.tsx   # 分页报告
│   │   └── LazyChart.tsx         # 懒加载图表
│   └── common/
│       └── TimeEstimate.tsx      # 时间预估
├── lib/
│   ├── services/
│   │   └── historyService.ts     # 历史存储服务
│   └── utils/
│       ├── outlineParser.ts      # 大纲解析
│       └── timeEstimator.ts      # 时间预估
└── app/
    └── report/
        └── [id]/
            └── page.tsx          # 报告详情页 (SSR)
```

### 5.3 工作流更新

```yaml
# deep_research_workflow_v7.yml 新增节点
新增节点:
  - 关键词扩展 (LLM)
  - Google Scholar 搜索 (HTTP)
  - Semantic Scholar 搜索 (HTTP)
  - Google Patents 搜索 (HTTP)
  - 财经数据搜索 (HTTP)
  - 质量评分与去重 (LLM)
  - PESTEL 分析 (LLM)
  - 波特五力分析 (LLM)
  - 价值链分析 (LLM)
  - 竞争矩阵分析 (LLM)
```

---

## 六、开发优先级与时间表

### 阶段一：核心功能 (第 1 周)

| 序号 | 功能 | 工时 | 优先级 |
|------|------|------|--------|
| 1 | 搜索源验证 | 4h | P0 |
| 2 | 本地历史存储 | 8h | P0 |
| 3 | 关键词扩展 | 4h | P0 |
| 4 | 去重与质量评分 | 3h | P0 |
| 5 | 研究时长预估 | 2h | P1 |

**小计**: 21 小时

### 阶段二：交互增强 (第 2 周)

| 序号 | 功能 | 工时 | 优先级 |
|------|------|------|--------|
| 6 | 报告链接分享 | 4h | P1 |
| 7 | 二维码生成 | 2h | P1 |
| 8 | 目录导航 | 6h | P1 |
| 9 | 图表全屏 | 6h | P1 |
| 10 | 骨架屏 | 2h | P2 |

**小计**: 20 小时

### 阶段三：深度分析 (第 3 周)

| 序号 | 功能 | 工时 | 优先级 |
|------|------|------|--------|
| 11 | PESTEL 分析 | 2h | P1 |
| 12 | 波特五力 | 2h | P1 |
| 13 | 价值链分析 | 2h | P1 |
| 14 | 竞争矩阵 | 2h | P1 |
| 15 | 来源可信度 | 3h | P2 |

**小计**: 11 小时

### 阶段四：性能优化 (第 3 周)

| 序号 | 功能 | 工时 | 优先级 |
|------|------|------|--------|
| 16 | 图表懒加载 | 3h | P2 |
| 17 | 大报告分页 | 4h | P2 |
| 18 | 精准进度预测 | 3h | P2 |
| 19 | SSR 优化 | 6h | P3 |

**小计**: 16 小时

---

## 七、风险与应对

| 风险 | 可能性 | 影响 | 应对措施 |
|------|--------|------|----------|
| Google Scholar 被封禁 | 高 | 中 | 使用 Semantic Scholar API |
| 大报告 localStorage 超限 | 中 | 中 | 使用 IndexedDB |
| iframe 跨域限制 | 中 | 高 | 使用 srcDoc 而非 src |
| ECharts 懒加载闪烁 | 低 | 低 | 添加占位符和过渡动画 |

---

## 八、验收标准

1. **功能完整**: 所有列出功能可正常使用
2. **兼容性**: Chrome/Firefox/Edge 最新版均可运行
3. **性能**: 13000 字报告加载时间 < 3 秒
4. **稳定性**: 连续运行 10 次研究无错误
5. **代码质量**: 无 TypeScript 类型错误，无 ESLint 警告

---

## 九、下一步行动

1. 确认升级计划内容
2. 验证新搜索源可行性
3. 开始阶段一开发
4. 每阶段完成后测试验收

---

*文档版本: V1.0*
*创建时间: 2026-01-09*
*作者: AI Assistant*

