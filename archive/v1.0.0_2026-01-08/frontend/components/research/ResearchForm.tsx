"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useResearchStore } from "@/lib/stores/researchStore";
import type { ResearchInputs } from "@/types/research";

// 默认输入值
const defaultInputs: ResearchInputs = {
  research_topic: "",
  report_type: "行业研报",
  depth_level: "深度研究",
  word_count: "3000字",
};

export function ResearchForm() {
  // 使用本地 state 替代 Zustand 以避免 SSR 问题
  const [inputs, setInputsState] = useState<ResearchInputs>(defaultInputs);
  const [mounted, setMounted] = useState(false);

  // Zustand store actions
  const startWorkflow = useResearchStore((state) => state.startWorkflow);
  const setCurrentNode = useResearchStore((state) => state.setCurrentNode);
  const completeNode = useResearchStore((state) => state.completeNode);
  const completeWorkflow = useResearchStore((state) => state.completeWorkflow);
  const setError = useResearchStore((state) => state.setError);
  const setResult = useResearchStore((state) => state.setResult);
  const progressStatus = useResearchStore((state) => state.progress.status);

  const isRunning = progressStatus === "running";

  useEffect(() => {
    setMounted(true);
  }, []);

  const setInputs = (newInputs: Partial<ResearchInputs>) => {
    setInputsState((prev) => ({ ...prev, ...newInputs }));
  };

  const isValid = inputs.research_topic.trim().length > 0 && inputs.report_type.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isRunning) return;
    
    // 启动工作流（更新 Zustand store）
    startWorkflow();
    
    try {
      console.log("[Research] 开始请求，inputs:", inputs);
      
      const response = await fetch("/api/research/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs }),
      });

      console.log("[Research] Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP 错误 ${response.status}: ${errorText}`);
      }

      if (!response.body) {
        throw new Error("响应体为空");
      }

      // 读取 SSE 流
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let htmlContent = "";
      let chartsJson = "";
      let structuredData = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("[SSE] 流结束");
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        
        // 解析 SSE 事件
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const jsonStr = line.slice(6).trim();
              if (jsonStr) {
                const event = JSON.parse(jsonStr);
                console.log("[SSE] 事件:", event);
                
                // 处理不同事件类型，同步到 Zustand store
                if (event.event === "workflow_started") {
                  // 工作流已启动
                  console.log("[SSE] 工作流已启动");
                } else if (event.event === "node_started") {
                  const nodeId = event.data?.node_id || "";
                  const nodeTitle = event.data?.title || "节点";
                  setCurrentNode(nodeId, nodeTitle);
                } else if (event.event === "node_finished") {
                  const nodeId = event.data?.node_id || "";
                  const elapsed = event.data?.elapsed_time || 0;
                  completeNode(nodeId, Math.round(elapsed));
                } else if (event.event === "workflow_finished") {
                  // 提取输出内容
                  const outputs = event.data?.outputs || {};
                  htmlContent = outputs.html_content || "";
                  chartsJson = outputs.charts_json || "";
                  structuredData = outputs.structured_data || "";
                  
                  // 清理 markdown 代码块标记（支持 html, json 等）
                  const cleanMarkdownBlock = (str: string): string => {
                    if (!str) return "";
                    let cleaned = str.trim();
                    // 移除开头的 ```html, ```json, ``` 等
                    if (cleaned.startsWith("```html")) {
                      cleaned = cleaned.slice(7);
                    } else if (cleaned.startsWith("```json")) {
                      cleaned = cleaned.slice(7);
                    } else if (cleaned.startsWith("```")) {
                      cleaned = cleaned.slice(3);
                    }
                    // 移除结尾的 ```
                    if (cleaned.endsWith("```")) {
                      cleaned = cleaned.slice(0, -3);
                    }
                    return cleaned.trim();
                  };
                  
                  // 清理 HTML 内容
                  htmlContent = cleanMarkdownBlock(htmlContent);
                  
                  // 用于 JSON 的清理函数
                  const cleanJson = cleanMarkdownBlock;
                  
                  // 解析图表数据
                  let charts: any[] = [];
                  try {
                    const cleanedChartsJson = cleanJson(chartsJson);
                    if (cleanedChartsJson) {
                      const parsed = JSON.parse(cleanedChartsJson);
                      charts = Array.isArray(parsed) ? parsed : [parsed];
                    }
                  } catch (e) {
                    console.warn("[SSE] 图表 JSON 解析失败:", e, chartsJson);
                  }
                  
                  // 解析结构化数据
                  let parsedStructuredData = null;
                  try {
                    const cleanedStructuredData = cleanJson(structuredData);
                    if (cleanedStructuredData) {
                      parsedStructuredData = JSON.parse(cleanedStructuredData);
                    }
                  } catch (e) {
                    console.warn("[SSE] 结构化数据解析失败:", e);
                  }
                  
                  console.log("[SSE] 工作流完成，结果:", { htmlContent: htmlContent.length, charts: charts.length, parsedStructuredData });
                  
                  // 设置结果
                  setResult({
                    htmlContent,
                    reportContent: outputs.report_content || "",
                    charts,
                    structuredData: parsedStructuredData,
                    downloadUrl: null,
                  });
                  
                  // 完成工作流
                  completeWorkflow();
                } else if (event.event === "error") {
                  setError(event.data?.error || "工作流执行错误");
                  return;
                }
              }
            } catch (parseError) {
              console.warn("[SSE] 解析错误:", parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error("研究失败:", error);
      const errorMsg = error instanceof Error ? error.message : "未知错误";
      setError(errorMsg);
    }
  };

  if (!mounted) {
    return (
      <Card apple className="w-full">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-14 bg-gray-200 rounded-full"></div>
        </div>
      </Card>
    );
  }

  // 报告类型选项
  const reportTypeOptions = [
    { value: "行业研报", label: "行业研报", desc: "市场规模、竞争格局、发展趋势" },
    { value: "竞品分析", label: "竞品分析", desc: "产品对比、优劣势、差异化策略" },
    { value: "技术调研", label: "技术调研", desc: "技术原理、方案对比、落地建议" },
    { value: "市场分析", label: "市场分析", desc: "需求洞察、用户画像、商业机会" },
    { value: "趋势预测", label: "趋势预测", desc: "行业动向、技术演进、未来预判" },
    { value: "政策解读", label: "政策解读", desc: "政策要点、影响评估、合规建议" },
  ];

  // 深度选项
  const depthOptions = [
    { value: "快速概览", label: "快速概览", desc: "5-10分钟" },
    { value: "中度分析", label: "中度分析", desc: "15-20分钟" },
    { value: "深度研究", label: "深度研究", desc: "30-45分钟" },
  ];

  // 字数选项
  const wordCountOptions = [
    { value: "1500字", label: "1500字 - 简要概览" },
    { value: "3000字", label: "3000字 - 标准报告" },
    { value: "5000字", label: "5000字 - 详细分析" },
    { value: "8000字", label: "8000字 - 深度研究" },
  ];

  return (
    <Card apple className="w-full flex-1 flex flex-col">
      <form onSubmit={handleSubmit} className="space-y-8 flex-1 flex flex-col">
        {/* 标题 */}
        <div>
          <h2 className="text-title mb-2">研究参数</h2>
          <p className="text-body text-foreground-secondary">
            填写以下信息，AI 将为您生成专业的研究报告
          </p>
        </div>

        {/* 研究主题 */}
        <div className="space-y-3">
          <Label htmlFor="topic" className="text-sm font-medium">
            研究主题 <span className="text-accent-red">*</span>
          </Label>
          <Input
            id="topic"
            apple
            value={inputs.research_topic}
            onChange={(e) => setInputs({ research_topic: e.target.value })}
            placeholder="例如：2024年新能源汽车行业发展趋势"
            disabled={isRunning}
            className="text-lg"
          />
        </div>

        {/* 报告类型 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            报告类型 <span className="text-accent-red">*</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {reportTypeOptions.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setInputs({
                    report_type: option.value as typeof inputs.report_type,
                  })
                }
                disabled={isRunning}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  inputs.report_type === option.value
                    ? "border-[#1d1d1f] bg-[#1d1d1f]/5 dark:border-[#f5f5f7] dark:bg-[#f5f5f7]/5"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="font-medium text-sm">{option.label}</div>
                <div className="text-xs text-foreground-secondary mt-1 line-clamp-1">
                  {option.desc}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 深度级别 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">研究深度</Label>
          <div className="grid grid-cols-3 gap-3">
            {depthOptions.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setInputs({
                    depth_level: option.value as typeof inputs.depth_level,
                  })
                }
                disabled={isRunning}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  inputs.depth_level === option.value
                    ? "border-[#1d1d1f] bg-[#1d1d1f]/5 dark:border-[#f5f5f7] dark:bg-[#f5f5f7]/5"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="font-medium text-sm">{option.label}</div>
                <div className="text-xs text-foreground-secondary mt-1">
                  {option.desc}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 字数要求 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">报告字数</Label>
          <select
            value={inputs.word_count}
            onChange={(e) => setInputs({ word_count: e.target.value as typeof inputs.word_count })}
            disabled={isRunning}
            className="w-full border-0 border-b-2 border-gray-200 bg-transparent py-4 text-sm focus:border-[#1d1d1f] focus:outline-none disabled:opacity-50 dark:border-gray-700 dark:focus:border-[#f5f5f7]"
          >
            {wordCountOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 提交按钮 */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            size="lg"
            disabled={!isValid || isRunning}
            className="w-full rounded-full h-14 text-lg font-medium"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                研究进行中...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                开始深度研究
              </>
            )}
          </Button>
        </motion.div>

        {/* 提示信息 */}
        <p className="text-caption text-center text-foreground-tertiary">
          预计耗时 5-30 分钟，取决于研究深度和网络状况
        </p>
      </form>
    </Card>
  );
}
