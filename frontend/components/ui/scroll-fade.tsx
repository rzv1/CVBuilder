import * as React from "react";
import { cn } from "@/lib/utils";

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

    const getMaskStyle = () => {
      if (orientation !== "vertical") return undefined;
      if (canScrollTop && canScrollBottom) {
        return "linear-gradient(to bottom, transparent, black 1.25rem, black calc(100% - 1.25rem), transparent)";
      }
      if (canScrollTop) {
        return "linear-gradient(to bottom, transparent, black 1.25rem, black 100%)";
      }
      if (canScrollBottom) {
        return "linear-gradient(to bottom, black 0%, black calc(100% - 1.25rem), transparent)";
      }
      return undefined;
    };

    const maskStyle = getMaskStyle();

    return (
      <div className="relative size-full overflow-hidden flex flex-col flex-1 min-h-0">
        {/* Scrollable Container */}
        <div
          ref={setMergedRef}
          onScroll={checkScroll}
          style={
            maskStyle
              ? {
                  WebkitMaskImage: maskStyle,
                  maskImage: maskStyle,
                }
              : undefined
          }
          className={cn("size-full overflow-auto scroll-smooth", className)}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);
ScrollFade.displayName = "ScrollFade";

export { ScrollFade };
