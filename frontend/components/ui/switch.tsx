import * as React from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/frontend/lib/utils";

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-4 w-7",
        default: "h-5 w-9",
        lg: "h-6 w-11",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const thumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-xs ring-0 transition-transform",
  {
    variants: {
      size: {
        sm: "size-3 data-[checked]:translate-x-3",
        default: "size-4 data-[checked]:translate-x-4",
        lg: "size-5 data-[checked]:translate-x-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size, label, description, ...props }, ref) => {
  const switchElement = (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        switchVariants({ size, className }),
        "bg-neutral-200 data-[checked]:bg-neutral-900 hover:bg-neutral-300/80 data-[checked]:hover:bg-neutral-800"
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className={cn(thumbVariants({ size }))} />
    </SwitchPrimitive.Root>
  );

  if (!label && !description) {
    return switchElement;
  }

  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      {switchElement}
      <div className="flex flex-col leading-tight">
        {label && (
          <span className="text-xs font-medium text-neutral-900">{label}</span>
        )}
        {description && (
          <span className="text-[11px] text-neutral-500">{description}</span>
        )}
      </div>
    </label>
  );
});
Switch.displayName = "Switch";

export { Switch, switchVariants };
