"use client";;
import { Switch as SwitchPrimitive } from "@ark-ui/react/switch";

import { cn } from "@/lib/utils";

export const SwitchRoot = ({
  children,
  className,
  ...props
}) => {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      {...props}
      className={cn("inline-flex items-center gap-2", className)}
    >
      {children}
      <SwitchPrimitive.HiddenInput />
    </SwitchPrimitive.Root>
  );
};

export const SwitchControl = ({
  className,
  ...props
}) => {
  return (
    <SwitchPrimitive.Control
      data-slot="switch-control"
      className={cn(
        "peer relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-input/70 p-0.5 shadow-xs/5 transition-colors outline-none",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        "data-[state=checked]:bg-primary",
        "focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-invalid:ring-3 data-invalid:ring-destructive/20 data-invalid:data-[state=checked]:bg-primary dark:data-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    >
      <SwitchThumb />
    </SwitchPrimitive.Control>
  );
};

export const SwitchThumb = ({
  className,
  ...props
}) => (
  <SwitchPrimitive.Thumb
    data-slot="switch-thumb"
    className={cn(
      "pointer-events-none block size-5 rounded-full bg-background shadow-sm ring-1 ring-border/30 transition-transform",
      "data-[state=checked]:translate-x-4 rtl:data-[state=checked]:-translate-x-4",
      className,
    )}
    {...props}
  />
);

export const Switch = (props) => <SwitchControl {...props} />;

export const SwitchLabel = ({
  className,
  ...props
}) => (
  <SwitchPrimitive.Label
    data-slot="switch-label"
    className={cn(
      "text-sm font-medium text-foreground select-none data-disabled:opacity-50 data-invalid:text-destructive",
      className,
    )}
    {...props}
  />
);

export const SwitchHiddenInput = (props) => (
  <SwitchPrimitive.HiddenInput data-slot="switch-hidden-input" {...props} />
);

export const SwitchContext = SwitchPrimitive.Context;
export const SwitchRootProvider = SwitchPrimitive.RootProvider;

export { useSwitch, useSwitchContext } from "@ark-ui/react/switch";
