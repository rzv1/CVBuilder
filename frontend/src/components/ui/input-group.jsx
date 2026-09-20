"use client";;
import { ark } from "@ark-ui/react/factory";
import { cva } from "class-variance-authority";

import { cn } from "@/frontend/lib/utils";

export const InputGroup = ({
  className,
  ...props
}) => (
  <ark.div
    data-slot="input-group"
    className={cn(
      "group/input-group relative flex w-full min-w-0 flex-row flex-wrap items-stretch overflow-hidden rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-has-focus-within:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-within:has-aria-invalid:border-destructive/64 has-focus-within:has-aria-invalid:ring-destructive/16 has-aria-invalid:border-destructive/36 has-focus-within:border-ring has-autofill:bg-foreground/4 has-disabled:opacity-64 has-[:disabled,:focus-within,[aria-invalid]]:shadow-none has-focus-within:ring-[3px] sm:text-sm dark:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:not-has-focus-within:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
      "has-data-[slot=input-group-textarea]:flex-col has-[[data-slot=input-group-addon][data-align=block-start]]:flex-col has-[[data-slot=input-group-addon][data-align=block-end]]:flex-col",
      className,
    )}
    {...props}
  />
);

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text select-none items-center justify-center gap-2 leading-none [&>kbd]:rounded-[calc(var(--radius)-5px)] in-[[data-slot=input-group]:has([data-slot=input-control],[data-slot=textarea-control])]:[&_svg:not([class*='size-'])]:size-4.5 sm:in-[[data-slot=input-group]:has([data-slot=input-control],[data-slot=textarea-control])]:[&_svg:not([class*='size-'])]:size-4 [&_svg]:-mx-0.5 not-has-[button]:**:[svg:not([class*='opacity-'])]:opacity-80",
  {
    defaultVariants: {
      align: "inline-start",
    },
    variants: {
      align: {
        "block-end":
          "order-last w-full justify-start px-[calc(--spacing(3)-1px)] pb-[calc(--spacing(3)-1px)] [.border-t]:pt-[calc(--spacing(3)-1px)] [[data-size=sm]+&]:px-[calc(--spacing(2.5)-1px)]",
        "block-start":
          "order-first w-full justify-start px-[calc(--spacing(3)-1px)] pt-[calc(--spacing(3)-1px)] [.border-b]:pb-[calc(--spacing(3)-1px)] [[data-size=sm]+&]:px-[calc(--spacing(2.5)-1px)]",
        "inline-end":
          "order-last pe-[calc(--spacing(3)-1px)] has-[>:last-child[data-slot=badge]]:-me-1.5 has-[>button]:-me-2 has-[>kbd:last-child]:me-[-0.35rem] [[data-size=sm]+&]:pe-[calc(--spacing(2.5)-1px)]",
        "inline-start":
          "order-first ps-[calc(--spacing(3)-1px)] has-[>:last-child[data-slot=badge]]:-ms-1.5 has-[>button]:-ms-2 has-[>kbd:last-child]:ms-[-0.35rem] [[data-size=sm]+&]:ps-[calc(--spacing(2.5)-1px)]",
      },
    },
  },
);

export const InputGroupAddon = ({
  className,
  align = "inline-start",
  ...props
}) => {
  return (
    <ark.div
      className={cn(inputGroupAddonVariants({ align }), className)}
      data-align={align}
      data-slot="input-group-addon"
      onMouseDown={(e) => {
        const target = e.target;
        const isInteractive = target.closest(
          "button, a, input, select, textarea, [role='button'], [role='combobox'], [role='listbox'], [data-slot='select-trigger']",
        );
        if (isInteractive) return;
        e.preventDefault();
        const parent = e.currentTarget.parentElement;
        const input = parent?.querySelector("input, textarea");
        if (input && !parent?.querySelector("input:focus, textarea:focus")) {
          input.focus();
        }
      }}
      {...props}
    />
  );
};

export const InputGroupText = ({
  className,
  ...props
}) => (
  <ark.span
    data-slot="input-group-text"
    className={cn(
      "text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    {...props}
  />
);

const inputGroupFieldSize = {
  default: "",
  lg: "h-9.5 leading-9.5 sm:h-8.5 sm:leading-8.5",
  sm: "h-7.5 leading-7.5 sm:h-6.5 sm:leading-6.5"
};

export const InputGroupInput = ({
  className,
  size = "default",
  ...props
}) => (
  <ark.input
    data-slot="input-group-input"
    data-size={typeof size === "string" ? size : undefined}
    className={cn(
      "order-2 min-h-8.5 min-w-0 flex-1 rounded-none border-0 bg-transparent px-[calc(--spacing(3)-1px)] leading-8.5 shadow-none outline-none [transition:background-color_5000000s_ease-in-out_0s] placeholder:text-muted-foreground/72 focus-visible:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed sm:min-h-7.5 sm:leading-7.5",
      size === "sm" && inputGroupFieldSize.sm,
      size === "lg" && inputGroupFieldSize.lg,
      props.type === "search" &&
        "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
      props.type === "file" &&
        "text-muted-foreground file:me-3 file:bg-transparent file:font-medium file:text-foreground file:text-sm",
      className,
    )}
    size={typeof size === "number" ? size : undefined}
    {...props}
  />
);

export const InputGroupTextarea = ({
  className,
  size = "default",
  ...props
}) => (
  <ark.textarea
    data-slot="input-group-textarea"
    data-size={size}
    className={cn(
      "order-2 min-h-16 w-full min-w-0 flex-1 resize-none rounded-none border-0 bg-transparent px-[calc(--spacing(3)-1px)] py-2.5 shadow-none outline-none [transition:background-color_5000000s_ease-in-out_0s] placeholder:text-muted-foreground/72 focus-visible:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed sm:py-2 sm:text-sm",
      size === "sm" && "min-h-14 py-2 text-sm",
      size === "lg" && "min-h-20 py-3 text-base sm:text-sm",
      className,
    )}
    {...props}
  />
);

export { inputGroupAddonVariants };
