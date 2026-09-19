import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/frontend/lib/utils";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, indeterminate, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      indeterminate={indeterminate}
      className={cn(
        "peer inline-flex size-4.5 shrink-0 items-center justify-center rounded-md border border-neutral-300 bg-white shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-50",
        "data-[checked]:bg-neutral-900 data-[checked]:border-neutral-900 data-[checked]:text-white",
        "data-[indeterminate]:bg-neutral-900 data-[indeterminate]:border-neutral-900 data-[indeterminate]:text-white",
        "hover:border-neutral-400 data-[checked]:hover:bg-neutral-800",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {indeterminate ? (
          <Minus className="size-3 stroke-[3]" />
        ) : (
          <Check className="size-3 stroke-[3]" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };
