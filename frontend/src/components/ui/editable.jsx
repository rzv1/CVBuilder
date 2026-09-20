"use client";;
import { Editable as EditablePrimitive } from "@ark-ui/react/editable";
import { buttonVariants } from "@/frontend/components/ui/button";
import { cn } from "@/frontend/lib/utils";

export const Editable = ({
  className,
  selectOnFocus = false,
  ...props
}) => {
  return (
    <EditablePrimitive.Root
      className={cn(
        "flex w-full max-w-md flex-col gap-1.5 text-foreground",
        className,
      )}
      data-slot="editable"
      selectOnFocus={selectOnFocus}
      {...props}
    />
  );
};

export const EditableLabel = ({
  className,
  ...props
}) => {
  return (
    <EditablePrimitive.Label
      className={cn(
        "font-medium text-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-64",
        className,
      )}
      data-slot="editable-label"
      {...props}
    />
  );
};

export const EditableArea = ({
  className,
  style,
  ...rest
}) => {
  return (
    <EditablePrimitive.Area
      className={cn(
        "relative max-w-full min-h-8.5 w-full min-w-0 sm:min-h-7.5",
        className,
      )}
      data-slot="editable-area"
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        ...style,
      }}
      {...rest}
    />
  );
};

const editableFieldShell =
  "box-border w-full min-w-0 rounded-lg border px-3 py-2 text-base sm:text-sm";

/** Same fixed block size as native text input — preview must match or swap will jump. */
const editableSingleLineHeight =
  "h-8.5 sm:h-7.5 data-autoresize:h-auto data-autoresize:min-h-20";

export const EditableInput = ({
  className,
  ...props
}) => {
  return (
    <EditablePrimitive.Input
      className={cn(
        editableFieldShell,
        "border-input bg-background text-foreground outline-none ring-ring/24 transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/72 focus-visible:border-ring focus-visible:ring-[3px] data-invalid:border-destructive/36 data-invalid:ring-destructive/16 dark:bg-input/32 dark:data-invalid:ring-destructive/24",
        editableSingleLineHeight,
        "data-autoresize:resize-none data-autoresize:wrap-break-word data-autoresize:field-sizing-content",
        className,
      )}
      data-slot="editable-input"
      {...props}
    />
  );
};

export const EditablePreview = ({
  className,
  ...props
}) => {
  return (
    <EditablePrimitive.Preview
      className={cn(
        editableFieldShell,
        "flex cursor-text items-center overflow-hidden text-foreground outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/24 not-data-readonly:not-data-disabled:hover:dark:bg-input/32",
        "border-transparent",
        editableSingleLineHeight,
        "text-ellipsis whitespace-nowrap",
        "data-placeholder-shown:text-muted-foreground",
        "data-autoresize:items-start data-autoresize:justify-start data-autoresize:overflow-visible data-autoresize:wrap-break-word data-autoresize:whitespace-pre-wrap!",
        className,
      )}
      data-slot="editable-preview"
      {...props}
    />
  );
};

export const EditableControl = ({
  className,
  ...props
}) => {
  return (
    <EditablePrimitive.Control
      className={cn("flex flex-wrap items-center gap-2 pt-0.5", className)}
      data-slot="editable-control"
      {...props}
    />
  );
};

const triggerClass = buttonVariants({ size: "sm", variant: "secondary" });

export const EditableEditTrigger = ({
  className,
  ...props
}) => {
  return (
    <EditablePrimitive.EditTrigger
      className={cn(triggerClass, className)}
      data-slot="editable-edit-trigger"
      {...props}
    />
  );
};

export const EditableSubmitTrigger = ({
  className,
  ...props
}) => {
  return (
    <EditablePrimitive.SubmitTrigger
      className={cn(triggerClass, className)}
      data-slot="editable-submit-trigger"
      {...props}
    />
  );
};

export const EditableCancelTrigger = ({
  className,
  ...props
}) => {
  return (
    <EditablePrimitive.CancelTrigger
      className={cn(
        buttonVariants({ size: "sm", variant: "outline" }),
        className,
      )}
      data-slot="editable-cancel-trigger"
      {...props}
    />
  );
};

export const EditableContext = EditablePrimitive.Context;

export const EditableRootProvider = ({
  className,
  ...props
}) => {
  return (
    <EditablePrimitive.RootProvider
      className={cn(
        "flex w-full max-w-md flex-col gap-1.5 text-foreground",
        className,
      )}
      data-slot="editable"
      {...props}
    />
  );
};

export { useEditable, useEditableContext } from "@ark-ui/react/editable";
