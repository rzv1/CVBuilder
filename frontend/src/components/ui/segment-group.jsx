"use client";;
import {
  SegmentGroup as SegmentGroupPrimitive,
  useSegmentGroup,
  useSegmentGroupContext,
} from "@ark-ui/react/segment-group";
import { cn } from "@/lib/utils";

export { useSegmentGroup, useSegmentGroupContext };

export const SegmentGroupRoot = ({
  orientation = "horizontal",
  variant = "default",
  className,
  ...props
}) => (
  <SegmentGroupPrimitive.Root
    data-slot="segment-group"
    orientation={orientation}
    data-variant={variant}
    className={cn("group/segment-group", className)}
    {...props}
  />
);

export const SegmentGroup = ({
  children,
  className
}) => {
  return (
    <div
      className={cn(
        "relative z-0 flex w-fit items-center justify-center gap-x-0.5 border border-transparent text-muted-foreground",
        "group-data-[orientation=vertical]/segment-group:flex-col",
        "group-data-[variant=default]/segment-group:rounded-lg group-data-[variant=default]/segment-group:bg-muted group-data-[variant=default]/segment-group:p-0.5 group-data-[variant=default]/segment-group:text-muted-foreground/72",
        "group-data-[orientation=vertical]/segment-group:px-1 group-data-[orientation=horizontal]/segment-group:py-1",
        "group-data-invalid/segment-group:border-destructive/36 dark:group-data-invalid/segment-group:border-destructive/50",
        "group-data-invalid/segment-group:has-focus-visible:ring-[3px] group-data-invalid/segment-group:has-focus-visible:ring-destructive/20 dark:group-data-invalid/segment-group:has-focus-visible:ring-destructive/40",
        className,
      )}
      data-slot="segment-group-item"
    >
      {children}
      <SegmentGroupPrimitive.Indicator
        className={cn(
          "absolute left-(--left) h-(--height) w-(--width) transition-[width,height,left,top] duration-200 ease-in-out",
          "group-data-[variant=default]/segment-group:top-(--top) group-data-[variant=default]/segment-group:right-(--left)",
          "group-data-[variant=default]/segment-group:-z-1 group-data-[variant=default]/segment-group:rounded-md group-data-[variant=default]/segment-group:bg-background group-data-[variant=default]/segment-group:shadow-sm/5 group-data-[variant=default]/segment-group:dark:bg-input",
          "group-data-[variant=underline]/segment-group:bottom-0 group-data-[variant=underline]/segment-group:z-10 group-data-[variant=underline]/segment-group:bg-primary",
          "group-data-[variant=underline]/segment-group:group-data-[orientation=horizontal]/segment-group:h-0.5 group-data-[variant=underline]/segment-group:group-data-[orientation=horizontal]/segment-group:translate-y-px",
          "group-data-[variant=underline]/segment-group:group-data-[orientation=vertical]/segment-group:w-0.5 group-data-[variant=underline]/segment-group:group-data-[orientation=vertical]/segment-group:left-[calc(var(--left)/2)] group-data-[variant=underline]/segment-group:group-data-[orientation=vertical]/segment-group:-translate-x-px",
        )}
        data-slot="segment-group-indicator"
      />
    </div>
  );
};

export const Segment = ({
  className,
  children,
  ...props
}) => {
  return (
    <SegmentGroupPrimitive.Item
      className={cn(
        "relative flex min-h-9 shrink-0 grow cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-transparent px-[calc(--spacing(2.5)-1px)] font-medium text-base outline-none transition-[color,background-color,box-shadow] hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-readonly:cursor-default data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start data-[state=checked]:text-foreground data-disabled:opacity-64 sm:h-8 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0",
        className,
      )}
      data-slot="segment-group-item"
      {...props}
    >
      {typeof children === "string" ? (
        <SegmentGroupPrimitive.ItemText>
          {children}
        </SegmentGroupPrimitive.ItemText>
      ) : (
        children
      )}
      <SegmentGroupPrimitive.ItemControl className={"hidden"} />
      <SegmentGroupPrimitive.ItemHiddenInput />
    </SegmentGroupPrimitive.Item>
  );
};

export const SegmentGroupRootProvider = ({
  children,
  className,
  variant = "default",
  ...props
}) => {
  return (
    <SegmentGroupPrimitive.RootProvider
      className={cn("group/segment-group", className)}
      data-variant={variant}
      {...props}
    >
      {children}
    </SegmentGroupPrimitive.RootProvider>
  );
};
export const SegmentGroupContext = ({
  ...props
}) => {
  return <SegmentGroupPrimitive.Context {...props} />;
};
