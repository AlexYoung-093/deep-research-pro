import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // 苹果风格主按钮
        default:
          "bg-[#1d1d1f] text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] dark:bg-[#f5f5f7] dark:text-[#1d1d1f]",
        // 次要按钮
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // 边框按钮
        outline:
          "border-2 border-[#1d1d1f] text-[#1d1d1f] bg-transparent hover:bg-[#1d1d1f] hover:text-white dark:border-[#f5f5f7] dark:text-[#f5f5f7] dark:hover:bg-[#f5f5f7] dark:hover:text-[#1d1d1f]",
        // 危险按钮
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // 幽灵按钮
        ghost: "hover:bg-accent hover:text-accent-foreground",
        // 链接样式
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-sm",
        lg: "h-14 px-8 text-lg rounded-full",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

