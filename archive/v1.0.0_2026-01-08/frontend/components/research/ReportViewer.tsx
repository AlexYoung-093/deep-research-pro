"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Code,
  BarChart3,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useResearchStore } from "@/lib/stores/researchStore";
import { ChartGallery } from "@/components/charts/ChartRenderer";
import { formatDate } from "@/lib/utils";

export function ReportViewer() {
  const result = useResearchStore((state) => state.result);
  const inputs = useResearchStore((state) => state.inputs);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");

  if (!result) return null;

  // 判断是否有图表数据
  const hasCharts = result.charts && result.charts.length > 0;

  // 复制 HTML 内容
  const handleCopyHTML = async () => {
    if (!result.htmlContent) return;
    await navigator.clipboard.writeText(result.htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 下载 HTML 文件
  const handleDownloadHTML = () => {
    if (!result.htmlContent) return;
    const blob = new Blob([result.htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `研究报告_${inputs.research_topic.slice(0, 20)}_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 下载图表数据 JSON
  const handleDownloadCharts = () => {
    if (!hasCharts) return;
    const blob = new Blob([JSON.stringify(result.charts, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `图表数据_${inputs.research_topic.slice(0, 20)}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 在新窗口中打开
  const handleOpenInNewTab = () => {
    if (!result.htmlContent) return;
    const blob = new Blob([result.htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* 标题和操作栏 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-title">研究报告</h2>
          <p className="text-body text-foreground-secondary">
            {inputs.report_type}: {inputs.research_topic}
            {result.generatedAt && (
              <span className="ml-2">
                · 生成于 {formatDate(result.generatedAt)}
              </span>
            )}
            {hasCharts && (
              <span className="ml-2 text-accent-green">
                · 包含 {result.charts!.length} 个可视化图表
              </span>
            )}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleCopyHTML}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                已复制
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                复制 HTML
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
            <ExternalLink className="mr-2 h-4 w-4" />
            新窗口打开
          </Button>
          {hasCharts && (
            <Button variant="outline" size="sm" onClick={handleDownloadCharts}>
              <BarChart3 className="mr-2 h-4 w-4" />
              下载图表
            </Button>
          )}
          <Button size="sm" onClick={handleDownloadHTML}>
            <Download className="mr-2 h-4 w-4" />
            下载报告
          </Button>
        </div>
      </div>

      {/* 报告内容标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList
          className={`grid w-full ${hasCharts ? "grid-cols-3" : "grid-cols-2"} md:w-auto md:inline-grid`}
        >
          <TabsTrigger value="preview" className="gap-2">
            <FileText className="h-4 w-4" />
            报告预览
          </TabsTrigger>
          {hasCharts && (
            <TabsTrigger value="charts" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              数据图表
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-accent-green/10 text-accent-green rounded-full">
                {result.charts!.length}
              </span>
            </TabsTrigger>
          )}
          <TabsTrigger value="source" className="gap-2">
            <Code className="h-4 w-4" />
            源代码
          </TabsTrigger>
        </TabsList>

        {/* 预览标签内容 */}
        <TabsContent value="preview" className="mt-6">
          <Card className="overflow-hidden border-0 shadow-medium">
            <div className="report-preview">
              <iframe
                srcDoc={result.htmlContent}
                className="w-full h-[700px] border-0"
                title="研究报告预览"
                sandbox="allow-same-origin"
              />
            </div>
          </Card>
        </TabsContent>

        {/* 图表标签内容 */}
        {hasCharts && (
          <TabsContent value="charts" className="mt-6">
            <ChartGallery charts={result.charts!} />
          </TabsContent>
        )}

        {/* 源代码标签内容 */}
        <TabsContent value="source" className="mt-6">
          <Card className="overflow-hidden">
            <ScrollArea className="h-[700px]">
              <pre className="p-6 text-sm font-mono whitespace-pre-wrap break-words bg-muted">
                <code>{result.htmlContent}</code>
              </pre>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
