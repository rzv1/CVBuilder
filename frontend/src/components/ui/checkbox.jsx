"use client";

import { Checkbox as CheckboxPrimitive } from "@ark-ui/react/checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";

import { cn } from "@/frontend/lib/utils";

export const CheckboxRoot = ({
  children,
  className,
  ...props
}) => {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      {...props}
      className={cn("flex items-center gap-2", className)}
    >
      {children}
      <CheckboxPrimitive.HiddenInput />
    </CheckboxPrimitive.Root>
  );
};
export const Checkbox = ({
  className,
  ...props
}) => {
  return (
    <CheckboxPrimitive.Control
      className={cn(
        "cursor-pointer peer relative flex size-4 shrink-0 items-center justify-center rounded border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 data-invalid:data-[state='checked']:border-primary dark:bg-input/30 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40 data-[state='checked']:border-primary data-[state='checked']:bg-primary data-[state='checked']:text-primary-foreground dark:data-[state='checked']:bg-primary",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Context>
        {({ checked, indeterminate }) => {
          return (
            <CheckboxPrimitive.Indicator
              data-slot="checkbox-indicator"
              className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
              indeterminate={indeterminate}
            >
              {checked ? <CheckIcon /> : indeterminate ? <MinusIcon /> : null}
            </CheckboxPrimitive.Indicator>
          );
        }}
      </CheckboxPrimitive.Context>
    </CheckboxPrimitive.Control>
  );
};

export const CheckboxLabel = ({
  className,
  ...props
}) => (
  <CheckboxPrimitive.Label
    data-slot="checkbox-label"
    className={cn(
      "text-sm font-medium text-foreground select-none data-disabled:opacity-50 data-invalid:text-destructive",
      className,
    )}
    {...props}
  />
);

export const CheckboxGroup = ({
  className,
  ...props
}) => {
  return <CheckboxPrimitive.Group className={cn(className)} {...props} />;
};

export const CheckboxContext = CheckboxPrimitive.Context;
