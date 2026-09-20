"use client";;
import {
  FileUpload as FileUploadPrimitive,
  useFileUpload,
} from "@ark-ui/react/file-upload";
import { buttonVariants } from "@/frontend/components/ui/button";
import { cn } from "@/frontend/lib/utils";

export { useFileUpload };

export const FileUpload = ({
  className,
  children,
  ...props
}) => (
  <FileUploadPrimitive.Root
    className={cn("flex w-full flex-col gap-2 text-foreground", className)}
    data-slot="file-upload"
    {...props}
  >
    {children}
    <FileUploadPrimitive.HiddenInput />
  </FileUploadPrimitive.Root>
);

export const FileUploadLabel = ({
  className,
  ...props
}) => (
  <FileUploadPrimitive.Label
    className={cn(
      "font-medium text-foreground text-sm leading-none data-disabled:opacity-64",
      className,
    )}
    data-slot="file-upload-label"
    {...props}
  />
);

export const FileUploadDropzone = ({
  className,
  ...props
}) => (
  <FileUploadPrimitive.Dropzone
    className={cn(
      "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-muted/20 px-4 py-6 text-center transition-colors",
      "hover:bg-muted/40 data-dragging:border-primary data-dragging:bg-primary/5 data-dragging:border-solid",
      "data-invalid:border-destructive data-disabled:cursor-not-allowed data-disabled:opacity-64",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      className,
    )}
    data-slot="file-upload-dropzone"
    {...props}
  />
);

export const FileUploadTrigger = ({
  ...props
}) => (
  <FileUploadPrimitive.Trigger data-slot="file-upload-trigger" {...props} />
);

export const FileUploadClearTrigger = ({
  ...props
}) => (
  <FileUploadPrimitive.ClearTrigger {...props} />
);

export const FileUploadItemGroup = ({
  className,
  ...props
}) => (
  <FileUploadPrimitive.ItemGroup
    className={cn("m-0 flex list-none flex-col gap-2 p-0", className)}
    data-slot="file-upload-item-group"
    {...props}
  />
);

export const FileUploadItem = ({
  className,
  ...props
}) => (
  <FileUploadPrimitive.Item
    className={cn(
      "flex items-center gap-3 rounded-lg border border-border bg-card p-2 shadow-xs/5",
      className,
    )}
    data-slot="file-upload-item"
    {...props}
  />
);

export const FileUploadItemName = ({
  className,
  ...props
}) => (
  <FileUploadPrimitive.ItemName
    className={cn(
      "min-w-0 flex-1 truncate font-medium text-foreground text-sm",
      className,
    )}
    data-slot="file-upload-item-name"
    {...props}
  />
);

export const FileUploadItemSizeText = ({
  className,
  ...props
}) => (
  <FileUploadPrimitive.ItemSizeText
    className={cn("shrink-0 text-muted-foreground text-xs", className)}
    data-slot="file-upload-item-size-text"
    {...props}
  />
);

export const FileUploadItemDeleteTrigger = ({
  className,
  variant = "ghost",
  size = "icon-xs",
  ...props
}) => (
  <FileUploadPrimitive.ItemDeleteTrigger
    className={cn(buttonVariants({ variant, size }), className)}
    data-slot="file-upload-item-delete-trigger"
    {...props}
  />
);

export const FileUploadItemPreview = ({
  className,
  ...props
}) => (
  <FileUploadPrimitive.ItemPreview
    className={cn(
      "flex size-10 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-5 rounded",
      className,
    )}
    data-slot="file-upload-item-preview"
    {...props}
  />
);

export const FileUploadItemPreviewImage = ({
  className,
  ...props
}) => (
  <FileUploadPrimitive.ItemPreviewImage
    className={cn(
      "size-10 shrink-0 border border-border bg-muted object-cover rounded-[inherit]",
      className,
    )}
    data-slot="file-upload-item-preview-image"
    {...props}
  />
);

export const FileUploadContext = FileUploadPrimitive.Context;

export const FileUploadRootProvider = ({
  className,
  children,
  ...props
}) => (
  <FileUploadPrimitive.RootProvider
    className={cn("flex w-full flex-col gap-2", className)}
    data-slot="file-upload-root-provider"
    {...props}
  >
    {children}
    <FileUploadPrimitive.HiddenInput />
  </FileUploadPrimitive.RootProvider>
);
