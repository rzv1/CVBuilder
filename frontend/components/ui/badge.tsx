import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/frontend/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neutral-900 text-neutral-50 shadow-2xs",
        secondary:
          "border-neutral-200/80 bg-neutral-100 text-neutral-700 hover:bg-neutral-200/60",
        destructive:
          "border-red-200/80 bg-red-50 text-red-700",
        warning:
          "border-amber-200/80 bg-amber-50 text-amber-800",
        success:
          "border-emerald-200/80 bg-emerald-50 text-emerald-700",
        blue:
          "border-blue-200/80 bg-blue-50 text-blue-700",
        purple:
          "border-slate-200 bg-slate-100 text-slate-700",
        outline: "text-neutral-700 border-neutral-200 bg-white/80",
        format: "text-[10px] text-neutral-600 border-neutral-200 bg-neutral-50 font-mono",
      },
      size: {
        xs: "text-[10px] px-1.5 py-0.2 gap-1",
        sm: "text-xs px-2 py-0.5 gap-1",
        default: "text-xs px-2.5 py-0.5 gap-1.5",
        lg: "text-sm px-3 py-1 gap-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  onRemove?: () => void;
}

function Badge({
  className,
  variant,
  size,
  dot,
  onRemove,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span className="size-1.5 rounded-full bg-current opacity-80 shrink-0" />
      )}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded-full p-0.5 hover:bg-black/20 text-current transition-colors focus:outline-none"
          aria-label="Remove badge"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );
}

export { Badge, badgeVariants };
