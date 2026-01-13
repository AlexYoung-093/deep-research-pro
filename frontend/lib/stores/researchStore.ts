"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  ResearchInputs,
  WorkflowProgress,
  ResearchResult,
  HistoryItem,
} from "@/types/research";

// =====================================================
// Store 接口定义
// =====================================================

interface ResearchState {
  // 表单输入
  inputs: ResearchInputs;

  // 工作流进度
  progress: WorkflowProgress;

  // 研究结果
  result: ResearchResult | null;

  // 历史记录
  history: HistoryItem[];
}

interface ResearchActions {
  // 表单操作
  setInputs: (inputs: Partial<ResearchInputs>) => void;
  resetInputs: () => void;

  // 进度操作
  startWorkflow: () => void;
  setCurrentNode: (nodeId: string, nodeTitle: string) => void;
  completeNode: (nodeId: string, elapsedTime?: number) => void;
  completeWorkflow: () => void;
  setError: (error: string) => void;
  resetProgress: () => void;

  // 结果操作
  setResult: (result: ResearchResult) => void;
  clearResult: () => void;

  // 历史操作
  addToHistory: (item: Omit<HistoryItem, "id" | "createdAt">) => void;
  clearHistory: () => void;

  // 重置全部
  reset: () => void;
}

// =====================================================
// 初始状态
// =====================================================

const initialInputs: ResearchInputs = {
  research_topic: "",
  report_type: "行业研报",
  depth_level: "深度研究",
  word_count: "3000字",
};

const initialProgress: WorkflowProgress = {
  status: "idle",
  currentNodeId: null,
  currentNodeTitle: null,
  completedNodes: [],
  nodeTimings: {},
  startTime: null,
  error: null,
};

// =====================================================
// Store 创建
// =====================================================

export const useResearchStore = create<ResearchState & ResearchActions>()(
  devtools(
    (set) => ({
        // =====================
        // 状态
        // =====================
        inputs: initialInputs,
        progress: initialProgress,
        result: null,
        history: [],

        // =====================
        // 表单操作
        // =====================
        setInputs: (newInputs) =>
          set(
            (state) => ({
              inputs: { ...state.inputs, ...newInputs },
            }),
            false,
            "setInputs"
          ),

        resetInputs: () =>
          set({ inputs: initialInputs }, false, "resetInputs"),

        // =====================
        // 进度操作
        // =====================
        startWorkflow: () =>
          set(
            {
              progress: {
                ...initialProgress,
                status: "running",
                startTime: Date.now(),
              },
              result: null,
            },
            false,
            "startWorkflow"
          ),

        setCurrentNode: (nodeId, nodeTitle) =>
          set(
            (state) => ({
              progress: {
                ...state.progress,
                currentNodeId: nodeId,
                currentNodeTitle: nodeTitle,
              },
            }),
            false,
            "setCurrentNode"
          ),

        completeNode: (nodeId, elapsedTime) =>
          set(
            (state) => ({
              progress: {
                ...state.progress,
                completedNodes: [...state.progress.completedNodes, nodeId],
                nodeTimings: elapsedTime
                  ? { ...state.progress.nodeTimings, [nodeId]: elapsedTime }
                  : state.progress.nodeTimings,
                currentNodeId: null,
                currentNodeTitle: null,
              },
            }),
            false,
            "completeNode"
          ),

        completeWorkflow: () =>
          set(
            (state) => ({
              progress: {
                ...state.progress,
                status: "completed",
                currentNodeId: null,
                currentNodeTitle: null,
              },
            }),
            false,
            "completeWorkflow"
          ),

        setError: (error) =>
          set(
            (state) => ({
              progress: {
                ...state.progress,
                status: "error",
                error,
                currentNodeId: null,
                currentNodeTitle: null,
              },
            }),
            false,
            "setError"
          ),

        resetProgress: () =>
          set({ progress: initialProgress }, false, "resetProgress"),

        // =====================
        // 结果操作
        // =====================
        setResult: (result) => set({ result }, false, "setResult"),

        clearResult: () => set({ result: null }, false, "clearResult"),

        // =====================
        // 历史操作
        // =====================
        addToHistory: (item) =>
          set(
            (state) => ({
              history: [
                {
                  id: Date.now().toString(),
                  topic: item.topic,
                  status: item.status,
                  createdAt: new Date().toISOString(),
                },
                ...state.history.slice(0, 19), // 最多保留 20 条
              ],
            }),
            false,
            "addToHistory"
          ),

        clearHistory: () => set({ history: [] }, false, "clearHistory"),

        // =====================
        // 重置全部
        // =====================
        reset: () =>
          set(
            {
              inputs: initialInputs,
              progress: initialProgress,
              result: null,
            },
            false,
            "reset"
          ),
      }),
    { name: "ResearchStore" }
  )
);

// =====================================================
// 选择器 (使用稳定的选择器避免无限循环)
// =====================================================

// 使用直接从 store 计算的选择器
export const useIsFormValid = () => {
  return useResearchStore((state) => 
    state.inputs.research_topic.trim().length > 0 &&
    state.inputs.report_type.length > 0
  );
};

export const useIsRunning = () => {
  return useResearchStore((state) => state.progress.status === "running");
};

// 节点权重配置 V5 稳定版（5个HTTP抓取 + 图表内嵌HTML）
const NODE_WEIGHTS: Record<string, number> = {
  "2001": 0.1,
  "20021": 1,  // Startpage
  "20022": 1,  // Brave
  "20023": 1,  // 深度搜索
  "20024": 1,  // Yahoo
  "20025": 1,  // Ecosia
  "2002": 3,
  "2003": 6,
  "2004": 10,
  "2005": 8,
  "2009": 0.1,
};
const TOTAL_WEIGHT = Object.values(NODE_WEIGHTS).reduce((a, b) => a + b, 0);

export const useProgressPercentage = () => {
  return useResearchStore((state) => {
    const completedWeight = state.progress.completedNodes.reduce(
      (sum, nodeId) => sum + (NODE_WEIGHTS[nodeId] || 0),
      0
    );
    return Math.round((completedWeight / TOTAL_WEIGHT) * 100);
  });
};

export const useElapsedTime = () => {
  return useResearchStore((state) => {
    const { startTime, status } = state.progress;
    if (!startTime || status === "idle") return 0;
    return Date.now() - startTime;
  });
};

