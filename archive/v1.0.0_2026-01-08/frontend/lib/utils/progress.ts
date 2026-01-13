/**
 * 进度计算工具函数
 *
 * 用于计算工作流执行进度
 */

import {
  WORKFLOW_NODES,
  TOTAL_WEIGHT,
  type NodeConfig,
} from "@/types/research";

/**
 * 计算进度百分比
 */
export function calculateProgress(completedNodeIds: string[]): number {
  const completedWeight = WORKFLOW_NODES.filter((n) =>
    completedNodeIds.includes(n.id)
  ).reduce((sum, n) => sum + n.weight, 0);

  return Math.round((completedWeight / TOTAL_WEIGHT) * 100);
}

/**
 * 获取节点配置
 */
export function getNodeConfig(nodeId: string): NodeConfig | undefined {
  return WORKFLOW_NODES.find((n) => n.id === nodeId);
}

/**
 * 获取阶段节点
 */
export function getPhaseNodes(phase: number): NodeConfig[] {
  return WORKFLOW_NODES.filter((n) => n.phase === phase);
}

/**
 * 获取所有阶段
 */
export function getAllPhases(): number[] {
  const phases = new Set(WORKFLOW_NODES.map((n) => n.phase));
  return Array.from(phases).sort((a, b) => a - b);
}

/**
 * 获取阶段描述
 */
export function getPhaseDescription(phase: number): string {
  const descriptions: Record<number, string> = {
    0: "初始化",
    1: "数据采集",
    2: "深度分析",
    3: "报告撰写",
    4: "格式转换",
    5: "完成输出",
  };
  return descriptions[phase] || `阶段 ${phase}`;
}

/**
 * 估算剩余时间（秒）
 *
 * 基于已完成节点的平均耗时来估算
 */
export function estimateRemainingTime(
  completedNodeIds: string[],
  nodeTimings: Record<string, number>
): number | null {
  const completedNodes = WORKFLOW_NODES.filter((n) =>
    completedNodeIds.includes(n.id)
  );
  const pendingNodes = WORKFLOW_NODES.filter(
    (n) => !completedNodeIds.includes(n.id)
  );

  if (completedNodes.length === 0 || pendingNodes.length === 0) {
    return null;
  }

  // 计算平均每单位权重的耗时
  let totalTime = 0;
  let totalWeight = 0;

  for (const node of completedNodes) {
    const timing = nodeTimings[node.id];
    if (timing) {
      totalTime += timing;
      totalWeight += node.weight;
    }
  }

  if (totalWeight === 0) return null;

  const timePerWeight = totalTime / totalWeight;

  // 估算剩余时间
  const pendingWeight = pendingNodes.reduce((sum, n) => sum + n.weight, 0);
  return Math.round(pendingWeight * timePerWeight);
}

