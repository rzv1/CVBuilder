"use client";;
import {
  Tabs as TabsPrimitive,
  useTabs,
  useTabsContext,
} from "@ark-ui/react/tabs";
import { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

export { useTabs, useTabsContext };

const TabsChromeContext = createContext(null);

const useTabsChrome = () => {
  const ctx = useContext(TabsChromeContext);
  if (!ctx) {
    throw new Error(
      "Tabs components must be used within <Tabs> or <TabsRootProvider>.",
    );
  }
  return ctx;
};

export const Tabs = ({
  orientation = "horizontal",
  variant = "default",
  className,
  children,
  ...props
}) => (
  <TabsPrimitive.Root
    data-slot="tabs"
    data-variant={variant}
    data-orientation={orientation}
    orientation={orientation}
    className={cn(
      "flex w-full data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row",
      className,
    )}
    {...props}
  >
    <TabsChromeContext.Provider value={{ variant, orientation }}>
      {children}
    </TabsChromeContext.Provider>
  </TabsPrimitive.Root>
);

export const TabsRootProvider = ({
  variant = "default",
  orientation = "horizontal",
  className,
  children,
  ...props
}) => (
  <TabsPrimitive.RootProvider
    data-slot="tabs-root-provider"
    data-variant={variant}
    data-orientation={orientation}
    className={cn(
      "flex w-full data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row",
      className,
    )}
    {...props}
  >
    <TabsChromeContext.Provider
      value={{
        variant,
        orientation: orientation,
      }}
    >
      {children}
    </TabsChromeContext.Provider>
  </TabsPrimitive.RootProvider>
);

export const TabsList = ({
  className,
  withIndicator = true,
  indicatorClassName,
  children,
  ...props
}) => {
  const { variant, orientation } = useTabsChrome();

  return (
    <TabsPrimitive.List
      {...props}
      data-slot="tabs-list"
      data-variant={variant}
      data-orientation={orientation}
      className={cn(
        "relative isolate inline-flex w-fit items-center gap-1 text-muted-foreground",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
        "data-[variant=default]:rounded-lg data-[variant=default]:bg-muted data-[variant=default]:p-1",
        "data-[variant=underline]:rounded-none data-[variant=underline]:bg-transparent data-[variant=underline]:p-0 data-[variant=underline]:data-[orientation=horizontal]:border-b data-[variant=underline]:data-[orientation=vertical]:border-s data-[variant=underline]:border-border",
        className,
      )}
    >
      {children}
      {withIndicator ? (
        <TabsPrimitive.Indicator
          data-slot="tabs-indicator"
          data-variant={variant}
          data-orientation={orientation}
          className={cn(
            "absolute z-0",
            "start-(--left) top-(--top) h-(--height) w-(--width)",
            "transition-[width,height,left,top] duration-200 ease-in-out motion-reduce:transition-none",
            "data-[variant=default]:rounded-md data-[variant=default]:bg-background data-[variant=default]:shadow-sm/5 data-[variant=default]:dark:bg-input",
            "data-[variant=underline]:rounded-full data-[variant=underline]:bg-primary",
            "data-[variant=underline]:data-[orientation=horizontal]:top-auto data-[variant=underline]:data-[orientation=horizontal]:bottom-0 data-[variant=underline]:data-[orientation=horizontal]:h-0.5 data-[variant=underline]:data-[orientation=horizontal]:translate-y-px",
            "data-[variant=underline]:data-[orientation=vertical]:start-0 data-[variant=underline]:data-[orientation=vertical]:w-0.5 data-[variant=underline]:data-[orientation=vertical]:-translate-x-px rtl:data-[variant=underline]:data-[orientation=vertical]:translate-x-px",
            indicatorClassName,
          )}
        />
      ) : null}
    </TabsPrimitive.List>
  );
};

export const TabsTrigger = ({
  className,
  ...props
}) => {
  const { variant } = useTabsChrome();

  return (
    <TabsPrimitive.Trigger
      {...props}
      data-slot="tabs-trigger"
      data-variant={variant}
      className={cn(
        "cursor-pointer disabled:cursor-default data-disabled:cursor-default relative z-10 inline-flex min-h-8 items-center justify-center whitespace-nowrap rounded-md px-3 font-medium text-sm outline-none transition-[color,background-color,box-shadow] select-none",
        "data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start data-[orientation=vertical]:px-3 data-[orientation=vertical]:py-2",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        "data-disabled:pointer-events-none data-disabled:opacity-64",
        "data-[variant=default]:text-muted-foreground data-[variant=default]:data-selected:text-foreground",
        "data-[variant=underline]:rounded-none data-[variant=underline]:text-muted-foreground data-[variant=underline]:data-selected:text-foreground",
        className,
      )}
    />
  );
};

export const TabsContent = ({
  className,
  ...props
}) => (
  <TabsPrimitive.Content
    data-slot="tabs-content"
    className={cn(
      "mt-3 w-full rounded-lg text-sm outline-none",
      "data-[orientation=vertical]:mt-0 data-[orientation=vertical]:ms-4",
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
      className,
    )}
    {...props}
  />
);

export const TabsIndicator = ({
  className,
  ...props
}) => (
  <TabsPrimitive.Indicator
    data-slot="tabs-indicator-raw"
    className={cn(className)}
    {...props}
  />
);

export const TabsContext = (props) => (
  <TabsPrimitive.Context {...props} />
);

export const TabsRoot = ({
  children,
  className
}) => (
  <div className={cn("flex w-full flex-col gap-3", className)}>{children}</div>
);
