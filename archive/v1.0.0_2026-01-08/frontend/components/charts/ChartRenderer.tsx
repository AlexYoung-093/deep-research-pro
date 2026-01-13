"use client";

/**
 * ECharts 图表渲染组件
 *
 * 用于渲染从 Dify 工作流返回的图表数据
 * 支持: 柱状图、折线图、饼图、雷达图、表格
 */

import React, { useRef, useEffect, useState } from "react";
import * as echarts from "echarts";
import { motion } from "framer-motion";
import { Maximize2, Download, RefreshCw } from "lucide-react";
import type { ChartData, TableData } from "@/types/research";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// =====================================================
// 苹果风格 ECharts 主题配置
// =====================================================

const APPLE_THEME = {
  // 颜色序列
  color: [
    "#1d1d1f", // 深灰黑
    "#636366", // 中灰
    "#86868b", // 浅灰
    "#aeaeb2", // 更浅灰
    "#34c759", // 苹果绿
    "#ff9f0a", // 苹果橙
  ],
  // 背景色
  backgroundColor: "transparent",
  // 文字样式
  textStyle: {
    fontFamily:
      "'SF Pro Display', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
    color: "#1d1d1f",
  },
  // 标题样式
  title: {
    textStyle: {
      fontSize: 18,
      fontWeight: 600,
      color: "#1d1d1f",
    },
    subtextStyle: {
      fontSize: 12,
      color: "#86868b",
    },
  },
  // 图例样式
  legend: {
    textStyle: {
      color: "#86868b",
      fontSize: 12,
    },
  },
  // 提示框样式
  tooltip: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderColor: "#e8e8ed",
    borderWidth: 1,
    textStyle: {
      color: "#1d1d1f",
    },
    extraCssText: "box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-radius: 12px;",
  },
  // 坐标轴样式
  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: "#d2d2d7",
      },
    },
    axisLabel: {
      color: "#86868b",
      fontSize: 12,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      lineStyle: {
        color: "#f0f0f5",
        type: "dashed",
      },
    },
  },
  valueAxis: {
    axisLine: {
      show: false,
    },
    axisLabel: {
      color: "#86868b",
      fontSize: 12,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      lineStyle: {
        color: "#f0f0f5",
        type: "dashed",
      },
    },
  },
};

// 注册主题
if (typeof window !== "undefined") {
  echarts.registerTheme("apple", APPLE_THEME);
}

// =====================================================
// ChartRenderer 组件
// =====================================================

export interface ChartRendererProps {
  /** 完整的图表数据对象 */
  chart?: ChartData | Record<string, any>;
  /** 图表类型 */
  type?: ChartData["type"];
  /** ECharts 配置选项 */
  option?: Record<string, unknown>;
  /** 表格数据 */
  tableData?: TableData;
  /** 图表标题 */
  title?: string;
  /** 自定义类名 */
  className?: string;
  /** 图表高度 */
  height?: number;
  /** 是否显示工具栏 */
  showToolbar?: boolean;
}

