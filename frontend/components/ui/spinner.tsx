import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/frontend/lib/utils";

const spinnerVariants = cva("animate-spin shrink-0 select-none", {
  variants: {
    size: {
      xs: "size-3.5",
      sm: "size-4",
      default: "size-5",
      lg: "size-7",
      xl: "size-9",
    },
    variant: {
      default: "text-slate-400",
      indigo: "text-indigo-500",
      white: "text-white",
      emerald: "text-emerald-500",
      current: "text-current",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

export interface SpinnerProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size, variant, label = "Se încarcă...", ...props }, ref) => {
    return (
      <svg
        ref={ref}
        role="status"
        aria-label={label}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(spinnerVariants({ size, variant, className }))}
        {...props}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          className="opacity-20"
        />
        <path
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          fill="currentColor"
        />
        <span className="sr-only">{label}</span>
      </svg>
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
