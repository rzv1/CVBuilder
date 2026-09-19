import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/frontend/lib/utils";

const itemVariants = cva(
  "group relative flex w-full items-center gap-3 rounded-xl border border-neutral-200/80 bg-white p-3 text-left transition-all shadow-2xs",
  {
    variants: {
      variant: {
        default:
          "hover:border-neutral-300 hover:bg-neutral-50/50",
        interactive:
          "cursor-pointer hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.99]",
        selected:
          "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900",
        ghost:
          "border-transparent bg-transparent hover:bg-neutral-100/70 p-2 shadow-none",
      },
      size: {
        sm: "p-2 gap-2 text-xs",
        default: "p-3 gap-3 text-sm",
        lg: "p-4 gap-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof itemVariants> {
  as?: "div" | "button" | "li";
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, variant, size, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(itemVariants({ variant, size, className }))}
        {...(props as any)}
      />
    );
  }
);
Item.displayName = "Item";

export interface ItemMediaProps extends React.HTMLAttributes<HTMLDivElement> {}

const ItemMedia = React.forwardRef<HTMLDivElement, ItemMediaProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 border border-neutral-200/60 [&_svg]:size-4.5",
        className
      )}
      {...props}
    />
  )
);
ItemMedia.displayName = "ItemMedia";

export interface ItemContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const ItemContent = React.forwardRef<HTMLDivElement, ItemContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-1 flex-col min-w-0 pr-1", className)}
      {...props}
    />
  )
);
ItemContent.displayName = "ItemContent";

export interface ItemTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

const ItemTitle = React.forwardRef<HTMLHeadingElement, ItemTitleProps>(
  ({ className, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn(
        "truncate text-xs font-semibold text-neutral-900 leading-snug",
        className
      )}
      {...props}
    />
  )
);
ItemTitle.displayName = "ItemTitle";

export interface ItemDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const ItemDescription = React.forwardRef<
  HTMLParagraphElement,
  ItemDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "truncate text-[11px] text-neutral-500 leading-normal",
      className
    )}
    {...props}
  />
));
ItemDescription.displayName = "ItemDescription";

export interface ItemActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const ItemActions = React.forwardRef<HTMLDivElement, ItemActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex shrink-0 items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity",
        className
      )}
      {...props}
    />
  )
);
ItemActions.displayName = "ItemActions";

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  itemVariants,
};
