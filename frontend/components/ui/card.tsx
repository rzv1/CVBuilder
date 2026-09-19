import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/frontend/lib/utils";

const cardVariants = cva(
  "rounded-xl border text-neutral-900 shadow-2xs transition-colors",
  {
    variants: {
      variant: {
        default: "border-neutral-200/80 bg-white",
        modal: "w-full max-w-lg bg-white border-neutral-200 shadow-2xl p-0 overflow-hidden",
        nested: "p-4 rounded-xl bg-neutral-50/70 border-neutral-200/80 space-y-3 shadow-none",
        dropzone: "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 border-neutral-200 bg-neutral-50/50 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-600 shadow-none",
        dropzoneActive: "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 border-neutral-900 bg-neutral-100/60 ring-2 ring-neutral-900/10 scale-[0.99] shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

const cardHeaderVariants = cva("p-4", {
  variants: {
    variant: {
      default: "flex flex-col space-y-1.5",
      modal: "flex flex-row items-center justify-between p-5 border-b border-neutral-100 space-y-0",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardHeaderVariants({ variant, className }))}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight text-neutral-900", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-neutral-500", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("ml-auto flex items-center gap-2", className)}
    {...props}
  />
));
CardAction.displayName = "CardAction";

const cardContentVariants = cva("p-4 pt-0", {
  variants: {
    variant: {
      default: "",
      modal: "p-5 space-y-4 pt-5",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardContentVariants({ variant, className }))}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

const cardFooterVariants = cva("flex items-center p-4 pt-0", {
  variants: {
    variant: {
      default: "",
      modal: "justify-end gap-2 p-4 bg-neutral-50/60 border-t border-neutral-100 pt-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardFooterVariants({ variant, className }))}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  cardVariants,
  cardHeaderVariants,
  cardContentVariants,
  cardFooterVariants,
};
