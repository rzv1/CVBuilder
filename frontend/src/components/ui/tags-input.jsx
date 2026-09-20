"use client";;
import {
  TagsInput as TagsInputPrimitive,
  useTagsInput,
  useTagsInputContext,
} from "@ark-ui/react/tags-input";
import { XIcon } from "lucide-react";
import { cn } from "@/frontend/lib/utils";

export const TagsInput = ({
  className,
  children,
  ...props
}) => (
  <TagsInputPrimitive.Root
    className={cn("flex w-full flex-col gap-1.5", className)}
    data-slot="tags-input"
    {...props}
  >
    {children}
    <TagsInputPrimitive.HiddenInput />
  </TagsInputPrimitive.Root>
);

export const TagsInputRootProvider = ({
  className,
  children,
  ...props
}) => (
  <TagsInputPrimitive.RootProvider
    className={cn("flex w-full flex-col gap-1.5", className)}
    data-slot="tags-input-root-provider"
    {...props}
  >
    {children}
    <TagsInputPrimitive.HiddenInput />
  </TagsInputPrimitive.RootProvider>
);

export const TagsInputLabel = ({
  className,
  ...props
}) => (
  <TagsInputPrimitive.Label
    className={cn(
      "text-sm font-medium text-foreground data-disabled:opacity-64",
      className,
    )}
    data-slot="tags-input-label"
    {...props}
  />
);

export const TagsInputControl = ({
  className,
  ...props
}) => (
  <TagsInputPrimitive.Control
    className={cn(
      "relative inline-flex min-h-9 w-full flex-wrap items-center gap-1 rounded-lg border border-input bg-background p-[calc(--spacing(1)-1px)] text-base shadow-xs/5 outline-none ring-ring/24 transition-shadow focus-within:border-ring focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-64 has-data-invalid:border-destructive/40 focus-within:has-data-invalid:border-destructive/70 focus-within:has-data-invalid:ring-destructive/16 sm:min-h-8 sm:text-sm",
      className,
    )}
    data-slot="tags-input-control"
    {...props}
  />
);

export const TagsInputItem = ({
  className,
  ...props
}) => (
  <TagsInputPrimitive.Item
    className={cn(
      "inline-flex max-w-full items-center outline-none",
      className,
    )}
    data-slot="tags-input-item"
    {...props}
  />
);

export const TagsInputItemPreview = ({
  className,
  ...props
}) => (
  <TagsInputPrimitive.ItemPreview
    className={cn(
      "inline-flex h-6 max-w-full items-center gap-1 rounded-md border border-border bg-muted/50 px-1.5 text-xs data-highlighted:border-primary/30 data-highlighted:bg-primary/10",
      className,
    )}
    data-slot="tags-input-item-preview"
    {...props}
  />
);

export const TagsInputItemText = ({
  className,
  ...props
}) => (
  <TagsInputPrimitive.ItemText
    className={cn("truncate", className)}
    data-slot="tags-input-item-text"
    {...props}
  />
);

export const TagsInputItemDeleteTrigger = ({
  className,
  children,
  ...props
}) => (
  <TagsInputPrimitive.ItemDeleteTrigger
    className={cn(
      "inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded p-0.5 text-muted-foreground hover:bg-background hover:text-foreground",
      className,
    )}
    data-slot="tags-input-item-delete-trigger"
    {...props}
  >
    {children ?? <XIcon className="size-3" />}
  </TagsInputPrimitive.ItemDeleteTrigger>
);

export const TagsInputItemInput = ({
  className,
  ...props
}) => (
  <TagsInputPrimitive.ItemInput
    className={cn(
      "h-6 min-w-18 rounded-md border border-input bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className,
    )}
    data-slot="tags-input-item-input"
    {...props}
  />
);

export const TagsInputInput = ({
  className,
  ...props
}) => (
  <TagsInputPrimitive.Input
    className={cn(
      "min-w-18 flex-1 border-0 bg-transparent py-0.5 text-sm outline-none placeholder:text-muted-foreground/72",
      className,
    )}
    data-slot="tags-input-input"
    {...props}
  />
);

export const TagsInputClearTrigger = ({
  className,
  children,
  ...props
}) => (
  <TagsInputPrimitive.ClearTrigger
    className={cn(
      "inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground",
      className,
    )}
    data-slot="tags-input-clear-trigger"
    {...props}
  >
    {children ?? <XIcon className="size-3.5" />}
  </TagsInputPrimitive.ClearTrigger>
);

export const TagsInputContext = TagsInputPrimitive.Context;

export const TagsInputScaffold = ({
  label = "Frameworks",
  placeholder = "Add framework"
}) => (
  <TagsInputContext>
    {(api) => (
      <>
        <TagsInputLabel>{label}</TagsInputLabel>
        <TagsInputControl>
          {api.value.map((value, index) => (
            <TagsInputItem
              key={`${value}-${index}`}
              index={index}
              value={value}
            >
              <TagsInputItemPreview>
                <TagsInputItemText>{value}</TagsInputItemText>
                <TagsInputItemDeleteTrigger />
              </TagsInputItemPreview>
              <TagsInputItemInput />
            </TagsInputItem>
          ))}
          <TagsInputInput placeholder={placeholder} />
          <TagsInputClearTrigger />
        </TagsInputControl>
      </>
    )}
  </TagsInputContext>
);

export { useTagsInput, useTagsInputContext };
