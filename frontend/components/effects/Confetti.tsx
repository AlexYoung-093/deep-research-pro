"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  shape: "rect" | "circle" | "star" | "ribbon";
  delay: number;
  duration: number;
  swayDirection: number;
}

interface ConfettiProps {
  /** 是否激活彩带效果 */
  active: boolean;
  /** 彩带数量 */
  count?: number;
  /** 持续时间（毫秒） */
  duration?: number;
  /** 自定义颜色数组 */
  colors?: string[];
}

// 苹果风格的彩带颜色
const DEFAULT_COLORS = [
  "#007AFF", // 蓝色
  "#34C759", // 绿色
  "#FF9F0A", // 橙色
  "#FF3B30", // 红色
  "#5856D6", // 紫色
  "#00C7BE", // 青色
  "#FF2D55", // 粉红
  "#AF52DE", // 浅紫
  "#FFD60A", // 黄色
  "#32D74B", // 亮绿
];

// 彩带形状组件
const ConfettiShape = ({ shape, color }: { shape: string; color: string }) => {
  switch (shape) {
    case "rect":
      return (
        <div
          className="w-3 h-6 rounded-sm"
          style={{ backgroundColor: color }}
        />
      );
    case "circle":
      return (
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: color }}
        />
      );
    case "star":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill={color}>
          <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
        </svg>
      );
    case "ribbon":
      return (
        <div
          className="w-2 h-8 rounded-full"
          style={{ 
            backgroundColor: color,
            transform: "rotate(15deg)",
          }}
        />
      );
    default:
      return (
        <div
          className="w-3 h-5 rounded-sm"
          style={{ backgroundColor: color }}
        />
      );
  }
};

export function Confetti({
  active,
  count = 150,
  duration = 5000,
  colors = DEFAULT_COLORS,
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const generatePieces = useCallback(() => {
    const shapes: Array<"rect" | "circle" | "star" | "ribbon"> = [
      "rect",
      "circle",
      "star",
      "ribbon",
    ];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // 起始 x 位置 (vw)
      y: -10 - Math.random() * 20, // 起始 y 位置 (从屏幕上方开始)
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      delay: Math.random() * 1.5, // 延迟 0-1.5 秒
      duration: 3 + Math.random() * 2, // 持续 3-5 秒
      swayDirection: Math.random() > 0.5 ? 1 : -1,
    }));
  }, [count, colors]);

  useEffect(() => {
    if (active) {
      setIsVisible(true);
      setPieces(generatePieces());
      
      // 在指定时间后隐藏
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [active, duration, generatePieces]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.x}vw`,
                y: `${piece.y}vh`,
                rotate: piece.rotation,
                scale: piece.scale,
                opacity: 1,
              }}
              animate={{
                y: "120vh",
                rotate: piece.rotation + 720 * piece.swayDirection,
                x: [
                  `${piece.x}vw`,
                  `${piece.x + 10 * piece.swayDirection}vw`,
                  `${piece.x - 5 * piece.swayDirection}vw`,
                  `${piece.x + 8 * piece.swayDirection}vw`,
                  `${piece.x}vw`,
                ],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
                x: {
                  duration: piece.duration,
                  delay: piece.delay,
                  repeat: 0,
                  ease: "easeInOut",
                },
              }}
              className="absolute"
              style={{ 
                filter: `brightness(${0.9 + Math.random() * 0.2})`,
              }}
            >
              <ConfettiShape shape={piece.shape} color={piece.color} />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// 导出一个更炫酷的爆炸式彩带效果
export function ConfettiBurst({
  active,
  count = 100,
  duration = 4000,
  colors = DEFAULT_COLORS,
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const generateBurstPieces = useCallback(() => {
    const shapes: Array<"rect" | "circle" | "star" | "ribbon"> = [
      "rect",
      "circle",
      "star",
      "ribbon",
    ];
    
    // 从屏幕中心向外爆炸
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const distance = 30 + Math.random() * 50; // 爆炸距离
      
      return {
        id: i,
        x: 50, // 从中心开始
        y: 40,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        delay: Math.random() * 0.3,
        duration: 2 + Math.random() * 2,
        swayDirection: Math.cos(angle) * distance,
        // 存储角度用于爆炸方向
        endX: 50 + Math.cos(angle) * distance,
        endY: 40 + Math.sin(angle) * distance * 0.6,
      };
    });
  }, [count, colors]);

  useEffect(() => {
    if (active) {
      setIsVisible(true);
      setPieces(generateBurstPieces() as any);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [active, duration, generateBurstPieces]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {pieces.map((piece: any) => (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.x}vw`,
                y: `${piece.y}vh`,
                rotate: 0,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                x: [`${piece.x}vw`, `${piece.endX}vw`, `${piece.endX}vw`],
                y: [`${piece.y}vh`, `${piece.endY}vh`, "120vh"],
                rotate: piece.rotation + 720,
                scale: [0, piece.scale, piece.scale, 0],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
                times: [0, 0.3, 0.7, 1],
              }}
              className="absolute"
            >
              <ConfettiShape shape={piece.shape} color={piece.color} />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

