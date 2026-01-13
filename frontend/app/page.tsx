"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResearchForm } from "@/components/research/ResearchForm";
import { ProgressPanel } from "@/components/research/ProgressPanel";
import { useResearchStore } from "@/lib/stores/researchStore";
import { 
  FileDown, 
  ExternalLink, 
  FileText,
  Calendar,
  Clock,
  BarChart3,
  Sparkles,
  Zap,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Confetti, SuccessGlow, FloatingOrbs, StepConfetti } from "@/components/effects";

export default function HomePage() {
  const status = useResearchStore((state) => state.progress.status);
  const result = useResearchStore((state) => state.result);
  const completedNodes = useResearchStore((state) => state.progress.completedNodes);
  
  // 控制彩带效果
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessGlow, setShowSuccessGlow] = useState(false);
  
  // 步骤彩带效果
  const [showStepConfetti, setShowStepConfetti] = useState(false);
  const prevCompletedCountRef = useRef(0);
  
  // 监听步骤完成，每完成一步放出小彩带
  useEffect(() => {
    const currentCount = completedNodes.length;
    const prevCount = prevCompletedCountRef.current;
    
    // 只在运行中且有新步骤完成时触发
    if (status === "running" && currentCount > prevCount && currentCount > 0) {
      setShowStepConfetti(true);
      
      // 短暂显示后关闭，准备下一次触发
      const timer = setTimeout(() => {
        setShowStepConfetti(false);
      }, 100); // 快速重置以便下一步触发
      
      return () => clearTimeout(timer);
    }
    
    // 更新记录
    prevCompletedCountRef.current = currentCount;
  }, [completedNodes.length, status]);
  
  // 当状态变为 idle 时重置计数器
  useEffect(() => {
    if (status === "idle") {
      prevCompletedCountRef.current = 0;
    }
  }, [status]);
  
  // 当研究完成时触发庆祝效果（更多更大的彩带）
  useEffect(() => {
    if (status === "completed" && result?.htmlContent) {
      // 触发大彩带和光效
      setShowConfetti(true);
      setShowSuccessGlow(true);
      
      // 3秒后关闭光效
      const glowTimer = setTimeout(() => {
        setShowSuccessGlow(false);
      }, 3000);
      
      // 8秒后关闭彩带（延长显示时间）
      const confettiTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 8000);
      
      return () => {
        clearTimeout(glowTimer);
        clearTimeout(confettiTimer);
      };
    }
  }, [status, result]);

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
    <div className="container-apple py-12 md:py-16 lg:py-20 relative min-h-screen">
      {/* 背景浮动光晕效果 - 调整透明度 */}
      <FloatingOrbs active={status === "idle" || status === "running"} />
      
      {/* 每步成功时的小彩带效果 */}
      <StepConfetti active={showStepConfetti} count={40} duration={2500} />
      
      {/* 全部完成时的大彩带庆祝效果（更多更大） */}
      <Confetti active={showConfetti} count={300} duration={8000} />
      <SuccessGlow active={showSuccessGlow} />
      
      {/* Hero 区域 - 精简布局 */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-8 md:mb-12 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          {/* 动态图标装饰 - 更小更精致 */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-sky-400/80" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-4 h-4 text-amber-400/80" />
            </motion.div>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            >
              <TrendingUp className="w-5 h-5 text-rose-400/80" />
            </motion.div>
          </div>
          
          {/* 标题 - 淡蓝与淡暖色渐变 */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 tracking-tight">
            <motion.span
              className="inline-block"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: "linear-gradient(90deg, #60a5fa, #93c5fd, #f9a8d4, #fda4af, #fdba74, #60a5fa)",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              深度研究
            </motion.span>
            <motion.span 
              className="inline-block ml-2 md:ml-3"
              animate={{ 
                backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: "linear-gradient(90deg, #fcd34d, #fbbf24, #fb923c, #f97316, #fcd34d)",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              智能报告
            </motion.span>
          </h1>
        </motion.div>
        
        <motion.p 
          className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          输入研究主题，AI 自动搜索多源数据，生成专业深度分析报告
        </motion.p>
        
        {/* 状态指示 - 更紧凑 */}
        <AnimatePresence>
          {(status === "running" || status === "completed") && (
            <motion.div
              className="mt-4 flex items-center justify-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              {status === "running" && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-sky-500"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-xs text-sky-600 dark:text-sky-400 font-medium">研究中...</span>
                </div>
              )}
              {status === "completed" && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">完成</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* 主内容区域 - 优化比例，确保两栏等高 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch relative z-10">
        {/* 左侧 - 输入表单 */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-h-[500px]"
        >
          <ResearchForm />
        </motion.div>

        {/* 右侧 - 进度展示 */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-h-[500px]"
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
            className="mt-16 md:mt-24 relative z-10"
          >
            {/* 成功分隔装饰线 */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent mb-12 mx-auto max-w-md"
            />
            
            {/* 报告头部 - 增强设计 */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="bg-gradient-to-br from-[#1d1d1f] to-[#3d3d3f] dark:from-[#2d2d2f] dark:to-[#1d1d1f] rounded-3xl p-8 md:p-12 text-white mb-8 relative overflow-hidden"
            >
              {/* 装饰性背景光效 */}
              <motion.div
                className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full blur-2xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              />
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div 
                      className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <FileText className="w-6 h-6 text-white" />
                      </motion.div>
                    </motion.div>
                    <div>
                      <motion.h2 
                        className="text-2xl md:text-3xl font-semibold"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        研究报告
                      </motion.h2>
                      <motion.p 
                        className="text-white/60 text-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        AI 深度研究报告已生成（含交互式图表）
                      </motion.p>
                    </div>
                  </div>
                  
                  {/* 报告统计信息 - 添加入场动画 */}
                  <div className="flex flex-wrap gap-6 mt-6">
                    {[
                      { icon: Calendar, text: new Date().toLocaleDateString('zh-CN'), delay: 0.5 },
                      { icon: Clock, text: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }), delay: 0.6 },
                      { icon: BarChart3, text: "18 个交互式图表", delay: 0.7 },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-2 text-white/80 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: item.delay }}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* 操作按钮 - 添加悬浮动画 */}
                <motion.div 
                  className="flex gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={handleOpenReport}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      新窗口查看
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="lg" 
                      onClick={handleDownloadHtml}
                      className="bg-white text-[#1d1d1f] hover:bg-white/90 shadow-lg"
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      下载报告
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* 报告内容 iframe - 启用脚本执行以渲染 ECharts */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Card apple className="overflow-hidden shadow-2xl">
                <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden relative">
                  {/* 顶部装饰条 */}
                  <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                  <iframe
                    srcDoc={result.htmlContent}
                    className="w-full min-h-[1000px] border-0"
                    title="研究报告"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </Card>
            </motion.div>

            {/* 提示信息 - 增强样式 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center"
            >
              <motion.div 
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800"
                whileHover={{ scale: 1.02 }}
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xl"
                >
                  💡
                </motion.span>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  报告中包含 <span className="font-semibold text-blue-600 dark:text-blue-400">18 个交互式图表</span>，可在报告内滚动查看。点击"新窗口查看"获得最佳阅读体验。
                </p>
              </motion.div>
            </motion.div>
            
            {/* 底部装饰 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex justify-center mt-12"
            >
              <div className="flex items-center gap-2 text-gray-400">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                <span className="text-xs">由 Deep Research Pro 生成</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              </div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
