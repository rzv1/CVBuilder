import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/frontend/lib/utils";

const labelVariants = cva(
  "text-xs font-semibold leading-none text-slate-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none",
  {
    variants: {
      size: {
        sm: "text-[11px]",
        default: "text-xs",
        lg: "text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  description?: string;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, size, required, description, children, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <label
        ref={ref}
        className={cn(labelVariants({ size, className }))}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-red-400 font-bold">*</span>}
      </label>
      {description && (
        <span className="text-[11px] text-slate-400 leading-normal">
          {description}
        </span>
      )}
    </div>
  )
);
Label.displayName = "Label";

export { Label, labelVariants };
