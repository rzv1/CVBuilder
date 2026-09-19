import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/frontend/lib/utils";

const kbdVariants = cva(
  "inline-flex items-center justify-center font-mono font-medium select-none shadow-xs transition-colors",
  {
    variants: {
      variant: {
        default:
          "border border-slate-700/80 bg-slate-800/90 text-slate-300 shadow-slate-950/50",
        outline:
          "border border-slate-700 bg-transparent text-slate-400",
        solid:
          "border-transparent bg-slate-700 text-slate-100",
        subtle:
          "border-transparent bg-slate-900/60 text-slate-400",
      },
      size: {
        xs: "h-4.5 min-w-4.5 px-1 text-[10px] rounded",
        sm: "h-5.5 min-w-5.5 px-1.5 text-[11px] rounded-md",
        default: "h-6 min-w-6 px-1.5 text-xs rounded-md",
        lg: "h-7 min-w-7 px-2 text-sm rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(kbdVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Kbd.displayName = "Kbd";

export interface KbdGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  separator?: React.ReactNode;
}

const KbdGroup = React.forwardRef<HTMLDivElement, KbdGroupProps>(
  ({ className, separator = "+", children, ...props }, ref) => {
    const items = React.Children.toArray(children);
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-1 text-slate-400 text-xs", className)}
        {...props}
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item}
            {index < items.length - 1 && separator && (
              <span className="text-[10px] text-slate-500 font-mono px-0.5">
                {separator}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }
);
KbdGroup.displayName = "KbdGroup";

export { Kbd, KbdGroup, kbdVariants };
