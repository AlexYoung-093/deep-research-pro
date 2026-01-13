import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 苹果风格配色方案
      colors: {
        // 主色调 - 中性色
        primary: {
          DEFAULT: "#1d1d1f",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#86868b",
          foreground: "#1d1d1f",
        },
        // 背景色
        background: {
          DEFAULT: "#ffffff",
          secondary: "#fbfbfd",
          tertiary: "#f5f5f7",
        },
        // 边框色
        border: {
          DEFAULT: "#d2d2d7",
          light: "#e8e8ed",
        },
        // 文字色
        foreground: {
          DEFAULT: "#1d1d1f",
          secondary: "#86868b",
          tertiary: "#aeaeb2",
        },
        // 强调色（谨慎使用）
        accent: {
          DEFAULT: "#0071e3",
          blue: "#007aff",
          green: "#34c759",
          orange: "#ff9f0a",
          red: "#ff3b30",
        },
        // Shadcn/ui 兼容色
        muted: {
          DEFAULT: "#f5f5f7",
          foreground: "#86868b",
        },
        destructive: {
          DEFAULT: "#ff3b30",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1d1d1f",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#1d1d1f",
        },
        input: "#d2d2d7",
        ring: "#1d1d1f",
      },
      // 字体
      fontFamily: {
        sans: [
          "SF Pro Display",
          "SF Pro Text",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      // 字体大小
      fontSize: {
        display: ["80px", { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "600" }],
        headline: ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        title: ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
        callout: ["21px", { lineHeight: "1.4", fontWeight: "400" }],
        body: ["17px", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "1.4", fontWeight: "400" }],
      },
      // 圆角
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
        full: "9999px",
      },
      // 阴影
      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.06)",
        medium: "0 8px 30px rgba(0,0,0,0.08)",
        strong: "0 12px 40px rgba(0,0,0,0.12)",
      },
      // 动画
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "fade-out": "fade-out 0.5s ease-out",
        "slide-up": "slide-up 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        pulse: "pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

