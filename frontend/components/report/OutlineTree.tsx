"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  List, 
  ChevronRight, 
  ChevronDown, 
  X,
  Menu
} from "lucide-react";

interface OutlineItem {
  id: string;
  text: string;
  level: number;
  children?: OutlineItem[];
}

interface OutlineTreeProps {
  /** iframe 引用 */
  iframeRef: React.RefObject<HTMLIFrameElement>;
  /** 是否默认展开 */
  defaultOpen?: boolean;
}

/**
 * 从 HTML 内容提取大纲
 */
function extractOutline(doc: Document): OutlineItem[] {
  const headings = doc.querySelectorAll("h1, h2, h3");
  const outline: OutlineItem[] = [];
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1));
    const text = heading.textContent?.trim() || `章节 ${index + 1}`;
    const id = heading.id || `heading-${index}`;
    
    // 如果没有 ID，为其设置一个
    if (!heading.id) {
      heading.id = id;
    }
    
    outline.push({
      id,
      text,
      level,
    });
  });
  
  return outline;
}

/**
 * 报告大纲导航组件
 */
export function OutlineTree({ iframeRef, defaultOpen = false }: OutlineTreeProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // 提取大纲
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          const extractedOutline = extractOutline(iframeDoc);
          setOutline(extractedOutline);
          if (extractedOutline.length > 0) {
            setActiveId(extractedOutline[0].id);
          }
        }
      } catch (err) {
        console.error("无法访问 iframe 内容:", err);
      }
    };

    // 监听 iframe 加载完成
    iframe.addEventListener("load", handleLoad);
    
    // 如果已经加载，直接提取
    if (iframe.contentDocument?.readyState === "complete") {
      handleLoad();
    }

    return () => {
      iframe.removeEventListener("load", handleLoad);
    };
  }, [iframeRef]);

  // 滚动到指定元素
  const scrollToElement = useCallback((id: string) => {
    try {
      const iframe = iframeRef.current;
      const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
      const element = iframeDoc?.getElementById(id);
      
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveId(id);
      }
    } catch (err) {
      console.error("滚动失败:", err);
    }
  }, [iframeRef]);

  // 获取标题样式
  const getItemStyle = (level: number) => {
    switch (level) {
      case 1:
        return "font-semibold text-gray-900 dark:text-white";
      case 2:
        return "font-medium text-gray-700 dark:text-gray-300 pl-3";
      case 3:
        return "text-gray-500 dark:text-gray-400 pl-6 text-sm";
      default:
        return "text-gray-500 pl-9 text-sm";
    }
  };

  if (outline.length === 0) {
    return null;
  }

  return (
    <>
      {/* 浮动触发按钮 */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
        title={isOpen ? "关闭目录" : "打开目录"}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        )}
      </motion.button>

      {/* 目录面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -280 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-16 top-1/2 -translate-y-1/2 z-30 w-72 max-h-[70vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* 头部 */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-2">
                <List className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">报告目录</h3>
                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full ml-auto">
                  {outline.length} 项
                </span>
              </div>
            </div>

            {/* 目录列表 */}
            <div className="p-2 max-h-[calc(70vh-60px)] overflow-y-auto">
              {outline.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => scrollToElement(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-all ${
                    activeId === item.id
                      ? "bg-blue-50 dark:bg-blue-900/30 border-l-2 border-blue-500"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  } ${getItemStyle(item.level)}`}
                >
                  <span className="line-clamp-2">{item.text}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}



