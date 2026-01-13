import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-apple section-spacing">
      {/* Hero 骨架 */}
      <div className="text-center mb-16 md:mb-24 space-y-6">
        <Skeleton className="h-16 md:h-20 w-3/4 mx-auto" />
        <Skeleton className="h-8 w-1/2 mx-auto" />
      </div>

      {/* 两栏骨架 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* 左侧表单骨架 */}
        <div className="space-y-8">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-14 w-48 rounded-full" />
        </div>

        {/* 右侧进度骨架 */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}


