import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { FolderOpen } from "lucide-react";
import { cn } from "@/frontend/lib/utils";

const emptyVariants = cva(
  "flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 p-8 transition-colors",
  {
    variants: {
      size: {
        sm: "p-4 gap-2",
        default: "p-8 gap-3",
        lg: "p-12 gap-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface EmptyProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyVariants> {}

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(emptyVariants({ size, className }))}
      {...props}
    />
  )
);
Empty.displayName = "Empty";

export interface EmptyMediaProps extends React.HTMLAttributes<HTMLDivElement> {}

const EmptyMedia = React.forwardRef<HTMLDivElement, EmptyMediaProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex size-12 items-center justify-center rounded-xl bg-white border border-neutral-200 text-neutral-500 shadow-2xs mb-1 [&_svg]:size-6",
        className
      )}
      {...props}
    >
      {children || <FolderOpen className="text-neutral-400" />}
    </div>
  )
);
EmptyMedia.displayName = "EmptyMedia";

export interface EmptyTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

const EmptyTitle = React.forwardRef<HTMLHeadingElement, EmptyTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-sm font-semibold text-neutral-900 tracking-tight", className)}
      {...props}
    />
  )
);
EmptyTitle.displayName = "EmptyTitle";

export interface EmptyDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const EmptyDescription = React.forwardRef<
  HTMLParagraphElement,
  EmptyDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-xs text-neutral-500 max-w-sm leading-relaxed",
      className
    )}
    {...props}
  />
));
EmptyDescription.displayName = "EmptyDescription";

export interface EmptyActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const EmptyActions = React.forwardRef<HTMLDivElement, EmptyActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-wrap items-center justify-center gap-2 mt-2", className)}
      {...props}
    />
  )
);
EmptyActions.displayName = "EmptyActions";

export { Empty, EmptyMedia, EmptyTitle, EmptyDescription, EmptyActions };
