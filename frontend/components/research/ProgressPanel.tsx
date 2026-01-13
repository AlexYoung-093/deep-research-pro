"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Loader2,
  Clock,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useResearchStore,
  useProgressPercentage,
} from "@/lib/stores/researchStore";
import { WORKFLOW_NODES, type NodeConfig } from "@/types/research";
import { formatDuration, cn } from "@/lib/utils";

export function ProgressPanel() {
  const progress = useResearchStore((state) => state.progress);
  const reset = useResearchStore((state) => state.reset);
  const percentage = useProgressPercentage();

  // 实时计时器
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (progress.status !== "running" || !progress.startTime) {
      if (progress.status === "idle") {
        setElapsedTime(0);
      }
      return;
    }

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - progress.startTime!) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [progress.status, progress.startTime]);

  // 获取节点状态
  const getNodeStatus = (node: NodeConfig) => {
    if (progress.completedNodes.includes(node.id)) {
      return "completed";
    }
    if (progress.currentNodeId === node.id) {
      return "running";
    }
    return "pending";
  };

  // 根据状态渲染不同内容
  if (progress.status === "idle") {
    return (
      <Card apple className="w-full flex-1 flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto"
          >
            <Clock className="w-8 h-8 text-foreground-tertiary" />
          </motion.div>
          <h3 className="text-title">等待开始</h3>
          <p className="text-body text-foreground-secondary max-w-xs">
            填写左侧表单并点击"开始深度研究"按钮，
            <br />
            此处将实时显示研究进度
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card apple className="w-full flex-1 flex flex-col">
      <div className="space-y-8 flex-1 flex flex-col">
        {/* 标题和状态 */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {progress.status === "running" && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </motion.div>
              )}
              {progress.status === "completed" && (
                <CheckCircle2 className="w-6 h-6 text-accent-green" />
              )}
              {progress.status === "error" && (
                <AlertCircle className="w-6 h-6 text-accent-red" />
              )}
              <h2 className="text-title">研究进度</h2>
            </div>
            <p className="text-body text-foreground-secondary">
              {progress.status === "running" && (
                progress.currentNodeTitle 
                  ? `正在执行: ${progress.currentNodeTitle}` 
                  : "正在为您生成研究报告..."
              )}
              {progress.status === "completed" && "🎉 研究报告已生成完成！"}
              {progress.status === "error" && "研究过程中出现错误"}
            </p>
          </div>
          {progress.status === "error" && (
            <Button variant="outline" size="sm" onClick={reset}>
              重新开始
            </Button>
          )}
        </div>

        {/* 进度条 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-lg">
              {progress.status === "completed" ? "100%" : `${percentage}%`}
            </span>
            <span className="text-foreground-secondary">
              已用时: {formatDuration(elapsedTime)}
            </span>
          </div>
          <div className="relative">
            <Progress
              value={progress.status === "completed" ? 100 : percentage}
              className="h-3"
              indicatorClassName={cn(
                "transition-all duration-500",
                progress.status === "completed" && "bg-accent-green",
                progress.status === "error" && "bg-accent-red",
                progress.status === "running" && "bg-blue-500"
              )}
            />
            {progress.status === "running" && (
              <motion.div
                className="absolute top-0 left-0 h-3 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                animate={{ x: ["0%", "400%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                style={{ width: "20%" }}
              />
            )}
          </div>
        </div>

        {/* 错误信息 */}
        <AnimatePresence>
          {progress.status === "error" && progress.error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-accent-red/10 border border-accent-red/20 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-accent-red shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-accent-red">执行出错</p>
                  <p className="text-sm text-foreground-secondary mt-1">
                    {progress.error}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 节点列表 */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground-secondary">
            执行步骤 ({progress.completedNodes.length}/{WORKFLOW_NODES.filter(n => n.phase > 0).length})
          </h3>
          <div className="space-y-2">
            {WORKFLOW_NODES.filter((n) => n.phase > 0).map((node, index) => {
              const status = getNodeStatus(node);
              const timing = progress.nodeTimings[node.id];

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                    status === "running" && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800",
                    status === "completed" && "bg-accent-green/5"
                  )}
                >
                  {/* 状态图标 */}
                  {status === "completed" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-accent-green shrink-0" />
                    </motion.div>
                  )}
                  {status === "running" && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-5 h-5 text-blue-500 shrink-0" />
                    </motion.div>
                  )}
                  {status === "pending" && (
                    <Circle className="w-5 h-5 text-foreground-tertiary shrink-0" />
                  )}

                  {/* 节点标题 */}
                  <span
                    className={cn(
                      "flex-1 text-sm transition-colors",
                      status === "completed" && "text-accent-green",
                      status === "running" && "font-medium text-blue-600 dark:text-blue-400",
                      status === "pending" && "text-foreground-tertiary"
                    )}
                  >
                    {node.title}
                    {status === "running" && (
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="ml-2"
                      >
                        ...
                      </motion.span>
                    )}
                  </span>

                  {/* 耗时 */}
                  {timing !== undefined && timing > 0 && (
                    <span className="text-xs text-foreground-tertiary">
                      {formatDuration(Math.round(timing))}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 完成提示 */}
        <AnimatePresence>
          {progress.status === "completed" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent-green/10 border border-accent-green/20 rounded-xl p-4 text-center"
            >
              <p className="font-medium text-accent-green">
                🎉 研究完成！请向下滚动查看完整报告
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
