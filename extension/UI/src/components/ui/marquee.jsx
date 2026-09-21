"use client";;
import {
  Marquee as MarqueePrimitive,
  useMarquee,
  useMarqueeContext,
} from "@ark-ui/react/marquee";

import { cn } from "@/lib/utils";

export const Marquee = ({
  className,
  ...props
}) => (
  <MarqueePrimitive.Root
    className={cn(
      "w-full max-w-full text-foreground",
      "data-[orientation=horizontal]:h-20 data-[orientation=vertical]:h-60",
      className,
    )}
    data-slot="marquee-root"
    {...props}
  />
);

export const MarqueeViewport = ({
  className,
  ...props
}) => (
  <MarqueePrimitive.Viewport
    className={cn("h-full w-full", className)}
    data-slot="marquee-viewport"
    {...props}
  />
);

export const MarqueeContent = ({
  className,
  ...props
}) => (
  <MarqueePrimitive.Content
    className={cn(className)}
    data-slot="marquee-content"
    {...props}
  />
);

export const MarqueeItem = ({
  className,
  ...props
}) => (
  <MarqueePrimitive.Item
    className={cn(
      "flex shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-md border border-border px-6 py-4 text-sm select-none",
      className,
    )}
    data-slot="marquee-item"
    {...props}
  />
);

export const MarqueeEdge = ({
  className,
  ...props
}) => (
  <MarqueePrimitive.Edge
    className={cn("data-[orientation=horizontal]:w-[20%]", className)}
    data-slot="marquee-edge"
    {...props}
  />
);

export const MarqueeRootProvider = ({
  className,
  ...props
}) => (
  <MarqueePrimitive.RootProvider
    className={cn(
      "w-full max-w-full text-foreground",
      "data-[orientation=horizontal]:h-20 data-[orientation=vertical]:h-60",
      className,
    )}
    data-slot="marquee-root"
    {...props}
  />
);

export const MarqueeContext = MarqueePrimitive.Context;

export { useMarquee, useMarqueeContext };
