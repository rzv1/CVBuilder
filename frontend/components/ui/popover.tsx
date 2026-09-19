import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "@/frontend/lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverClose = PopoverPrimitive.Close;

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Popup> {
  sideOffset?: number;
  showArrow?: boolean;
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Popup>,
  PopoverContentProps
>(({ className, sideOffset = 4, showArrow = false, children, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Positioner sideOffset={sideOffset} className="z-50">
      <PopoverPrimitive.Popup
        ref={ref}
        className={cn(
          "z-50 w-72 rounded-xl border border-slate-800 bg-slate-900 p-4 text-slate-100 shadow-2xl backdrop-blur-xl outline-none",
          "animate-in fade-in zoom-in-95 duration-150",
          className
        )}
        {...props}
      >
        {children}
        {showArrow && (
          <PopoverPrimitive.Arrow className="fill-slate-900 stroke-slate-800" />
        )}
      </PopoverPrimitive.Popup>
    </PopoverPrimitive.Positioner>
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent, PopoverClose };
