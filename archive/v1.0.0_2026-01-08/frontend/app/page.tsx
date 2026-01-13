"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ResearchForm } from "@/components/research/ResearchForm";
import { ProgressPanel } from "@/components/research/ProgressPanel";
import { useResearchStore } from "@/lib/stores/researchStore";
import { ChartRenderer } from "@/components/charts/ChartRenderer";
import { FileDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  const status = useResearchStore((state) => state.progress.status);
  const result = useResearchStore((state) => state.result);

  // 下载 HTML 报告
  const handleDownloadHtml = () => {
    if (!result?.htmlContent) return;
    const blob = new Blob([result.htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `研究报告_${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 在新窗口中查看报告
  const handleOpenReport = () => {
    if (!result?.htmlContent) return;
    const blob = new Blob([result.htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="container-apple section-spacing">
      {/* Hero 区域 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-16 md:mb-24"
      >
        <h1 className="text-headline md:text-display mb-6">
          深度研究
          <span className="text-secondary block md:inline md:ml-4">
            智能报告
          </span>
        </h1>
        <p className="text-callout text-foreground-secondary max-w-2xl mx-auto">
          输入您的研究主题，AI 将自动搜索多个数据源，
          <br className="hidden md:block" />
          生成专业的深度分析报告
        </p>
      </motion.section>

      {/* 主内容区域 - 两栏布局，高度对齐 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">
        {/* 左侧 - 输入表单 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex"
        >
          <ResearchForm />
        </motion.div>

        {/* 右侧 - 进度展示 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex"
        >
          <ProgressPanel />
        </motion.div>
      </div>

      {/* 报告展示区域 - 完成后直接显示 */}
      <AnimatePresence>
        {status === "completed" && result?.htmlContent && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 md:mt-24"
          >
            {/* 报告标题和操作按钮 */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-title mb-2">📄 研究报告</h2>
                <p className="text-body text-foreground-secondary">
                  AI 深度研究报告已生成完成
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={handleOpenReport}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  新窗口查看
                </Button>
                <Button size="sm" onClick={handleDownloadHtml}>
                  <FileDown className="w-4 h-4 mr-2" />
                  下载 HTML
                </Button>
              </div>
            </div>

            {/* 报告内容 iframe */}
            <Card apple className="overflow-hidden">
              <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                <iframe
                  srcDoc={result.htmlContent}
                  className="w-full min-h-[800px] border-0"
                  title="研究报告"
                  sandbox="allow-same-origin"
                />
              </div>
            </Card>

            {/* 图表展示区域 */}
            {result.charts && result.charts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12"
              >
                <h3 className="text-title mb-6">📊 数据图表</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.charts.map((chart, index) => (
                    <Card key={chart.id || index} apple className="p-6">
                      <h4 className="text-sm font-medium mb-4">{chart.title || `图表 ${index + 1}`}</h4>
                      <div className="h-80">
                        <ChartRenderer chart={chart} height={300} />
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
