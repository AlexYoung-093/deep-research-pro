/**
 * Deep Research Pro - 类型定义
 */

// =====================================================
// 研究输入参数
// =====================================================

export interface ResearchInputs {
  /** 研究主题 */
  research_topic: string;
  /** 报告类型 */
  report_type: "行业研报" | "竞品分析" | "技术调研" | "市场分析" | "趋势预测" | "政策解读";
  /** 深度级别 */
  depth_level: "深度研究" | "中度分析" | "快速概览";
  /** 字数要求 */
  word_count: "1500字" | "3000字" | "5000字" | "8000字";
}

// =====================================================
// 工作流进度
// =====================================================

export type WorkflowStatus = "idle" | "running" | "completed" | "error";

export interface WorkflowProgress {
  /** 当前状态 */
  status: WorkflowStatus;
  /** 当前节点 ID */
  currentNodeId: string | null;
  /** 当前节点标题 */
  currentNodeTitle: string | null;
  /** 已完成节点 ID 列表 */
  completedNodes: string[];
  /** 节点耗时映射 */
  nodeTimings: Record<string, number>;
  /** 开始时间戳 */
  startTime: number | null;
  /** 错误信息 */
  error: string | null;
}

// =====================================================
// 研究结果
// =====================================================

export interface ResearchResult {
  /** HTML 格式报告内容 */
  htmlContent: string;
  /** 纯文本报告内容 */
  reportContent?: string;
  /** 下载链接 */
  downloadUrl: string | null;
  /** 图表数据列表 */
  charts?: ChartData[] | any[];
  /** 结构化数据 */
  structuredData?: StructuredReportData | null;
}

// =====================================================
// 图表数据
// =====================================================

export type ChartType = "bar" | "line" | "pie" | "radar" | "table";

export interface ChartData {
  /** 图表 ID */
  id: string;
  /** 图表类型 */
  type: ChartType;
  /** 图表标题 */
  title: string;
  /** 图表描述 */
  description?: string;
  /** ECharts 配置选项 */
  option?: EChartsOption;
  /** 表格数据 */
  tableData?: TableData;
}

export interface TableData {
  /** 表头 */
  headers: string[];
  /** 行数据 */
  rows: string[][];
  /** 表格说明 */
  caption?: string;
}

// ECharts 配置类型（简化版）
export interface EChartsOption {
  title?: {
    text?: string;
    subtext?: string;
    left?: string | number;
    top?: string | number;
  };
  tooltip?: Record<string, unknown>;
  legend?: {
    data?: string[];
    bottom?: number | string;
  };
  xAxis?: {
    type?: string;
    data?: string[];
  };
  yAxis?: {
    type?: string;
    name?: string;
  };
  series?: Array<{
    name?: string;
    type?: string;
    data?: Array<number | { value: number; name?: string }>;
    [key: string]: unknown;
  }>;
  radar?: {
    indicator?: Array<{ name: string; max: number }>;
  };
  [key: string]: unknown;
}

// =====================================================
// 结构化报告数据（用于生成图表）
// =====================================================

export interface StructuredReportData {
  /** 报告标题 */
  title: string;
  /** 报告摘要 */
  summary?: string;
  /** 关键数据点 */
  keyDataPoints?: KeyDataPoint[];
  /** 对比数据 */
  comparisonData?: ComparisonData[];
  /** 趋势数据 */
  trendData?: TrendData[];
  /** 分布数据 */
  distributionData?: DistributionData[];
  /** 评估数据（雷达图） */
  evaluationData?: EvaluationData[];
}

export interface KeyDataPoint {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "stable";
}

export interface ComparisonData {
  title: string;
  categories: string[];
  series: Array<{
    name: string;
    data: number[];
  }>;
}

export interface TrendData {
  title: string;
  xAxisData: string[];
  series: Array<{
    name: string;
    data: number[];
  }>;
}

export interface DistributionData {
  title: string;
  data: Array<{
    name: string;
    value: number;
  }>;
}

export interface EvaluationData {
  title: string;
  indicators: Array<{
    name: string;
    max: number;
  }>;
  data: Array<{
    name: string;
    value: number[];
  }>;
}

// =====================================================
// 历史记录
// =====================================================

export interface HistoryItem {
  /** 唯一 ID */
  id: string;
  /** 研究主题 */
  topic: string;
  /** 创建时间 */
  createdAt: string;
  /** 状态 */
  status: "completed" | "error";
}

// =====================================================
// SSE 事件
// =====================================================

export type DifyEventType =
  | "workflow_started"
  | "node_started"
  | "node_finished"
  | "workflow_finished"
  | "error";

export interface DifySSEEvent {
  event: DifyEventType;
  task_id: string;
  workflow_run_id: string;
  data: {
    id?: string;
    title?: string;
    status?: string;
    elapsed_time?: number;
    outputs?: Record<string, unknown>;
    error?: string;
  };
}

// =====================================================
// 节点配置
// =====================================================

export interface NodeConfig {
  /** 节点 ID */
  id: string;
  /** 节点标题 */
  title: string;
  /** 预估耗时权重 */
  weight: number;
  /** 所属阶段 */
  phase: number;
}

// 工作流节点配置（更新后包含图表生成节点，已移除文件保存节点）
export const WORKFLOW_NODES: NodeConfig[] = [
  { id: "2001", title: "开始", weight: 0.1, phase: 0 },
  { id: "20021", title: "HTTP抓取-DuckDuckGo", weight: 1, phase: 1 },
  { id: "20022", title: "HTTP抓取-Brave", weight: 1, phase: 1 },
  { id: "20023", title: "HTTP抓取-深度搜索", weight: 1, phase: 1 },
  { id: "2002", title: "研究规划", weight: 3, phase: 1 },
  { id: "2003", title: "信息整合与深度分析", weight: 5, phase: 2 },
  { id: "2004", title: "报告撰写", weight: 8, phase: 3 },
  // Phase 2 新增节点
  { id: "20041", title: "数据结构化提取", weight: 3, phase: 3 },
  { id: "20042", title: "图表配置生成", weight: 2, phase: 3 },
  { id: "2005", title: "HTML转换", weight: 5, phase: 4 },
  { id: "2009", title: "结束", weight: 0.1, phase: 5 },
];

// 计算总权重
export const TOTAL_WEIGHT = WORKFLOW_NODES.reduce((sum, n) => sum + n.weight, 0);
