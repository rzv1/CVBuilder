"use client";;
import {
  QrCode as QrCodePrimitive,
  useQrCode,
  useQrCodeContext,
} from "@ark-ui/react/qr-code";

import { cn } from "@/lib/utils";

const qrCodeLayoutStyle = (
  {
    size = 100,
    width,
    height
  }
) => {
  if (width !== undefined && height !== undefined) {
    return {
      "--qr-code-width": `${width}px`,
      "--qr-code-height": `${height}px`,
      "--qr-code-overlay-size": `calc(min(${width}px, ${height}px) / 3)`
    };
  }
  return {
    "--qr-code-size": `${size}px`,
    "--qr-code-overlay-size": "calc(var(--qr-code-size) / 3)"
  };
};

export const QrCode = ({
  className,
  size,
  width,
  height,
  style,
  ...props
}) => (
  <QrCodePrimitive.Root
    className={cn(
      "relative flex w-fit flex-col gap-2 text-foreground",
      className,
    )}
    data-slot="qr-code"
    style={{ ...qrCodeLayoutStyle({ size, width, height }), ...style }}
    {...props}
  />
);

export const QrCodeFrame = ({
  className,
  ...props
}) => (
  <QrCodePrimitive.Frame
    className={cn(
      "block h-(--qr-code-height,var(--qr-code-size)) w-(--qr-code-width,var(--qr-code-size)) max-w-full shrink-0 fill-current text-foreground",
      className,
    )}
    data-slot="qr-code-frame"
    {...props}
  />
);

export const QrCodePattern = ({
  className,
  ...props
}) => (
  <QrCodePrimitive.Pattern
    className={cn("fill-inherit", className)}
    data-slot="qr-code-pattern"
    {...props}
  />
);

export const QrCodeOverlay = ({
  className,
  ...props
}) => (
  <QrCodePrimitive.Overlay
    className={cn(
      "flex size-(--qr-code-overlay-size) items-center justify-center rounded-md bg-popover p-1",
      "[&_img]:size-full [&_img]:object-contain [&_svg]:size-full [&_svg]:object-contain",
      className,
    )}
    data-slot="qr-code-overlay"
    {...props}
  />
);

export const QrCodeDownloadTrigger = ({
  className,
  ...props
}) => (
  <QrCodePrimitive.DownloadTrigger
    className={cn(
      "inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md border-0 bg-muted px-3 font-medium text-foreground text-sm transition-[background-color,color] hover:bg-foreground hover:text-background",
      className,
    )}
    data-slot="qr-code-download-trigger"
    {...props}
  />
);

export const QrCodeRootProvider = ({
  className,
  size,
  width,
  height,
  style,
  ...props
}) => (
  <QrCodePrimitive.RootProvider
    className={cn(
      "relative flex w-fit flex-col gap-2 text-foreground",
      className,
    )}
    data-slot="qr-code-provider"
    style={{ ...qrCodeLayoutStyle({ size, width, height }), ...style }}
    {...props}
  />
);

export const QrCodeContext = QrCodePrimitive.Context;

export { useQrCode, useQrCodeContext };
