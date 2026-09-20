"use client";;
import { Avatar as AvatarPrimitive } from "@ark-ui/react/avatar";
import { ark } from "@ark-ui/react/factory";

import { cn } from "@/frontend/lib/utils";

export const Avatar = ({
  className,
  radius = "full",
  size = "default",
  ...props
}) => (
  <AvatarPrimitive.Root
    data-radius={radius}
    data-slot="avatar"
    data-size={size}
    className={cn(
      "group/avatar relative flex size-8 shrink-0 overflow-hidden select-none after:absolute after:inset-0 after:border after:border-border after:mix-blend-darken data-[radius=full]:rounded-full data-[radius=full]:after:rounded-full data-[radius=lg]:rounded-lg data-[radius=lg]:after:rounded-lg data-[radius=md]:rounded-md data-[radius=md]:after:rounded-md data-[radius=none]:rounded-none data-[radius=none]:after:rounded-none data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
      className,
    )}
    {...props}
  />
);

export const AvatarImage = ({
  className,
  ...props
}) => (
  <AvatarPrimitive.Image
    data-slot="avatar-image"
    className={cn("size-full object-cover", className)}
    {...props}
  />
);

export const AvatarFallback = ({
  className,
  ...props
}) => (
  <AvatarPrimitive.Fallback
    data-slot="avatar-fallback"
    className={cn(
      "flex size-full items-center justify-center bg-muted text-sm text-muted-foreground group-data-[radius=full]/avatar:rounded-full group-data-[radius=lg]/avatar:rounded-lg group-data-[radius=md]/avatar:rounded-md group-data-[radius=none]/avatar:rounded-none group-data-[size=sm]/avatar:text-xs",
      className,
    )}
    {...props}
  />
);

export const AvatarBadge = ({
  className,
  ...props
}) => (
  <ark.span
    data-slot="avatar-badge"
    className={cn(
      "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none",
      "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
      "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
      "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
      className,
    )}
    {...props}
  />
);

export const AvatarGroup = ({
  className,
  ...props
}) => (
  <ark.div
    data-slot="avatar-group"
    className={cn(
      "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
      className,
    )}
    {...props}
  />
);

export const AvatarGroupCount = ({
  className,
  ...props
}) => (
  <ark.div
    data-slot="avatar-group-count"
    className={cn(
      "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
      className,
    )}
    {...props}
  />
);
