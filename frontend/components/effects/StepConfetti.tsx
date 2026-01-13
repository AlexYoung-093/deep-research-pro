"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StepConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  delay: number;
  shape: "rect" | "circle";
}

interface StepConfettiProps {
  /** 是否激活 */
  active: boolean;
  /** 彩带数量 */
  count?: number;
  /** 持续时间（毫秒） */
  duration?: number;
  /** 颜色数组 */
  colors?: string[];
}

const DEFAULT_COLORS = [
  "#007AFF", // 蓝色
  "#34C759", // 绿色
  "#FF9F0A", // 橙色
  "#FF3B30", // 红色
  "#5856D6", // 紫色
  "#AF52DE", // 粉紫
  "#00C7BE", // 青色
];

/**
 * 步骤完成时的小彩带效果
 * 比最终完成时的彩带更小、更快、数量更少
 */
export function StepConfetti({
  active,
  count = 30,
  duration = 2000,
  colors = DEFAULT_COLORS,
}: StepConfettiProps) {
  const [pieces, setPieces] = useState<StepConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const generatePieces = useCallback(() => {
    const shapes: Array<"rect" | "circle"> = ["rect", "circle"];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60, // 从屏幕中间区域散开
      y: 10 + Math.random() * 20,
      rotation: Math.random() * 360,
      scale: 0.4 + Math.random() * 0.6,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      delay: Math.random() * 0.3,
    }));
  }, [count, colors]);

  useEffect(() => {
    if (active) {
      setIsVisible(true);
      setPieces(generatePieces());

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
                scale: 0,
                opacity: 0,
              }}
              animate={{
                y: [`${piece.y}vh`, `${piece.y + 80}vh`],
                x: [
                  `${piece.x}vw`,
                  `${piece.x + (Math.random() - 0.5) * 30}vw`,
                ],
                rotate: piece.rotation + 360 * (Math.random() > 0.5 ? 1 : -1),
                scale: [0, piece.scale, piece.scale * 0.5],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: duration / 1000,
                delay: piece.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute"
            >
              {piece.shape === "rect" ? (
                <div
                  className="w-3 h-2 rounded-sm"
                  style={{ backgroundColor: piece.color }}
                />
              ) : (
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: piece.color }}
                />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

