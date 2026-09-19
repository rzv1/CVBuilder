import * as React from "react";
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { cn } from "@/frontend/lib/utils";

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive> {
  label?: React.ReactNode;
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive>,
  SeparatorProps
>(
  (
    {
      className,
      orientation = "horizontal",
      label,
      children,
      ...props
    },
    ref
  ) => {
    const content = label || children;

    if (content && orientation === "horizontal") {
      return (
        <div className={cn("relative flex w-full items-center my-3", className)}>
          <div className="flex-grow border-t border-neutral-200" />
          <span className="shrink-0 px-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 select-none">
            {content}
          </span>
          <div className="flex-grow border-t border-neutral-200" />
        </div>
      );
    }

    return (
      <SeparatorPrimitive
        ref={ref}
        orientation={orientation}
        className={cn(
          "shrink-0 bg-neutral-200",
          orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
          className
        )}
        {...props}
      />
    );
  }
);
Separator.displayName = "Separator";

export { Separator };
