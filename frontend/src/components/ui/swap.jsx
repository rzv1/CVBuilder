"use client";;
import { Swap as SwapPrimitive } from "@ark-ui/react/swap";

import { cn } from "@/frontend/lib/utils";

export const Swap = ({
  className,
  ...props
}) => (
  <SwapPrimitive.Root data-slot="swap" className={cn(className)} {...props} />
);

export const SwapIndicator = ({
  className,
  ...props
}) => (
  <SwapPrimitive.Indicator
    data-slot="swap-indicator"
    className={cn(className)}
    {...props}
  />
);

export const SwapRootProvider = ({
  className,
  ...props
}) => (
  <SwapPrimitive.RootProvider
    data-slot="swap-root-provider"
    className={cn(className)}
    {...props}
  />
);

export { useSwap, useSwapContext } from "@ark-ui/react/swap";
