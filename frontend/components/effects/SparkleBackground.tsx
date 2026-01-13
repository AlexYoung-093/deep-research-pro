"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface SparkleBackgroundProps {
  /** 闪光点数量 */
  count?: number;
  /** 是否激活 */
  active?: boolean;
}

export function SparkleBackground({ count = 30, active = true }: SparkleBackgroundProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (!active) {
      setSparkles([]);
      return;
    }

    const generateSparkles = () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 5,
      }));

    setSparkles(generateSparkles());

    // 每隔一段时间重新生成位置
    const interval = setInterval(() => {
      setSparkles(generateSparkles());
    }, 8000);

    return () => clearInterval(interval);
  }, [count, active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/30"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// 浮动光晕效果 - 调整为更淡雅的效果
export function FloatingOrbs({ active = true }: { active?: boolean }) {
  if (!active) return null;

  const orbs = [
    { color: "from-sky-300/5 to-cyan-300/5", size: 250, x: 10, y: 20, duration: 25 },
    { color: "from-rose-300/5 to-pink-300/5", size: 200, x: 80, y: 60, duration: 30 },
    { color: "from-amber-300/5 to-orange-300/5", size: 180, x: 30, y: 80, duration: 22 },
    { color: "from-violet-300/5 to-purple-300/5", size: 220, x: 70, y: 10, duration: 28 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${orb.color} blur-3xl`}
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
          }}
          animate={{
            x: [0, 50, -30, 20, 0],
            y: [0, -30, 40, -20, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// 成功状态的光芒效果
export function SuccessGlow({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[9998]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 中心光晕 */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(52,199,89,0.2) 0%, transparent 70%)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2, 2.5], opacity: [0, 0.5, 0] }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      
      {/* 波纹效果 */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-green-500/30"
          initial={{ width: 100, height: 100, opacity: 0 }}
          animate={{ 
            width: [100, 800], 
            height: [100, 800], 
            opacity: [0.6, 0] 
          }}
          transition={{ 
            duration: 2, 
            delay: i * 0.3, 
            ease: "easeOut" 
          }}
        />
      ))}
    </motion.div>
  );
}

