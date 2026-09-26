"use client";;
import { Portal } from "@ark-ui/react/portal";
import {
  createListCollection,
  Select as SelectPrimitive,
  SelectRootProvider,
  useListCollection,
  useSelect,
  useSelectContext,
} from "@ark-ui/react/select";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { Fragment, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";

export { createListCollection, SelectRootProvider, useListCollection, useSelect, useSelectContext };

export const Select = props => {
  const {
    positioning,
    children,
    items: itemsFromProps,
    groupBy,
    groupSort,
    itemToString,
    itemToValue,
    isItemDisabled,
    collection: collectionProp,
    ...rootProps
  } = props;
  const items = itemsFromProps !== undefined ? itemsFromProps : [];

  const { collection: defaultCollection, set } = useListCollection({
    initialItems: items,
    groupBy,
    groupSort,
    itemToString,
    itemToValue,
    isItemDisabled,
  });

  const itemsKey = useMemo(
    () =>
      items
        .map((item) =>
          String(
            itemToValue?.(item) ?? (item).value ?? "",
          ),
        )
        .join("\uffff"),
    [items, itemToValue],
  );

  useEffect(() => {
    // Sync `items` into the internal collection only when the *contents* change.
    // Avoids infinite render loops when callers pass `items={[...arr]}`.
    set([...items]);
  }, [itemsKey]);

  return (
    <SelectPrimitive.Root
      collection={collectionProp ?? defaultCollection}
      data-slot="select-root"
      positioning={
        positioning ?? { placement: "bottom-start", sameWidth: true }
      }
      {...rootProps}
    >
      {typeof children === "function" ? (
        <SelectPrimitive.Context>
          {(api) => children(api)}
        </SelectPrimitive.Context>
      ) : (
        children
      )}
      <SelectPrimitive.HiddenSelect />
    </SelectPrimitive.Root>
  );
};

export const SelectControl = ({
  className,
  ...props
}) => (
  <SelectPrimitive.Control
    className={cn("flex w-full min-w-0 flex-col gap-1.5", className)}
    {...props}
  />
);

export const SelectTrigger = ({
  ...props
}) => (
  <SelectPrimitive.Trigger data-slot="select-trigger" {...props} />
);

export const SelectValue = (
  {
    children,
    placeholder,
    className
  }
) => (<SelectPrimitive.Context>
  {(api) => {
    if (children) {
      return (
        <span
          {...api.getValueTextProps()}
          className={cn("min-w-0 flex-1 truncate text-left", className)}
          data-slot="select-value"
        >
          {children(api)}
        </span>
      );
    }
    const text = api.valueAsString?.trim();
    return (
      <SelectPrimitive.ValueText
        placeholder={placeholder}
        className={cn(
          "min-w-0 flex-1 truncate text-left",
          !text && "text-muted-foreground",
          className,
        )}
        data-slot="select-value"
      />
    );
  }}
</SelectPrimitive.Context>);

export const SelectPopup = ({
  className,
  disablePortal,
  ...props
}) => {
  const inner = (
    <SelectPrimitive.Content
      className={cn(
        "outline-none flex max-h-[min(var(--available-height,20rem),20rem)] flex-col overflow-y-auto overscroll-contain rounded-lg border border-border bg-popover p-0.5 text-popover-foreground shadow-md",
        !disablePortal && "z-50",
        className,
      )}
      data-slot="select-content"
      {...props}
    />
  );
  return disablePortal ? (
    inner
  ) : (
    <Portal>
      <SelectPrimitive.Positioner>{inner}</SelectPrimitive.Positioner>
    </Portal>
  );
};

export const SelectItem = ({
  className,
  ...props
}) => (
  <SelectPrimitive.Item
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      className,
    )}
    data-slot="select-item"
    {...props}
  />
);

export const SelectItemText = ({
  className,
  ...props
}) => (
  <SelectPrimitive.ItemText
    className={cn("min-w-0 flex-1 truncate", className)}
    data-slot="select-item-text"
    {...props}
  />
);

