"use client";;
import { Clipboard as ClipboardPrimitive } from "@ark-ui/react/clipboard";
import { cva } from "class-variance-authority";
import { Check, Copy } from "lucide-react";

import { cn } from "@/frontend/lib/utils";

const clipboardRootVariants = cva("w-full max-w-full", {
  defaultVariants: {
    orientation: "vertical",
  },
  variants: {
    orientation: {
      horizontal: "flex flex-row flex-wrap items-end gap-3",
      vertical: "flex flex-col gap-1.5",
    },
  },
});

const clipboardLabelVariants = cva(
  "font-medium text-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-64",
);

const clipboardControlVariants = cva("flex min-w-0 items-stretch", {
  compoundVariants: [
    {
      class:
        "relative overflow-hidden rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-has-focus-within:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-within:has-aria-invalid:border-destructive/64 has-focus-within:has-aria-invalid:ring-destructive/16 has-aria-invalid:border-destructive/36 has-focus-within:border-ring has-autofill:bg-foreground/4 has-disabled:opacity-64 has-[:disabled,:focus-within,[aria-invalid]]:shadow-none has-focus-within:ring-[3px] sm:text-sm dark:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:not-has-focus-within:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
      controlVariant: "default",
      size: "default",
    },
    {
      class:
        "relative overflow-hidden rounded-lg border border-input bg-background not-dark:bg-clip-padding text-sm text-foreground shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-has-focus-within:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-within:border-ring has-focus-within:ring-[3px] has-disabled:opacity-64 dark:bg-input/32 dark:not-has-disabled:not-has-focus-within:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
      controlVariant: "default",
      size: "sm",
    },
    {
      class:
        "relative overflow-hidden rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-has-focus-within:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-within:border-ring has-focus-within:ring-[3px] has-disabled:opacity-64 sm:text-sm dark:bg-input/32 dark:not-has-disabled:not-has-focus-within:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
      controlVariant: "default",
      size: "lg",
    },
  ],
  defaultVariants: {
    controlVariant: "default",
    size: "default",
  },
  variants: {
    controlVariant: {
      card: "gap-1 rounded-xl border border-input bg-card p-1 shadow-sm",
      default: "gap-0",
      ghost:
        "gap-2 rounded-lg border-0 bg-transparent p-0 shadow-none ring-0 before:hidden",
      soft: "gap-2 rounded-lg border-0 bg-muted/50 p-1.5 shadow-none ring-0 before:hidden",
      underline:
        "gap-2 border-0 border-b border-input rounded-none bg-transparent pb-px shadow-none ring-0 before:hidden has-focus-within:border-ring has-focus-within:ring-0",
    },
    size: {
      default: "",
      lg: "",
      sm: "",
    },
  },
});

const clipboardInputVariants = cva(
  "min-w-0 flex-1 border-0 bg-transparent outline-none [transition:background-color_5000000s_ease-in-out_0s] placeholder:text-muted-foreground/72 read-only:cursor-text focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-64",
  {
    defaultVariants: {
      controlVariant: "default",
      size: "default",
    },
    variants: {
      controlVariant: {
        card: "rounded-md px-2.5 py-2 text-sm",
        default:
          "rounded-none px-[calc(--spacing(3)-1px)] shadow-none not-in-data-[part=control]:rounded-lg not-in-data-[part=control]:border not-in-data-[part=control]:border-input",
        ghost: "px-0 py-1 text-sm",
        soft: "rounded-md px-2 py-1.5 text-sm",
        underline: "px-0 py-1 text-sm",
      },
      size: {
        default:
          "min-h-8.5 leading-8.5 sm:min-h-7.5 sm:leading-7.5 not-in-data-[part=control]:h-8.5 not-in-data-[part=control]:leading-8.5 sm:not-in-data-[part=control]:h-7.5 sm:not-in-data-[part=control]:leading-7.5",
        lg: "min-h-9.5 leading-9.5 sm:min-h-8.5 sm:leading-8.5 not-in-data-[part=control]:h-9.5 not-in-data-[part=control]:leading-9.5 sm:not-in-data-[part=control]:h-8.5 sm:not-in-data-[part=control]:leading-8.5",
        sm: "min-h-7.5 leading-7.5 sm:min-h-6.5 sm:leading-6.5 not-in-data-[part=control]:h-7.5 not-in-data-[part=control]:leading-7.5 sm:not-in-data-[part=control]:h-6.5 sm:not-in-data-[part=control]:leading-6.5",
      },
    },
  },
);

const clipboardTriggerVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 font-medium text-sm whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      controlVariant: "default",
      size: "default",
      triggerVariant: "default",
    },
    variants: {
      controlVariant: {
        card: "",
        default: "rounded-none border-0",
        ghost: "rounded-md",
        soft: "rounded-md",
        underline: "rounded-md",
      },
      size: {
        default: "min-h-8.5 min-w-8.5 px-2.5 sm:min-h-7.5 sm:min-w-7.5 sm:px-2",
        lg: "min-h-9.5 min-w-9.5 px-3 sm:min-h-8.5 sm:min-w-8.5",
        sm: "min-h-7.5 min-w-7.5 px-2 sm:min-h-6.5 sm:min-w-6.5 sm:px-1.5",
      },
      triggerVariant: {
        default:
          "border-s border-input bg-muted/40 text-foreground hover:bg-muted/60 data-copied:text-foreground",
        destructive:
          "border-s border-input bg-destructive/10 text-destructive hover:bg-destructive/15 data-copied:text-destructive",
        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground data-copied:text-foreground",
        outline:
          "border-s border-input bg-background text-foreground shadow-xs/5 hover:bg-accent/50 data-copied:text-foreground",
        primary:
          "border-s border-primary/24 bg-primary text-primary-foreground hover:bg-primary/90 data-copied:text-primary-foreground",
      },
    },
  },
);

const clipboardValueTextVariants = cva(
  "min-w-0 flex-1 truncate text-foreground text-sm leading-6 sm:leading-5",
  {
    defaultVariants: {
      size: "default",
    },
    variants: {
      size: {
        default: "text-sm",
        lg: "text-base sm:text-sm",
        sm: "text-xs sm:text-sm",
      },
    },
  },
);

export const ClipboardRoot = ({
  className,
  orientation,
  ...props
}) => (
  <ClipboardPrimitive.Root
    className={cn(clipboardRootVariants({ orientation }), className)}
    data-slot="clipboard-root"
    {...props}
  />
);

export const ClipboardLabel = ({
  className,
  ...props
}) => (
  <ClipboardPrimitive.Label
    className={cn(clipboardLabelVariants(), className)}
    data-slot="clipboard-label"
    {...props}
  />
);

export const ClipboardControl = ({
  className,
  controlVariant,
  size,
  ...props
}) => (
  <ClipboardPrimitive.Control
    className={cn(
      clipboardControlVariants({ controlVariant, size }),
      className,
    )}
    data-slot="clipboard-control"
    {...props}
  />
);

export const ClipboardInput = ({
  className,
  controlVariant,
  size,
  readOnly = true,
  ...props
}) => (
  <ClipboardPrimitive.Input
    className={cn(clipboardInputVariants({ controlVariant, size }), className)}
    data-slot="clipboard-input"
    readOnly={readOnly}
    {...props}
  />
);

export const ClipboardTrigger = ({
  className,
  controlVariant,
  size,
  triggerVariant,
  ...props
}) => (
  <ClipboardPrimitive.Trigger
    className={cn(
      clipboardTriggerVariants({ controlVariant, size, triggerVariant }),
      className,
    )}
    data-slot="clipboard-trigger"
    {...props}
  />
);

export const ClipboardIndicator = ({
  className,
  copied = <Check className="size-4 text-emerald-600 dark:text-emerald-400" />,
  children = <Copy className="size-4 opacity-80" />,
  ...props
}) => (
  <ClipboardPrimitive.Indicator
    className={cn("inline-flex items-center justify-center", className)}
    copied={copied}
    data-slot="clipboard-indicator"
    {...props}
  >
    {children}
  </ClipboardPrimitive.Indicator>
);

export const ClipboardValueText = ({
  className,
  size,
  ...props
}) => (
  <ClipboardPrimitive.ValueText
    className={cn(clipboardValueTextVariants({ size }), className)}
    data-slot="clipboard-value-text"
    {...props}
  />
);

export const ClipboardContext = ClipboardPrimitive.Context;
export const ClipboardRootProvider = ClipboardPrimitive.RootProvider;

export { useClipboard, useClipboardContext } from "@ark-ui/react/clipboard";
