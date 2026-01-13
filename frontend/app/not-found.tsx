import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-apple section-spacing">
      <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
        {/* 404 数字 */}
        <h1 className="text-display text-foreground-tertiary mb-4">404</h1>

        {/* 提示信息 */}
        <h2 className="text-title mb-4">页面未找到</h2>
        <p className="text-body text-foreground-secondary max-w-md mb-8">
          您访问的页面不存在或已被移动。请返回首页继续浏览。
        </p>

        {/* 返回首页按钮 */}
        <Link href="/">
          <Button className="btn-apple-primary inline-flex items-center gap-2">
            <Home className="w-5 h-5" />
            返回首页
          </Button>
        </Link>
      </div>
    </div>
  );
}