export const SelectItemIndicator = ({
  className,
  children,
  ...props
}) => (
  <SelectPrimitive.ItemIndicator
    className={cn("text-primary", className)}
    data-slot="select-item-indicator"
    {...props}
  >
    {children ?? <CheckIcon className="size-4" />}
  </SelectPrimitive.ItemIndicator>
);

export const SelectItemGroup = ({
  className,
  ...props
}) => (
  <SelectPrimitive.ItemGroup
    className={cn("flex flex-col gap-0.5", className)}
    data-slot="select-item-group"
    {...props}
  />
);

export const SelectItemGroupLabel = ({
  className,
  ...props
}) => (
  <SelectPrimitive.ItemGroupLabel
    className={cn(
      "px-2 py-1 font-medium text-muted-foreground text-xs uppercase tracking-wide",
      className,
    )}
    data-slot="select-item-group-label"
    {...props}
  />
);

export const SelectSeparator = ({
  className,
  ...props
}) => (
  <div
    role="separator"
    className={cn("-mx-0.5 my-1 h-px bg-border", className)}
    data-slot="select-separator"
    {...props}
  />
);

export const SelectLabel = ({
  className,
  ...props
}) => (
  <SelectPrimitive.Label
    className={cn(
      "mb-1 block font-medium text-foreground text-sm select-none data-disabled:opacity-50",
      className,
    )}
    data-slot="select-label"
    {...props}
  />
);

export const SelectIndicator = ({
  className,
  children,
  ...props
}) => (
  <SelectPrimitive.Indicator
    className={cn("shrink-0 text-muted-foreground", className)}
    data-slot="select-indicator"
    {...props}
  >
    {children ?? <ChevronDownIcon className="size-4 opacity-80" aria-hidden />}
  </SelectPrimitive.Indicator>
);

export const SelectClearTrigger = ({
  ...props
}) => (
  <SelectPrimitive.ClearTrigger {...props} />
);

export const SelectTriggerField = ({
  showClear = false,
  className,
  children,
  hideIndicator,
  size = "default",
  containerClass,
  ...props
}) => (
  <SelectPrimitive.Control render={<ButtonGroup className={cn("w-full min-w-0", containerClass)} />}><SelectTrigger {...props} render={<Button variant={"outline"} size={size} className={cn("flex-1", className)} />}>{children}{showClear ? (
                            <>
                              <SelectClearTrigger render={<span role="button" />}><XIcon /></SelectClearTrigger>
                            </>
                          ) : null}{!hideIndicator && (
                            <SelectIndicator className="inline-flex items-center justify-center" />
                          )}</SelectTrigger></SelectPrimitive.Control>
);

export const SelectList = ({
  className,
  ...props
}) => (
  <SelectPrimitive.List
    className={cn("flex flex-col gap-0.5 p-0.5 outline-none", className)}
    data-slot="select-list"
    {...props}
  />
);

export const SelectGroupedList = (
  {
    items,
    className,
    children
  }
) => {
  // `useSelectContext()` is not generic over `T`; collection matches `T` when used under `<Select<T>>`.
  const { collection } = useSelectContext();
  const typedCollection = collection;
  const groups = typedCollection.group();
  return (
    <div
      className={cn("flex flex-col gap-1 p-0.5 outline-none", className)}
      data-slot="select-grouped-list"
    >
      {groups.map((tuple) => (
        <Fragment key={tuple[0]}>{children(tuple)}</Fragment>
      ))}
    </div>
  );
};

export const SelectEmpty = ({
  className,
  ...props
}) => {
  const { collection } = useSelectContext();
  if (collection.size > 0) {
    return null;
  }
  return (
    <div
      role="presentation"
      className={cn(
        "rounded-md px-2 py-3 text-center text-muted-foreground text-sm",
        className,
      )}
      data-slot="select-empty"
      {...props}
    />
  );
};

export const SelectContext = SelectPrimitive.Context;

export const SelectItemContext = SelectPrimitive.ItemContext;
