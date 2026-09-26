"use client";;
import { DownloadTrigger as DownloadTriggerPrimitive } from "@ark-ui/react/download-trigger";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const DownloadTrigger = ({
  className,
  size = "default",
  variant = "default",
  ...props
}) => (
  <DownloadTriggerPrimitive
    className={cn(buttonVariants({ variant, size, className }))}
    data-slot="download-trigger"
    {...props}
  />
);
