import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 苹果风格下划线样式 */
  apple?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, apple = false, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // 基础样式
          "flex w-full bg-transparent text-base transition-colors",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // 苹果风格
          apple
            ? "border-0 border-b-2 border-gray-200 rounded-none py-4 focus:border-[#1d1d1f] dark:border-gray-700 dark:focus:border-[#f5f5f7]"
            : "h-10 rounded-md border border-input px-3 py-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };


