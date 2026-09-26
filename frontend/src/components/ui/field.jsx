"use client";;
import { Field as FieldPrimitive } from "@ark-ui/react/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Field = ({
  className,
  ...props
}) => (
  <FieldPrimitive.Root
    className={cn("group/field flex w-full flex-col gap-1.5", className)}
    data-slot="field"
    {...props}
  />
);

export const FieldLabel = ({
  className,
  ...props
}) => (
  <FieldPrimitive.Label
    data-slot="field-label"
    className={cn(
      "text-sm font-medium text-foreground leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 group-data-disabled/field:pointer-events-none group-data-disabled/field:opacity-64",
      className,
    )}
    {...props}
  />
);

export const FieldDescription = ({
  className,
  ...props
}) => (
  <FieldPrimitive.HelperText
    data-slot="field-description"
    className={cn("text-muted-foreground text-xs", className)}
    {...props}
  />
);

export const FieldError = ({
  className,
  ...props
}) => (
  <FieldPrimitive.ErrorText
    data-slot="field-error"
    className={cn("text-destructive text-xs", className)}
    {...props}
  />
);

export const FieldRequiredIndicator = ({
  className,
  fallback = "*",
  ...props
}) => (
  <FieldPrimitive.RequiredIndicator
    data-slot="field-required-indicator"
    fallback={fallback}
    className={cn("text-destructive ms-0.5", className)}
    {...props}
  />
);

/** Registers a custom control (e.g. styled `Input`) with field context — use `asChild`. */
export const FieldInput = (props) => {
  if (props.asChild) {
    return <FieldPrimitive.Input data-slot="field-control" {...props} />;
  }

  return (
    <FieldPrimitive.Input data-slot="field-input" {...props} render={<Input />}></FieldPrimitive.Input>
  );
};

export const FieldItem = (props) => (
  <FieldPrimitive.Item {...props} />
);

export const FieldContext = FieldPrimitive.Context;

export {
  FieldRootProvider,
  useField,
  useFieldContext,
} from "@ark-ui/react/field";
