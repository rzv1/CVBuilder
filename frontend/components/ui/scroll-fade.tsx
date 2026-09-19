import * as React from "react";
import { cn } from "@/frontend/lib/utils";

export interface ScrollFadeProps extends React.HTMLAttributes<HTMLDivElement> {
  fadeSize?: "sm" | "md" | "lg";
  orientation?: "vertical" | "horizontal";
  showFadeTop?: boolean;
  showFadeBottom?: boolean;
}

const ScrollFade = React.forwardRef<HTMLDivElement, ScrollFadeProps>(
  (
    {
      className,
      children,
      fadeSize = "md",
      orientation = "vertical",
      showFadeTop = true,
      showFadeBottom = true,
      ...props
    },
    ref
  ) => {
    const internalRef = React.useRef<HTMLDivElement | null>(null);
    const [canScrollTop, setCanScrollTop] = React.useState(false);
    const [canScrollBottom, setCanScrollBottom] = React.useState(false);

    const setMergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref]
    );

    const checkScroll = React.useCallback(() => {
      const el = internalRef.current;
      if (!el) return;

      if (orientation === "vertical") {
        setCanScrollTop(el.scrollTop > 5);
        setCanScrollBottom(
          el.scrollHeight - el.scrollTop - el.clientHeight > 5
        );
      } else {
        setCanScrollTop(el.scrollLeft > 5);
        setCanScrollBottom(
          el.scrollWidth - el.scrollLeft - el.clientWidth > 5
        );
      }
    }, [orientation]);

    React.useEffect(() => {
      checkScroll();
      window.addEventListener("resize", checkScroll);
      return () => window.removeEventListener("resize", checkScroll);
    }, [children, checkScroll]);

    const sizeClasses = {
      sm: orientation === "vertical" ? "h-6" : "w-6",
      md: orientation === "vertical" ? "h-10" : "w-10",
      lg: orientation === "vertical" ? "h-16" : "w-16",
    };

    return (
      <div className="relative size-full overflow-hidden">
        {/* Top / Left Fade */}
        {showFadeTop && canScrollTop && (
          <div
            className={cn(
              "pointer-events-none absolute z-10 transition-opacity duration-200",
              orientation === "vertical"
                ? `top-0 inset-x-0 bg-gradient-to-b from-slate-950/90 to-transparent ${sizeClasses[fadeSize]}`
                : `left-0 inset-y-0 bg-gradient-to-r from-slate-950/90 to-transparent ${sizeClasses[fadeSize]}`
            )}
          />
        )}

        {/* Scrollable Container */}
        <div
          ref={setMergedRef}
          onScroll={checkScroll}
          className={cn("size-full overflow-auto scroll-smooth", className)}
          {...props}
        >
          {children}
        </div>

        {/* Bottom / Right Fade */}
        {showFadeBottom && canScrollBottom && (
          <div
            className={cn(
              "pointer-events-none absolute z-10 transition-opacity duration-200",
              orientation === "vertical"
                ? `bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 to-transparent ${sizeClasses[fadeSize]}`
                : `right-0 inset-y-0 bg-gradient-to-l from-slate-950/90 to-transparent ${sizeClasses[fadeSize]}`
            )}
          />
        )}
      </div>
    );
  }
);
ScrollFade.displayName = "ScrollFade";

export { ScrollFade };
