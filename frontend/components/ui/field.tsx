import * as React from "react";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { cn } from "@/frontend/lib/utils";

export interface FieldProps
  extends React.ComponentPropsWithoutRef<typeof FieldPrimitive.Root> {}

const Field = React.forwardRef<
  React.ElementRef<typeof FieldPrimitive.Root>,
  FieldProps
>(({ className, ...props }, ref) => (
  <FieldPrimitive.Root
    ref={ref}
    className={cn("flex flex-col gap-1.5 w-full", className)}
    {...props}
  />
));
Field.displayName = "Field";

export interface FieldLabelProps
  extends React.ComponentPropsWithoutRef<typeof FieldPrimitive.Label> {
  required?: boolean;
}

const FieldLabel = React.forwardRef<
  React.ElementRef<typeof FieldPrimitive.Label>,
  FieldLabelProps
>(({ className, required, children, ...props }, ref) => (
  <FieldPrimitive.Label
    ref={ref}
    className={cn(
      "text-xs font-semibold text-neutral-700 leading-none select-none",
      className
    )}
    {...props}
  >
    {children}
    {required && <span className="ml-1 text-red-500 font-bold">*</span>}
  </FieldPrimitive.Label>
));
FieldLabel.displayName = "FieldLabel";

export interface FieldDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof FieldPrimitive.Description> {}

const FieldDescription = React.forwardRef<
  React.ElementRef<typeof FieldPrimitive.Description>,
  FieldDescriptionProps
>(({ className, ...props }, ref) => (
  <FieldPrimitive.Description
    ref={ref}
    className={cn("text-[11px] text-neutral-500 leading-normal", className)}
    {...props}
  />
));
FieldDescription.displayName = "FieldDescription";

export interface FieldErrorProps
  extends React.ComponentPropsWithoutRef<typeof FieldPrimitive.Error> {}

const FieldError = React.forwardRef<
  React.ElementRef<typeof FieldPrimitive.Error>,
  FieldErrorProps
>(({ className, ...props }, ref) => (
  <FieldPrimitive.Error
    ref={ref}
    className={cn("text-[11px] font-medium text-red-600 leading-normal", className)}
    {...props}
  />
));
FieldError.displayName = "FieldError";

export interface FieldControlProps
  extends React.ComponentPropsWithoutRef<typeof FieldPrimitive.Control> {}

const FieldControl = React.forwardRef<
  React.ElementRef<typeof FieldPrimitive.Control>,
  FieldControlProps
>(({ className, ...props }, ref) => (
  <FieldPrimitive.Control
    ref={ref}
    className={cn("w-full", className)}
    {...props}
  />
));
FieldControl.displayName = "FieldControl";

export interface FieldGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4;
}

const FieldGroup = React.forwardRef<HTMLDivElement, FieldGroupProps>(
  ({ className, columns = 1, ...props }, ref) => {
    const colClasses = {
      1: "grid grid-cols-1 gap-4",
      2: "grid grid-cols-1 sm:grid-cols-2 gap-4",
      3: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
      4: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4",
    };

    return (
      <div
        ref={ref}
        className={cn("w-full", colClasses[columns], className)}
        {...props}
      />
    );
  }
);
FieldGroup.displayName = "FieldGroup";

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldControl,
  FieldGroup,
};
