import * as React from "react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/frontend/lib/utils";

const Drawer = DrawerPrimitive.Root;

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

export interface DrawerBackdropProps
  extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Backdrop> {}

const DrawerBackdrop = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Backdrop>,
  DrawerBackdropProps
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200",
      className
    )}
    {...props}
  />
));
DrawerBackdrop.displayName = "DrawerBackdrop";

const drawerVariants = cva(
  "fixed z-50 flex flex-col border-slate-800 bg-slate-900 text-slate-100 shadow-2xl transition-transform ease-in-out outline-none",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b max-h-[85vh] animate-in slide-in-from-top duration-300",
        bottom:
          "inset-x-0 bottom-0 border-t rounded-t-2xl max-h-[85vh] animate-in slide-in-from-bottom duration-300",
        left: "inset-y-0 left-0 border-r w-full sm:max-w-md h-full animate-in slide-in-from-left duration-300",
        right:
          "inset-y-0 right-0 border-l w-full sm:max-w-md h-full animate-in slide-in-from-right duration-300",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

export interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Popup>,
    VariantProps<typeof drawerVariants> {
  showCloseButton?: boolean;
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Popup>,
  DrawerContentProps
>(({ className, side = "right", children, showCloseButton = true, ...props }, ref) => (
  <DrawerPortal>
    <DrawerBackdrop />
    <DrawerPrimitive.Popup
      ref={ref}
      className={cn(drawerVariants({ side, className }))}
      {...props}
    >
      {side === "bottom" && (
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-slate-700 select-none" />
      )}
      {children}
      {showCloseButton && (
        <DrawerPrimitive.Close
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          aria-label="Close drawer"
        >
          <X className="size-4" />
        </DrawerPrimitive.Close>
      )}
    </DrawerPrimitive.Popup>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 p-5 border-b border-slate-800", className)}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 p-4 border-t border-slate-800 mt-auto",
      className
    )}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

export interface DrawerTitleProps
  extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title> {}

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  DrawerTitleProps
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-sm font-bold text-slate-100 leading-none", className)}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

export interface DrawerDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description> {}

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  DrawerDescriptionProps
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-xs text-slate-400 leading-relaxed", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
};
