import * as React from "react";
import { cn } from "@/frontend/lib/utils";

export interface ShimmerTextProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  shimmerColor?: string;
  speed?: "slow" | "default" | "fast";
}

const ShimmerText = React.forwardRef<HTMLSpanElement, ShimmerTextProps>(
  ({ className, children, speed = "default", ...props }, ref) => {
    const speedClasses = {
      slow: "duration-3000",
      default: "duration-2000",
      fast: "duration-1000",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-block bg-gradient-to-r from-slate-400 via-indigo-200 to-slate-400 bg-[length:200%_100%] bg-clip-text text-transparent animate-pulse",
          speedClasses[speed],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
ShimmerText.displayName = "ShimmerText";

export interface ShimmerBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

const ShimmerBox = React.forwardRef<HTMLDivElement, ShimmerBoxProps>(
  ({ className, active = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800",
          active &&
            "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ShimmerBox.displayName = "ShimmerBox";

export interface ShimmerBorderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

const ShimmerBorder = React.forwardRef<HTMLDivElement, ShimmerBorderProps>(
  ({ className, glow = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative p-[1px] rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-500/30 via-purple-500/70 to-indigo-500/30",
          glow && "shadow-lg shadow-indigo-500/20",
          className
        )}
        {...props}
      >
        <div className="relative rounded-[calc(1rem-1px)] bg-slate-950 p-3 h-full w-full">
          {children}
        </div>
      </div>
    );
  }
);
ShimmerBorder.displayName = "ShimmerBorder";

export { ShimmerText, ShimmerBox, ShimmerBorder };
