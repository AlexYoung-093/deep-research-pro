/**
 * 图表数据解析工具
 *
 * 用于解析 Dify 工作流返回的 JSON 格式图表配置
 */

import type {
  ChartData,
  EChartsOption,
  StructuredReportData,
  ComparisonData,
  TrendData,
  DistributionData,
  EvaluationData,
} from "@/types/research";

// =====================================================
// 苹果风格颜色配置
// =====================================================

const APPLE_COLORS = {
  primary: ["#1d1d1f", "#636366", "#86868b", "#aeaeb2", "#c7c7cc", "#d1d1d6"],
  accent: {
    blue: "#007aff",
    green: "#34c759",
    orange: "#ff9f0a",
    red: "#ff3b30",
    purple: "#af52de",
    teal: "#5ac8fa",
  },
};

// =====================================================
// 解析图表 JSON 字符串
// =====================================================

/**
 * 解析从 LLM 返回的图表 JSON 字符串
 */
export function parseChartJson(jsonString: string): ChartData[] {
  try {
    // 尝试直接解析
    const parsed = JSON.parse(jsonString);

    // 如果是数组，直接处理
    if (Array.isArray(parsed)) {
      return parsed.map(normalizeChartData).filter(Boolean) as ChartData[];
    }

    // 如果是对象，检查是否有 charts 字段
    if (parsed.charts && Array.isArray(parsed.charts)) {
      return parsed.charts.map(normalizeChartData).filter(Boolean) as ChartData[];
    }

    // 如果是单个图表对象
    const normalized = normalizeChartData(parsed);
    return normalized ? [normalized] : [];
  } catch (error) {
    console.warn("Failed to parse chart JSON:", error);

    // 尝试从文本中提取 JSON
    const extracted = extractJsonFromText(jsonString);
    if (extracted) {
      return parseChartJson(extracted);
    }

    return [];
  }
}

/**
 * 从文本中提取 JSON 字符串
 */
function extractJsonFromText(text: string): string | null {
  // 尝试匹配 JSON 数组或对象
  const jsonMatch = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : null;
}

/**
 * 规范化图表数据
 */
function normalizeChartData(data: unknown): ChartData | null {
  if (!data || typeof data !== "object") return null;

  const chart = data as Record<string, unknown>;

  // 验证必要字段
  if (!chart.type || !chart.title) return null;

  const type = chart.type as ChartData["type"];
  const validTypes = ["bar", "line", "pie", "radar", "table"];
  if (!validTypes.includes(type)) return null;

  return {
    id: (chart.id as string) || `chart_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    type,
    title: chart.title as string,
    description: chart.description as string | undefined,
    option: chart.option as EChartsOption | undefined,
    tableData: chart.tableData as ChartData["tableData"] | undefined,
  };
}

// =====================================================
// 从结构化数据生成图表配置
// =====================================================

/**
 * 从结构化报告数据生成图表配置
 */
export function generateChartsFromStructuredData(
  structuredData: StructuredReportData
): ChartData[] {
  const charts: ChartData[] = [];
  let chartIndex = 0;

  // 生成对比图表（柱状图）
  if (structuredData.comparisonData) {
    for (const comparison of structuredData.comparisonData) {
      charts.push(generateBarChart(comparison, chartIndex++));
    }
  }

  // 生成趋势图表（折线图）
  if (structuredData.trendData) {
    for (const trend of structuredData.trendData) {
      charts.push(generateLineChart(trend, chartIndex++));
    }
  }

  // 生成分布图表（饼图）
  if (structuredData.distributionData) {
    for (const distribution of structuredData.distributionData) {
      charts.push(generatePieChart(distribution, chartIndex++));
    }
  }

  // 生成评估图表（雷达图）
  if (structuredData.evaluationData) {
    for (const evaluation of structuredData.evaluationData) {
      charts.push(generateRadarChart(evaluation, chartIndex++));
    }
  }

  return charts;
}

/**
 * 生成柱状图配置
 */
function generateBarChart(data: ComparisonData, index: number): ChartData {
  const option: EChartsOption = {
    title: {
      text: data.title,
      left: "center",
      top: 20,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: data.series.map((s) => s.name),
      bottom: 20,
    },
    xAxis: {
      type: "category",
      data: data.categories,
    },
    yAxis: {
      type: "value",
    },
    series: data.series.map((s, i) => ({
      name: s.name,
      type: "bar",
      data: s.data,
      itemStyle: {
        color: APPLE_COLORS.primary[i % APPLE_COLORS.primary.length],
      },
    })),
  };

  return {
    id: `bar_${index}`,
    type: "bar",
    title: data.title,
    option,
  };
}

/**
 * 生成折线图配置
 */
function generateLineChart(data: TrendData, index: number): ChartData {
  const option: EChartsOption = {
    title: {
      text: data.title,
      left: "center",
      top: 20,
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: data.series.map((s) => s.name),
      bottom: 20,
    },
    xAxis: {
      type: "category",
      data: data.xAxisData,
      boundaryGap: false,
    },
    yAxis: {
      type: "value",
    },
    series: data.series.map((s, i) => ({
      name: s.name,
      type: "line",
      data: s.data,
      smooth: true,
      lineStyle: {
        width: 3,
        color: APPLE_COLORS.primary[i % APPLE_COLORS.primary.length],
      },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: `${APPLE_COLORS.primary[i]}20` },
            { offset: 1, color: `${APPLE_COLORS.primary[i]}05` },
          ],
        },
      },
    })),
  };

  return {
    id: `line_${index}`,
    type: "line",
    title: data.title,
    option,
  };
}

/**
 * 生成饼图配置
 */
function generatePieChart(data: DistributionData, index: number): ChartData {
  const option: EChartsOption = {
    title: {
      text: data.title,
      left: "center",
      top: 20,
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      bottom: 20,
    },
    series: [
      {
        name: data.title,
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "55%"],
        data: data.data.map((item, i) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: APPLE_COLORS.primary[i % APPLE_COLORS.primary.length],
          },
        })),
      },
    ],
  };

  return {
    id: `pie_${index}`,
    type: "pie",
    title: data.title,
    option,
  };
}

/**
 * 生成雷达图配置
 */
function generateRadarChart(data: EvaluationData, index: number): ChartData {
  const option: EChartsOption = {
    title: {
      text: data.title,
      left: "center",
      top: 20,
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      data: data.data.map((d) => d.name),
      bottom: 20,
    },
    radar: {
      indicator: data.indicators,
    },
    series: [
      {
        type: "radar",
        data: data.data.map((d, i) => ({
          name: d.name,
          value: d.value,
          lineStyle: {
            color: APPLE_COLORS.primary[i % APPLE_COLORS.primary.length],
            width: 2,
          },
          areaStyle: {
            color: `${APPLE_COLORS.primary[i]}30`,
          },
        })),
      },
    ],
  };

  return {
    id: `radar_${index}`,
    type: "radar",
    title: data.title,
    option,
  };
}

// =====================================================
// 导出
// =====================================================

export {
  APPLE_COLORS,
  generateBarChart,
  generateLineChart,
  generatePieChart,
  generateRadarChart,
};

