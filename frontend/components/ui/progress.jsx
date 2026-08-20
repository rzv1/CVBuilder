import * as React from "react"
import { cn } from "@/frontend/lib/utils"

const Progress = React.forwardRef(({ className, value = 0, indicatorClassName, ...props }, ref) => {
  const safeValue = Math.min(100, Math.max(0, value))
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-slate-800",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full w-full flex-1 transition-all duration-300 ease-in-out",
          indicatorClassName || "bg-gradient-to-r from-emerald-500 to-indigo-500"
        )}
        style={{ transform: `translateX(-${100 - safeValue}%)` }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }
