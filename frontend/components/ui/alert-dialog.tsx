import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { cn } from "@/frontend/lib/utils";
import { buttonVariants } from "@/frontend/components/ui/button";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

export interface AlertDialogBackdropProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Backdrop> {}

const AlertDialogBackdrop = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Backdrop>,
  AlertDialogBackdropProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/25 backdrop-blur-xs animate-in fade-in duration-200",
      className
    )}
    {...props}
  />
));
AlertDialogBackdrop.displayName = "AlertDialogBackdrop";

export interface AlertDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Popup> {}

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Popup>,
  AlertDialogContentProps
>(({ className, children, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogBackdrop />
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <AlertDialogPrimitive.Popup
        ref={ref}
        className={cn(
          "relative w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 text-neutral-900 shadow-2xl outline-none",
          "animate-in fade-in zoom-in-95 duration-200",
          className
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Popup>
    </div>
  </AlertDialogPortal>
));
AlertDialogContent.displayName = "AlertDialogContent";

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-2 text-left mb-4", className)}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6",
      className
    )}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

export interface AlertDialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title> {}

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  AlertDialogTitleProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-base font-semibold text-neutral-900", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

export interface AlertDialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description> {}

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  AlertDialogDescriptionProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-xs text-neutral-500 leading-relaxed", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

export interface AlertDialogActionProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Close> {
  variant?: "default" | "destructive";
}

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Close>,
  AlertDialogActionProps
>(({ className, variant = "default", ...props }, ref) => (
  <AlertDialogPrimitive.Close
    ref={ref}
    className={cn(
      buttonVariants({ variant: variant === "destructive" ? "destructive" : "default" }),
      "text-xs px-4 h-9",
      className
    )}
    {...props}
  />
));
AlertDialogAction.displayName = "AlertDialogAction";

export interface AlertDialogCancelProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Close> {}

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Close>,
  AlertDialogCancelProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Close
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "text-xs px-4 h-9 mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
