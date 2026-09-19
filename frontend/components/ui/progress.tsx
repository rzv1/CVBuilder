import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/frontend/lib/utils";

const progressTrackVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-neutral-100 transition-all",
  {
    variants: {
      size: {
        xs: "h-1",
        sm: "h-1.5",
        default: "h-2",
        lg: "h-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressTrackVariants> {
  value?: number;
  indicatorClassName?: string;
  variant?: "default" | "credits" | "emerald" | "amber" | "rose" | "indigo";
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      size = "default",
      variant = "default",
      indicatorClassName,
      ...props
    },
    ref
  ) => {
    const safeValue = Math.min(100, Math.max(0, value));

    const getIndicatorColor = () => {
      if (indicatorClassName) return indicatorClassName;
      switch (variant) {
        case "credits":
          if (safeValue > 50) return "bg-neutral-900";
          if (safeValue > 20) return "bg-amber-500";
          return "bg-rose-500";
        case "emerald":
          return "bg-emerald-600";
        case "amber":
          return "bg-amber-500";
        case "rose":
          return "bg-rose-600";
        case "indigo":
          return "bg-neutral-900";
        default:
          return "bg-neutral-900";
      }
    };

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(progressTrackVariants({ size }), className)}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full flex-1 rounded-full transition-all duration-500 ease-in-out",
            getIndicatorColor()
          )}
          style={{ transform: `translateX(-${100 - safeValue}%)` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
