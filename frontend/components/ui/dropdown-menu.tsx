import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/frontend/lib/utils";

const DropdownMenu = MenuPrimitive.Root;

const DropdownMenuTrigger = MenuPrimitive.Trigger;

const DropdownMenuGroup = MenuPrimitive.Group;

const DropdownMenuSub = MenuPrimitive.SubmenuRoot;

export interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof MenuPrimitive.Popup> {
  sideOffset?: number;
}

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Popup>,
  DropdownMenuContentProps
>(({ className, sideOffset = 4, children, ...props }, ref) => (
  <MenuPrimitive.Portal>
    <MenuPrimitive.Positioner sideOffset={sideOffset} className="z-50">
      <MenuPrimitive.Popup
        ref={ref}
        className={cn(
          "z-50 min-w-[10rem] overflow-hidden rounded-xl border border-neutral-200 bg-white p-1 text-neutral-900 shadow-xl outline-none",
          "animate-in fade-in zoom-in-95 duration-150",
          className
        )}
        {...props}
      >
        {children}
      </MenuPrimitive.Popup>
    </MenuPrimitive.Positioner>
  </MenuPrimitive.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item> {
  inset?: boolean;
  destructive?: boolean;
}

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, inset, destructive, ...props }, ref) => (
  <MenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-neutral-700 outline-none transition-colors",
      "hover:bg-neutral-100 hover:text-neutral-900 focus:bg-neutral-100 focus:text-neutral-900",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      destructive && "text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

export interface DropdownMenuLabelProps
  extends React.ComponentPropsWithoutRef<typeof MenuPrimitive.GroupLabel> {
  inset?: boolean;
}

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.GroupLabel>,
  DropdownMenuLabelProps
>(({ className, inset, ...props }, ref) => (
  <MenuPrimitive.GroupLabel
    ref={ref}
    className={cn(
      "px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 select-none",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export interface DropdownMenuSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator> {}

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Separator>,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-neutral-100", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export interface DropdownMenuShortcutProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

const DropdownMenuShortcut = ({
  className,
  ...props
}: DropdownMenuShortcutProps) => {
  return (
    <span
      className={cn("ml-auto text-[10px] tracking-widest text-neutral-400 font-mono", className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
};
