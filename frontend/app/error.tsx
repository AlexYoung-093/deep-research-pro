"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 记录错误到控制台或错误追踪服务
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="container-apple section-spacing">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center text-center"
      >
        {/* 错误图标 */}
        <div className="w-20 h-20 rounded-full bg-accent-red/10 flex items-center justify-center mb-8">
          <AlertTriangle className="w-10 h-10 text-accent-red" />
        </div>

        {/* 错误信息 */}
        <h1 className="text-title mb-4">出现了一些问题</h1>
        <p className="text-body text-foreground-secondary max-w-md mb-8">
          {error.message || "抱歉，应用程序遇到了意外错误。请尝试刷新页面。"}
        </p>

        {/* 错误摘要 (仅开发环境) */}
        {process.env.NODE_ENV === "development" && error.digest && (
          <p className="text-caption text-foreground-tertiary mb-8">
            Error Digest: {error.digest}
          </p>
        )}

        {/* 重试按钮 */}
        <Button
          onClick={reset}
          className="btn-apple-primary inline-flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          重试
        </Button>
      </motion.div>
    </div>
  );
}


