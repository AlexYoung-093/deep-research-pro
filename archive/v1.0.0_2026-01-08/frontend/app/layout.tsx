import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Deep Research Pro - 深度研究报告生成器",
  description: "基于 AI 的深度研究报告生成工具，支持实时进度展示和数据可视化",
  keywords: ["AI研究", "深度报告", "研究工具", "数据分析"],
  authors: [{ name: "Deep Research Pro Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* 主布局结构 */}
          <div className="relative flex min-h-screen flex-col">
            {/* 顶部导航 */}
            <Header />
            
            {/* 主内容区 */}
            <main className="flex-1">
              {children}
            </main>
            
            {/* 底部信息 */}
            <Footer />
          </div>
          
          {/* Toast 通知 */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

