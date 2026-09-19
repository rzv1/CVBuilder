import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@/frontend/lib/utils";

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label?: string;
  showValue?: boolean;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, label, showValue, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full flex-col gap-2 select-none touch-none", className)}
    {...props}
  >
    {(label || showValue) && (
      <div className="flex items-center justify-between text-xs">
        {label && <SliderPrimitive.Label className="font-semibold text-slate-300">{label}</SliderPrimitive.Label>}
        {showValue && <SliderPrimitive.Value className="font-mono text-[11px] text-slate-400" />}
      </div>
    )}
    <SliderPrimitive.Control className="relative flex w-full items-center">
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-slate-800">
        <SliderPrimitive.Indicator className="h-full bg-indigo-600 rounded-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-4 rounded-full border-2 border-indigo-600 bg-white shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing hover:scale-110" />
    </SliderPrimitive.Control>
  </SliderPrimitive.Root>
));
Slider.displayName = "Slider";

export { Slider };
