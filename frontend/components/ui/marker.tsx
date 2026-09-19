import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/frontend/lib/utils";

const markerVariants = cva(
  "inline-flex shrink-0 items-center justify-center transition-all",
  {
    variants: {
      variant: {
        ai: "bg-neutral-900 text-white",
        online: "bg-emerald-500 text-white shadow-2xs",
        success: "bg-emerald-500 text-white",
        warning: "bg-amber-500 text-white",
        error: "bg-rose-500 text-white",
        offline: "bg-neutral-400 text-white",
        neutral: "bg-neutral-500 text-white",
        blue: "bg-blue-600 text-white shadow-2xs",
      },
      shape: {
        dot: "rounded-full",
        pill: "rounded-full px-2 py-0.5 font-medium",
        ring: "rounded-full ring-2 ring-white",
        square: "rounded-md",
      },
      size: {
        xs: "size-1.5",
        sm: "size-2",
        default: "size-2.5",
        md: "size-3",
        lg: "size-3.5",
      },
      pulse: {
        true: "relative after:absolute after:inset-0 after:rounded-full after:animate-ping after:bg-inherit after:opacity-75",
        false: "",
      },
    },
    compoundVariants: [
      {
        shape: "pill",
        size: "default",
        className: "h-auto w-auto text-[10px]",
      },
    ],
    defaultVariants: {
      variant: "neutral",
      shape: "dot",
      size: "default",
      pulse: false,
    },
  }
);

export interface MarkerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof markerVariants> {
  label?: React.ReactNode;
}

const Marker = React.forwardRef<HTMLSpanElement, MarkerProps>(
  ({ className, variant, shape, size, pulse, label, children, ...props }, ref) => {
    const dotNode = (
      <span
        ref={ref}
        className={cn(markerVariants({ variant, shape, size, pulse, className }))}
        {...props}
      >
        {children}
      </span>
    );

    if (!label) return dotNode;

    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600">
        {dotNode}
        <span>{label}</span>
      </span>
    );
  }
);
Marker.displayName = "Marker";

export { Marker, markerVariants };