export function ChartRenderer({
  chart,
  type: propType,
  option: propOption,
  tableData: propTableData,
  title: propTitle,
  className,
  height = 400,
  showToolbar = true,
}: ChartRendererProps) {
  // 从 chart 对象或独立 props 中提取值
  const type = chart?.type || propType || "bar";
  const option = chart?.option || propOption;
  const tableData = chart?.tableData || propTableData;
  const title = chart?.title || propTitle;
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 初始化和更新图表
  useEffect(() => {
    if (!chartRef.current || type === "table") return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, "apple");
    }

    // 设置配置
    if (option) {
      // 应用默认样式增强
      const enhancedOption = enhanceChartOption(type, option);
      chartInstance.current.setOption(enhancedOption, true);
    }

    // 响应式调整
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [option, type]);

  // 清理图表实例
  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  // 下载图表为图片
  const handleDownload = () => {
    if (!chartInstance.current) return;

    const url = chartInstance.current.getDataURL({
      type: "png",
      pixelRatio: 2,
      backgroundColor: "#fff",
    });

    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "chart"}_${Date.now()}.png`;
    a.click();
  };

  // 刷新图表
  const handleRefresh = () => {
    if (!chartInstance.current) return;
    chartInstance.current.resize();
  };

  // 全屏切换
  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      chartInstance.current?.resize();
    }, 100);
  };

  // 表格类型渲染
  if (type === "table" && tableData) {
    return (
      <div className={cn("w-full", className)}>
        {title && (
          <h4 className="text-lg font-medium mb-4 text-foreground">{title}</h4>
        )}
        <TableRenderer data={tableData} />
      </div>
    );
  }

  // 图表渲染
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative bg-card rounded-2xl p-6 shadow-soft",
        isFullscreen && "fixed inset-4 z-50 bg-background",
        className
      )}
    >
      {/* 标题和工具栏 */}
      <div className="flex items-center justify-between mb-4">
        {title && (
          <h4 className="text-lg font-medium text-foreground">{title}</h4>
        )}
        {showToolbar && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleRefresh}
              title="刷新"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleDownload}
              title="下载"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleFullscreen}
              title="全屏"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* 图表容器 */}
      <div
        ref={chartRef}
        style={{ width: "100%", height: isFullscreen ? "calc(100% - 60px)" : height }}
      />
    </motion.div>
  );
}

// =====================================================
// 增强图表配置
// =====================================================

function enhanceChartOption(
  type: ChartData["type"],
  option: Record<string, unknown>
): Record<string, unknown> {
  const baseEnhancement = {
    animation: true,
    animationDuration: 800,
    animationEasing: "cubicOut",
    grid: {
      left: "3%",
      right: "4%",
      bottom: "12%",
      top: "15%",
      containLabel: true,
      ...(option.grid as Record<string, unknown>),
    },
  };

  switch (type) {
    case "bar":
      return {
        ...option,
        ...baseEnhancement,
        series: ((option.series as unknown[]) || []).map((s: unknown) => ({
          ...(s as Record<string, unknown>),
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            ...((s as Record<string, unknown>).itemStyle as Record<string, unknown>),
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.1)",
            },
          },
        })),
      };

    case "line":
      return {
        ...option,
        ...baseEnhancement,
        series: ((option.series as unknown[]) || []).map((s: unknown) => ({
          ...(s as Record<string, unknown>),
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: {
            width: 3,
            ...((s as Record<string, unknown>).lineStyle as Record<string, unknown>),
          },
        })),
      };

    case "pie":
      return {
        ...option,
        animation: true,
        animationDuration: 800,
        series: ((option.series as unknown[]) || []).map((s: unknown) => ({
          ...(s as Record<string, unknown>),
          radius: ["40%", "70%"],
          center: ["50%", "55%"],
          itemStyle: {
            borderRadius: 8,
            borderColor: "#fff",
            borderWidth: 2,
            ...((s as Record<string, unknown>).itemStyle as Record<string, unknown>),
          },
          emphasis: {
            scale: true,
            scaleSize: 10,
          },
        })),
      };

    case "radar":
      return {
        ...option,
        animation: true,
        animationDuration: 800,
        radar: {
          ...(option.radar as Record<string, unknown>),
          axisName: {
            color: "#86868b",
            fontSize: 12,
          },
          splitLine: {
            lineStyle: {
              color: "#f0f0f5",
            },
          },
          splitArea: {
            areaStyle: {
              color: ["rgba(245,245,247,0.3)", "rgba(245,245,247,0.1)"],
            },
          },
        },
      };

    default:
      return { ...option, ...baseEnhancement };
  }
}

// =====================================================
// TableRenderer 组件
// =====================================================

export interface TableRendererProps {
  data: TableData;
  className?: string;
}

export function TableRenderer({ data, className }: TableRendererProps) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-border", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted/50">
            {data.headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left text-sm font-medium text-foreground border-b border-border"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-3 text-sm text-foreground-secondary"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =====================================================
// ChartGallery 组件
// =====================================================

export interface ChartGalleryProps {
  charts: ChartData[];
  className?: string;
}

export function ChartGallery({ charts, className }: ChartGalleryProps) {
  if (!charts || charts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn("space-y-8", className)}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-title">数据可视化</h2>
        <p className="text-sm text-foreground-secondary">
          共 {charts.length} 个图表
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map((chart, index) => (
          <motion.div
            key={chart.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <ChartRenderer
              type={chart.type}
              title={chart.title}
              option={chart.option}
              tableData={chart.tableData}
              height={chart.type === "table" ? undefined : 350}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// 导出类型
export type { ChartRendererProps, TableRendererProps, ChartGalleryProps };
