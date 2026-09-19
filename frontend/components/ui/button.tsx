import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/frontend/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring active:not-aria-[haspopup]:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-neutral-900 text-white hover:bg-neutral-800 shadow-xs border-neutral-900",
        outline:
          "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-300 shadow-2xs",
        secondary:
          "bg-neutral-100 text-neutral-800 hover:bg-neutral-200/80 border-transparent",
        ghost:
          "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70 border-transparent",
        destructive:
          "bg-red-50 text-red-600 hover:bg-red-100/80 hover:text-red-700 border border-red-200/70",
        destructiveGhost:
          "text-neutral-400 hover:text-red-600 hover:bg-red-50/80 transition-colors border-transparent",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 border-transparent",
      },
      size: {
        default:
          "h-9 gap-1.5 px-3.5 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 text-xs font-medium has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        lg: "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9",
        "icon-xs": "size-6 p-1 rounded [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8 p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...(props as any)}
    />
  );
}

export { Button, buttonVariants };
