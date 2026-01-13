"use client";

import { useCallback, useRef } from "react";
import { useResearchStore } from "@/lib/stores/researchStore";
import { parseChartJson, generateChartsFromStructuredData } from "@/lib/utils/chartParser";
import type { ResearchInputs, DifySSEEvent, ChartData, StructuredReportData } from "@/types/research";

/**
 * useWorkflowSSE Hook
 *
 * 处理 Dify Workflow API 的 SSE 流式响应，
 * 自动更新 Zustand Store 中的进度状态。
 * 
 * Phase 2: 增加图表数据解析支持
 */
export function useWorkflowSSE() {
  const abortControllerRef = useRef<AbortController | null>(null);

  // Store actions
  const storeActions = useResearchStore((state) => ({
    startWorkflow: state.startWorkflow,
    setCurrentNode: state.setCurrentNode,
    completeNode: state.completeNode,
    completeWorkflow: state.completeWorkflow,
    setError: state.setError,
    setResult: state.setResult,
    addToHistory: state.addToHistory,
  }));

  const inputs = useResearchStore((state) => state.inputs);

  /**
   * 解析图表数据
   */
  const parseCharts = useCallback((outputs: Record<string, unknown>): ChartData[] => {
    let charts: ChartData[] = [];

    // 方式1: 直接从 charts_json 解析
    const chartsJson = outputs.charts_json as string;
    if (chartsJson) {
      try {
        charts = parseChartJson(chartsJson);
        console.log("[SSE] 从 charts_json 解析图表:", charts.length);
      } catch (e) {
        console.warn("[SSE] charts_json 解析失败:", e);
      }
    }

    // 方式2: 从 structured_data 生成
    if (charts.length === 0) {
      const structuredDataStr = outputs.structured_data as string;
      if (structuredDataStr) {
        try {
          const structuredData = JSON.parse(structuredDataStr) as StructuredReportData;
          charts = generateChartsFromStructuredData(structuredData);
          console.log("[SSE] 从 structured_data 生成图表:", charts.length);
        } catch (e) {
          console.warn("[SSE] structured_data 解析失败:", e);
        }
      }
    }

    return charts;
  }, []);

  /**
   * 处理 SSE 事件
   */
  const handleEvent = useCallback(
    (event: DifySSEEvent) => {
      switch (event.event) {
        case "workflow_started":
          // 工作流已启动，store 已在 startWorkflow 中更新
          console.log("[SSE] 工作流已启动:", event.workflow_run_id);
          break;

        case "node_started":
          if (event.data.id && event.data.title) {
            storeActions.setCurrentNode(event.data.id, event.data.title);
            console.log("[SSE] 节点开始:", event.data.title);
          }
          break;

        case "node_finished":
          if (event.data.id) {
            storeActions.completeNode(event.data.id, event.data.elapsed_time);
            console.log("[SSE] 节点完成:", event.data.title);
          }
          break;

        case "workflow_finished":
          storeActions.completeWorkflow();
          console.log("[SSE] 工作流完成");

          // 提取结果
          if (event.data.outputs) {
            const outputs = event.data.outputs as Record<string, unknown>;
            
            // 提取 HTML 内容
            const htmlContent =
              (outputs.result as string) ||
              (outputs.html_content as string) ||
              (outputs.html as string) ||
              "";

            // 提取下载链接
            const downloadUrl = (outputs.download_url as string) || null;

            // 解析图表数据
            const charts = parseCharts(outputs);

            // 解析结构化数据
            let structuredData: StructuredReportData | undefined;
            const structuredDataStr = outputs.structured_data as string;
            if (structuredDataStr) {
              try {
                structuredData = JSON.parse(structuredDataStr);
              } catch (e) {
                console.warn("[SSE] 结构化数据解析失败");
              }
            }

            storeActions.setResult({
              htmlContent,
              markdownContent: null,
              downloadUrl,
              generatedAt: new Date().toISOString(),
              charts: charts.length > 0 ? charts : undefined,
              structuredData,
            });

            // 添加到历史记录
            storeActions.addToHistory({
              topic: inputs.research_topic,
              status: "completed",
            });

            console.log("[SSE] 结果已保存, 图表数量:", charts.length);
          }
          break;

        case "error":
          const errorMessage =
            event.data.error || event.data.message || "未知错误";
          storeActions.setError(errorMessage as string);
          console.error("[SSE] 错误:", errorMessage);

          // 添加失败记录到历史
          storeActions.addToHistory({
            topic: inputs.research_topic,
            status: "error",
          });
          break;

        default:
          console.log("[SSE] 未知事件:", event);
      }
    },
    [storeActions, inputs.research_topic, parseCharts]
  );

  /**
   * 开始工作流
   */
  const startWorkflow = useCallback(
    async (researchInputs: ResearchInputs) => {
      // 取消之前的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 创建新的 AbortController
      abortControllerRef.current = new AbortController();

      // 更新 store 状态
      storeActions.startWorkflow();

      try {
        // 发起 SSE 请求
        const response = await fetch("/api/research/stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: researchInputs }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP 错误: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("响应体为空");
        }

        // 读取 SSE 流
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log("[SSE] 流结束");
            break;
          }

          // 解码数据
          buffer += decoder.decode(value, { stream: true });

          // 处理可能的多行数据
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // 保留不完整的行

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const jsonStr = line.slice(6).trim();
                if (jsonStr) {
                  const event = JSON.parse(jsonStr) as DifySSEEvent;
                  handleEvent(event);
                }
              } catch (parseError) {
                console.warn("[SSE] 解析失败:", line, parseError);
              }
            }
          }
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.log("[SSE] 请求已取消");
          return;
        }

        console.error("[SSE] 连接错误:", error);
        storeActions.setError(
          error instanceof Error ? error.message : "连接失败"
        );

        // 添加失败记录
        storeActions.addToHistory({
          topic: researchInputs.research_topic,
          status: "error",
        });
      }
    },
    [handleEvent, storeActions]
  );

  /**
   * 取消工作流
   */
  const cancelWorkflow = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    startWorkflow,
    cancelWorkflow,
  };
}
