import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/frontend/lib/utils";

export interface MessageScrollerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  autoScroll?: boolean;
  unreadCount?: number;
  onScrollToBottom?: () => void;
  showScrollFade?: boolean;
}

const MessageScroller = React.forwardRef<HTMLDivElement, MessageScrollerProps>(
  (
    {
      className,
      children,
      autoScroll = true,
      unreadCount = 0,
      onScrollToBottom,
      showScrollFade = true,
      ...props
    },
    ref
  ) => {
    const internalContainerRef = React.useRef<HTMLDivElement | null>(null);
    const [isAtBottom, setIsAtBottom] = React.useState(true);
    const [isAtTop, setIsAtTop] = React.useState(true);
    const bottomMarkerRef = React.useRef<HTMLDivElement | null>(null);

    // Merge forwarded ref with internal ref
    const setRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        internalContainerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref]
    );

    const scrollToBottom = React.useCallback(() => {
      if (internalContainerRef.current) {
        internalContainerRef.current.scrollTo({
          top: internalContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
      onScrollToBottom?.();
    }, [onScrollToBottom]);

    const handleScroll = React.useCallback(() => {
      const container = internalContainerRef.current;
      if (!container) return;

      setIsAtTop(container.scrollTop <= 5);

      const threshold = 60;
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      const atBottom = distanceFromBottom <= threshold;
      setIsAtBottom(atBottom);
    }, []);

    // Auto-scroll when children change and user is at bottom
    React.useEffect(() => {
      if (autoScroll && isAtBottom) {
        scrollToBottom();
      }
    }, [children, autoScroll, isAtBottom, scrollToBottom]);

    const getMaskStyle = () => {
      if (!showScrollFade) return undefined;
      const hasTopFade = !isAtTop;
      const hasBottomFade = !isAtBottom;
      if (hasTopFade && hasBottomFade) {
        return "linear-gradient(to bottom, transparent, black 1.25rem, black calc(100% - 1.25rem), transparent)";
      }
      if (hasTopFade) {
        return "linear-gradient(to bottom, transparent, black 1.25rem, black 100%)";
      }
      if (hasBottomFade) {
        return "linear-gradient(to bottom, black 0%, black calc(100% - 1.25rem), transparent)";
      }
      return undefined;
    };

    const maskStyle = getMaskStyle();

    return (
      <div className="relative flex-1 min-h-0 w-full overflow-hidden">
        <div
          ref={setRef}
          onScroll={handleScroll}
          style={
            maskStyle
              ? {
                  WebkitMaskImage: maskStyle,
                  maskImage: maskStyle,
                }
              : undefined
          }
          className={cn(
            "h-full w-full overflow-y-auto overscroll-contain p-4 space-y-4 scroll-smooth",
            className
          )}
          {...props}
        >
          {children}
          <div ref={bottomMarkerRef} className="h-px w-full" />
        </div>

        {/* Floating Scroll to Bottom Button */}
        {!isAtBottom && (
          <button
            type="button"
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
            className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 rounded-full bg-indigo-600/90 hover:bg-indigo-600 text-white px-3 py-1.5 text-xs font-semibold shadow-lg shadow-indigo-950/60 border border-indigo-400/30 backdrop-blur-xs transition-all hover:scale-105 active:scale-95 animate-in fade-in zoom-in-95 duration-200"
          >
            <ChevronDown className="size-4 animate-bounce" />
            <span>Jos</span>
            {unreadCount > 0 && (
              <span className="flex size-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </div>
    );
  }
);
MessageScroller.displayName = "MessageScroller";

export { MessageScroller };
