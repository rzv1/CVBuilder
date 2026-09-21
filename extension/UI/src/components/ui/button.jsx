"use client";
import { ark } from "@ark-ui/react/factory";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-medium text-sm outline-none transition-all disabled:pointer-events-none disabled:opacity-50 select-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-9 px-3.5",
        icon: "size-9",
        "icon-sm": "size-7.5",
        "icon-xs": "size-6.5",
        lg: "h-10 px-4",
        sm: "h-8 gap-1.5 px-3 text-xs",
        xs: "h-7 gap-1 px-2.5 text-xs",
      },
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 active:scale-[0.98]",
        destructive:
          "border-destructive bg-destructive text-white hover:bg-destructive/90 active:scale-[0.98]",
        ghost:
          "border-transparent text-foreground hover:bg-muted active:scale-[0.98]",
        outline:
          "border-input bg-background text-foreground hover:bg-muted active:scale-[0.98]",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
      },
    },
  }
);

const Button = ({
  className,
  variant = "default",
  size = "default",
  children,
  loading = false,
  ...props
}) => {
  return (
    <ark.button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading || props.disabled}
      {...props}
    >
      {children}
    </ark.button>
  );
};

export { Button, buttonVariants };
