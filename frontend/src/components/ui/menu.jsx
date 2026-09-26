"use client";;
import {
  Menu as MenuPrimitive,
  useMenu,
  useMenuContext,
  useMenuItemContext,
} from "@ark-ui/react/menu";
import { Portal } from "@ark-ui/react/portal";
import { cn } from "@/lib/utils";

export const Menu = ({
  positioning,
  ...props
}) => (
  <MenuPrimitive.Root
    data-slot="menu"
    positioning={{ sizeMiddleware: false, ...positioning }}
    {...props}
  />
);

export const MenuTrigger = ({
  className,
  ...props
}) => (
  <MenuPrimitive.Trigger
    className={cn(className)}
    data-slot="menu-trigger"
    {...props}
  />
);

export const MenuContextTrigger = ({
  className,
  ...props
}) => (
  <MenuPrimitive.ContextTrigger
    className={cn(className)}
    data-slot="menu-context-trigger"
    {...props}
  />
);

export const MenuPopup = ({
  arrowClassName,
  arrowTipClassName,
  children,
  className,
  disablePortal,
  positionerClassName,
  showArrow = false,
  ...contentProps
}) => {
  const inner = (
    <MenuPrimitive.Positioner
      className={cn(!disablePortal && "z-50", positionerClassName)}
      data-slot="menu-positioner"
    >
      <MenuPrimitive.Content
        className={cn(
          "relative z-[calc(50+var(--layer-index,0))] min-w-40 rounded-md border border-border/80 bg-popover p-1 text-popover-foreground shadow-md outline-none ring-1 ring-border/20",
          "transition-opacity duration-150 data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
          className,
        )}
        data-slot="menu-content"
        {...contentProps}
      >
        {showArrow ? (
          <MenuPrimitive.Arrow
            className={cn(
              "[--arrow-background:var(--popover)] [--arrow-size:10px] [--arrow-shadow-color:var(--border)]",
              arrowClassName,
            )}
            data-slot="menu-arrow"
          >
            <MenuPrimitive.ArrowTip
              className={cn(
                "border-border border-t border-l",
                arrowTipClassName,
              )}
              data-slot="menu-arrow-tip"
            />
          </MenuPrimitive.Arrow>
        ) : null}
        {children}
      </MenuPrimitive.Content>
    </MenuPrimitive.Positioner>
  );
  return disablePortal ? inner : <Portal>{inner}</Portal>;
};

export const MenuArrow = ({
  className,
  ...props
}) => (
  <MenuPrimitive.Arrow
    className={cn(
      "[--arrow-background:var(--popover)] [--arrow-size:10px] [--arrow-shadow-color:var(--border)]",
      className,
    )}
    data-slot="menu-arrow-raw"
    {...props}
  />
);

export const MenuArrowTip = ({
  className,
  ...props
}) => (
  <MenuPrimitive.ArrowTip
    className={cn("border-border border-t border-l", className)}
    data-slot="menu-arrow-tip-raw"
    {...props}
  />
);

export const MenuPositioner = ({
  className,
  ...props
}) => (
  <MenuPrimitive.Positioner
    className={cn(className)}
    data-slot="menu-positioner-raw"
    {...props}
  />
);

export const MenuContent = ({
  className,
  ...props
}) => (
  <MenuPrimitive.Content
    className={cn(className)}
    data-slot="menu-content-raw"
    {...props}
  />
);

export const MenuItem = ({
  className,
  ...props
}) => (
  <MenuPrimitive.Item
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      className,
    )}
    data-slot="menu-item"
    {...props}
  />
);

export const MenuItemContext = (props) => (
  <MenuPrimitive.ItemContext {...props} />
);

export const MenuItemText = ({
  className,
  ...props
}) => (
  <MenuPrimitive.ItemText
    className={cn("flex-1 truncate", className)}
    data-slot="menu-item-text"
    {...props}
  />
);

export const MenuItemIndicator = ({
  className,
  ...props
}) => (
  <MenuPrimitive.ItemIndicator
    className={cn(
      "inline-flex size-4 shrink-0 items-center justify-center text-foreground",
      className,
    )}
    data-slot="menu-item-indicator"
    {...props}
  />
);

export const MenuCheckboxItem = ({
  className,
  ...props
}) => (
  <MenuPrimitive.CheckboxItem
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      className,
    )}
    data-slot="menu-checkbox-item"
    {...props}
  />
);

export const MenuRadioItemGroup = ({
  className,
  ...props
}) => (
  <MenuPrimitive.RadioItemGroup
    className={cn("flex flex-col gap-0.5", className)}
    data-slot="menu-radio-item-group"
    {...props}
  />
);

export const MenuRadioItem = ({
  className,
  ...props
}) => (
  <MenuPrimitive.RadioItem
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      className,
    )}
    data-slot="menu-radio-item"
    {...props}
  />
);

export const MenuItemGroup = ({
  className,
  ...props
}) => (
  <MenuPrimitive.ItemGroup
    className={cn("flex flex-col gap-0.5", className)}
    data-slot="menu-item-group"
    {...props}
  />
);

export const MenuItemGroupLabel = ({
  className,
  ...props
}) => (
  <MenuPrimitive.ItemGroupLabel
    className={cn(
      "px-2 py-1.5 font-medium text-muted-foreground text-xs",
      className,
    )}
    data-slot="menu-item-group-label"
    {...props}
  />
);

export const MenuSeparator = ({
  className,
  ...props
}) => (
  <MenuPrimitive.Separator
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    data-slot="menu-separator"
    {...props}
  />
);

export const MenuTriggerItem = ({
  className,
  ...props
}) => (
  <MenuPrimitive.TriggerItem
    className={cn(
      "relative flex cursor-pointer select-none items-center justify-between gap-2 rounded-sm py-1.5 pe-1.5 ps-2 text-sm outline-none transition-colors",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      className,
    )}
    data-slot="menu-trigger-item"
    {...props}
  />
);

export const MenuIndicator = ({
  className,
  ...props
}) => (
  <MenuPrimitive.Indicator
    className={cn(className)}
    data-slot="menu-indicator"
    {...props}
  />
);

export const MenuContext = (props) => (
  <MenuPrimitive.Context {...props} />
);

export const MenuRootProvider = (props) => (
  <MenuPrimitive.RootProvider data-slot="menu-root-provider" {...props} />
);

export { useMenu, useMenuContext, useMenuItemContext };
