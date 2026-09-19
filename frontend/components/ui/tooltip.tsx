import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cn } from "@/frontend/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipRoot = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup> {
  sideOffset?: number;
  showArrow?: boolean;
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Popup>,
  TooltipContentProps
>(({ className, sideOffset = 4, showArrow = true, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Positioner sideOffset={sideOffset} className="z-50">
      <TooltipPrimitive.Popup
        ref={ref}
        className={cn(
          "z-50 overflow-hidden rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-100 shadow-md select-none",
          "animate-in fade-in zoom-in-95 duration-150",
          className
        )}
        {...props}
      >
        {children}
        {showArrow && (
          <TooltipPrimitive.Arrow className="fill-neutral-900 stroke-neutral-800" />
        )}
      </TooltipPrimitive.Popup>
    </TooltipPrimitive.Positioner>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = "TooltipContent";

// Convenience compound component
export interface SimpleTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
  sideOffset?: number;
  className?: string;
}

function Tooltip({
  content,
  children,
  delay = 200,
  sideOffset = 4,
  className,
}: SimpleTooltipProps) {
  return (
    <TooltipProvider delay={delay}>
      <TooltipRoot>
        <TooltipTrigger render={children as any} />
        <TooltipContent sideOffset={sideOffset} className={className}>
          {content}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}

export {
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
};
