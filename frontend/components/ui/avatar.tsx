import * as React from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/frontend/lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden select-none bg-slate-800 text-slate-200 font-semibold border border-slate-700/60 shadow-xs",
  {
    variants: {
      size: {
        xs: "size-6 text-[10px] rounded-md",
        sm: "size-7 text-xs rounded-lg",
        default: "size-9 text-sm rounded-xl",
        lg: "size-11 text-base rounded-2xl",
        xl: "size-14 text-lg rounded-2xl",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-xl",
      },
    },
    defaultVariants: {
      size: "default",
      shape: "circle",
    },
  }
);

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, shape, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size, shape, className }))}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square size-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex size-full items-center justify-center bg-slate-800 text-slate-300 font-medium uppercase",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export interface AvatarBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "online" | "offline" | "ai" | "busy" | "away";
}

const AvatarBadge = React.forwardRef<HTMLSpanElement, AvatarBadgeProps>(
  ({ className, variant = "online", ...props }, ref) => {
    const variantClasses = {
      online: "bg-emerald-500",
      offline: "bg-slate-500",
      ai: "bg-gradient-to-r from-indigo-500 to-fuchsia-500",
      busy: "bg-rose-500",
      away: "bg-amber-400",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-slate-900",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);
AvatarBadge.displayName = "AvatarBadge";

export { Avatar, AvatarImage, AvatarFallback, AvatarBadge, avatarVariants };
