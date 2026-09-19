import * as React from "react";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/frontend/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 disabled:pointer-events-none disabled:opacity-50 select-none [&_svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 data-[pressed]:bg-neutral-900 data-[pressed]:text-white",
        outline:
          "border border-neutral-200 bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 data-[pressed]:border-neutral-900 data-[pressed]:bg-neutral-900 data-[pressed]:text-white",
        ghost:
          "bg-transparent text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 data-[pressed]:bg-neutral-100 data-[pressed]:text-neutral-900",
      },
      size: {
        sm: "h-7 px-2 text-[11px]",
        default: "h-8 px-2.5 text-xs",
        lg: "h-9 px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive>,
    VariantProps<typeof toggleVariants> {}

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive>,
  ToggleProps
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));
Toggle.displayName = "Toggle";

export interface ToggleGroupProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive> {}

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive>,
  ToggleGroupProps
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1 rounded-lg bg-neutral-100 p-1 border border-neutral-200/80",
      className
    )}
    {...props}
  />
));
ToggleGroup.displayName = "ToggleGroup";

export { Toggle, ToggleGroup, toggleVariants };
