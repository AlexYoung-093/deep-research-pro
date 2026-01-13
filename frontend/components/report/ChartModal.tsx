"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, Maximize2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChartModalProps {
  /** 是否显示 */
  isOpen: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 图表配置 JSON */
  chartConfig: string;
  /** 图表标题 */
  title?: string;
}

/**
 * 图表全屏查看模态框
 */
export function ChartModal({ 
  isOpen, 
  onClose, 
  chartConfig, 
  title = "图表详情" 
}: ChartModalProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [chartInstance, setChartInstance] = useState<any>(null);

  // 初始化图表
  useEffect(() => {
    if (!isOpen || !chartRef.current || !chartConfig) return;

    // 动态加载 ECharts
    const loadECharts = async () => {
      try {
        // @ts-ignore
        if (typeof window !== "undefined" && window.echarts) {
          // @ts-ignore
          const echarts = window.echarts;
          const chart = echarts.init(chartRef.current);
          const option = JSON.parse(chartConfig);
          chart.setOption(option);
          setChartInstance(chart);

          // 监听窗口大小变化
          const handleResize = () => chart.resize();
          window.addEventListener("resize", handleResize);
          
          return () => {
            window.removeEventListener("resize", handleResize);
            chart.dispose();
          };
        }
      } catch (err) {
        console.error("图表初始化失败:", err);
      }
    };

    loadECharts();
  }, [isOpen, chartConfig]);

  // 缩放
  const handleZoom = useCallback((delta: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(2, prev + delta)));
  }, []);

  // 下载图表
  const handleDownload = useCallback(() => {
    if (!chartInstance) return;
    const url = chartInstance.getDataURL({
      type: "png",
      pixelRatio: 2,
      backgroundColor: "#fff",
    });
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}_${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
  }, [chartInstance, title]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Maximize2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {title}
                </h3>
              </div>
              
              {/* 工具栏 */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleZoom(-0.1)}
                  className="p-2"
                  title="缩小"
                >
                  <ZoomOut className="w-5 h-5" />
                </Button>
                <span className="text-sm text-gray-500 w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleZoom(0.1)}
                  className="p-2"
                  title="放大"
                >
                  <ZoomIn className="w-5 h-5" />
                </Button>
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="p-2"
                  title="下载图表"
                >
                  <Download className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* 图表区域 */}
            <div 
              className="p-8 overflow-auto bg-gray-50 dark:bg-gray-800/50"
              style={{ maxHeight: "calc(90vh - 80px)" }}
            >
              <div
                style={{ transform: `scale(${zoom})`, transformOrigin: "center top" }}
                className="transition-transform duration-200"
              >
                <div
                  ref={chartRef}
                  className="w-full bg-white rounded-2xl shadow-lg"
                  style={{ height: "500px" }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * 图表全屏查看钩子
 */
export function useChartModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [chartConfig, setChartConfig] = useState("");
  const [title, setTitle] = useState("");

  const openChart = useCallback((config: string, chartTitle?: string) => {
    setChartConfig(config);
    setTitle(chartTitle || "图表详情");
    setIsOpen(true);
  }, []);

  const closeChart = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    chartConfig,
    title,
    openChart,
    closeChart,
  };
}



