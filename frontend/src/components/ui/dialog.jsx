"use client";;
import { Dialog as DialogPrimitive } from "@ark-ui/react/dialog";
import { ark } from "@ark-ui/react/factory";
import { Portal } from "@ark-ui/react/portal";
import { cva } from "class-variance-authority";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export const Dialog = (props) => (
  <DialogPrimitive.Root {...props} />
);

export const DialogBackdrop = ({
  className,
  ...props
}) => (
  <DialogPrimitive.Backdrop
    className={cn(
      "fixed inset-0 z-[calc(50+var(--layer-index,0))] bg-black/40 backdrop-blur-md transition-[opacity,backdrop-filter] duration-200 dark:bg-black/50 dark:backdrop-blur-lg data-[state=closed]:opacity-0 data-[state=open]:opacity-100 supports-backdrop-filter:bg-black/25 supports-backdrop-filter:dark:bg-black/35",
      className,
    )}
    {...props}
  />
);

const positionerVariants = cva(
  "fixed inset-0 z-[calc(50+var(--layer-index,0))] flex overscroll-y-none",
  {
    defaultVariants: {
      bottomStick: true,
    },
    variants: {
      bottomStick: {
        false: "items-center justify-center p-4",
        true: "items-end justify-center sm:items-center",
      },
    },
  },
);

const contentVariants = cva(
  "relative z-[calc(50+var(--layer-index,0))] grid min-h-0 max-h-[min(calc(100dvh-2rem),var(--dialog-max-h,32rem))] w-full shrink-0 gap-4 overflow-x-hidden overflow-y-auto rounded-xl border border-border bg-popover px-6 pt-6 pb-0 text-card-foreground shadow-lg outline-none transition-[opacity,transform] duration-150 data-[state=closed]:scale-[0.98] data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100 data-has-nested:data-[state=open]:scale-[calc(1-var(--nested-layer-count,0)*0.05)] max-sm:max-h-[min(calc(100dvh-1rem),var(--dialog-max-h,90dvh))] max-sm:rounded-b-none max-sm:rounded-t-xl sm:rounded-xl",
  {
    defaultVariants: {
      size: "default",
    },
    variants: {
      size: {
        default: "max-w-lg",
        sm: "max-w-sm gap-3 px-5 pt-5 pb-0 text-sm **:data-[slot=dialog-title]:text-base",
      },
    },
  },
);

export const DialogTrigger = ({
  className,
  ...props
}) => {
  return <DialogPrimitive.Trigger className={cn(className)} {...props} />;
};

export const DialogPopup = ({
  backdropClassName,
  bottomStickOnMobile = true,
  children,
  className,
  closeProps,
  positionerClassName,
  showCloseButton = true,
  size = "default",
  ...contentProps
}) => {
  const {
    className: closeClassName,
    children: closeChildren,
    ...closeRest
  } = closeProps ?? {};

  return (
    <Portal>
      <DialogBackdrop className={backdropClassName} />
      <DialogPrimitive.Positioner
        className={cn(
          positionerVariants({ bottomStick: bottomStickOnMobile }),
          positionerClassName,
        )}
      >
        <DialogPrimitive.Content
          className={cn(contentVariants({ size }), className)}
          {...contentProps}
        >
          {showCloseButton ? (
            <DialogPrimitive.CloseTrigger
              aria-label="Close"
              className={cn(
                "absolute top-4 inset-e-4 z-10 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                closeClassName,
              )}
              {...closeRest}
            >
              {closeChildren ?? <XIcon className="size-4" />}
            </DialogPrimitive.CloseTrigger>
          ) : null}
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Positioner>
    </Portal>
  );
};

export const DialogHeader = ({
  className,
  ...props
}) => (
  <ark.div
    className={cn("flex flex-col gap-2 text-center sm:text-start", className)}
    data-slot="dialog-header"
    {...props}
  />
);

const footerVariants = cva(
  "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        bare: "pb-4",
        default:
          "-mx-6 mt-2 border-border border-t bg-muted/40 px-6 py-4 sm:rounded-b-xl max-sm:rounded-b-none",
      },
    },
  },
);

export const DialogFooter = ({
  className,
  variant,
  ...props
}) => (
  <ark.div
    className={cn(footerVariants({ variant }), className)}
    data-slot="dialog-footer"
    {...props}
  />
);

export const DialogTitle = ({
  className,
  ...props
}) => (
  <DialogPrimitive.Title
    className={cn("font-semibold text-lg leading-none", className)}
    data-slot="dialog-title"
    {...props}
  />
);

export const DialogDescription = ({
  className,
  ...props
}) => (
  <DialogPrimitive.Description
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
);

const panelMask =
  "supports-[mask-image:linear-gradient(white,transparent)]:[mask-image:linear-gradient(to_bottom,transparent,black_0.75rem,black_calc(100%-0.75rem),transparent)]";

export const DialogPanel = ({
  className,
  scrollFade = false,
  scrollable = false,
  ...props
}) => (
  <ark.div
    className={cn(
      "flex min-h-0 w-full flex-1 flex-col gap-4",
      scrollable &&
        "overflow-y-auto overscroll-contain [scrollbar-gutter:stable]",
      scrollFade && panelMask,
      className,
    )}
    data-slot="dialog-panel"
    {...props}
  />
);

export const DialogClose = ({
  ...props
}) => {
  return <DialogPrimitive.CloseTrigger {...props} />;
};

export const DialogRootProvider = ({
  ...props
}) => (
  <DialogPrimitive.RootProvider {...props} />
);

export const DialogContext = DialogPrimitive.Context;

export { useDialog, useDialogContext } from "@ark-ui/react/dialog";
