import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container-apple py-8 md:py-12">
        {/* 主要内容 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 关于 */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              关于项目
            </h3>
            <p className="text-sm text-foreground-secondary leading-relaxed">
              Deep Research Pro 是一个基于 AI 的深度研究报告生成工具，
              能够自动搜索多个数据源，生成专业的行业分析和竞品调研报告。
            </p>
          </div>

          {/* 技术栈 */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              技术栈
            </h3>
            <ul className="space-y-2 text-sm text-foreground-secondary">
              <li>Next.js 14 (App Router)</li>
              <li>Tailwind CSS + Shadcn/ui</li>
              <li>Dify Workflow API</li>
              <li>ECharts 5.x</li>
            </ul>
          </div>

          {/* 链接 */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              相关链接
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://docs.dify.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground-secondary hover:text-foreground transition-colors"
                >
                  Dify 文档
                </a>
              </li>
              <li>
                <a
                  href="https://nextjs.org/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground-secondary hover:text-foreground transition-colors"
                >
                  Next.js 文档
                </a>
              </li>
              <li>
                <a
                  href="https://ui.shadcn.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground-secondary hover:text-foreground transition-colors"
                >
                  Shadcn/ui
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* 版权信息 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-foreground-secondary">
          <p>© {currentYear} Deep Research Pro. All rights reserved.</p>
          <p>
            Powered by{" "}
            <a
              href="https://dify.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              Dify
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

