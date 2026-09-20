"use client";;
import {
  Slider as SliderPrimitive,
  useSlider,
  useSliderContext,
} from "@ark-ui/react/slider";

import { cn } from "@/frontend/lib/utils";

export { useSlider, useSliderContext };

const normalizeValues = v => {
  if (v === undefined) {
    return undefined;
  }
  return typeof v === "number" ? [v] : v;
};

export const Slider = ({
  className,
  defaultValue,
  value,
  ...props
}) => (
  <SliderPrimitive.Root
    className={cn(
      "group/slider flex w-full flex-col gap-2 text-foreground",
      "data-disabled:opacity-50 data-invalid:text-destructive",
      className,
    )}
    data-slot="slider"
    defaultValue={normalizeValues(defaultValue)}
    value={normalizeValues(value)}
    {...props}
  />
);

export const SliderRootProvider = ({
  className,
  ...props
}) => (
  <SliderPrimitive.RootProvider
    className={cn(
      "group/slider flex w-full flex-col gap-2 text-foreground",
      "data-disabled:opacity-50 data-invalid:text-destructive",
      className,
    )}
    data-slot="slider-root-provider"
    {...props}
  />
);

export const SliderLabel = ({
  className,
  ...props
}) => (
  <SliderPrimitive.Label
    className={cn(
      "font-medium text-foreground text-sm leading-none select-none",
      className,
    )}
    data-slot="slider-label"
    {...props}
  />
);

export const SliderValueText = ({
  className,
  ...props
}) => (
  <SliderPrimitive.ValueText
    className={cn(
      "font-variant-numeric text-foreground text-sm tabular-nums",
      className,
    )}
    data-slot="slider-value-text"
    {...props}
  />
);

export const SliderValue = SliderValueText;

export const SliderControl = ({
  className,
  ...props
}) => (
  <SliderPrimitive.Control
    className={cn(
      "relative flex w-full touch-none select-none items-center py-1.5",
      "data-[orientation=vertical]:h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:py-0",
      className,
    )}
    data-slot="slider-control"
    {...props}
  />
);

export const SliderTrack = ({
  className,
  ...props
}) => (
  <SliderPrimitive.Track
    className={cn(
      "relative h-2 w-full grow overflow-hidden rounded-full bg-muted",
      "group-data-invalid/slider:bg-destructive/15 dark:group-data-invalid/slider:bg-destructive/24",
      "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2 data-[orientation=vertical]:shrink-0",
      className,
    )}
    data-slot="slider-track"
    {...props}
  />
);

export const SliderRange = ({
  className,
  ...props
}) => (
  <SliderPrimitive.Range
    className={cn(
      "absolute h-full rounded-full bg-primary",
      "group-data-invalid/slider:bg-destructive",
      "data-[orientation=vertical]:w-full",
      className,
    )}
    data-slot="slider-range"
    {...props}
  />
);

export const SliderThumb = ({
  className,
  ...props
}) => (
  <SliderPrimitive.Thumb
    className={cn(
      "relative block size-5 shrink-0 cursor-grab rounded-full border-2 border-primary bg-background shadow-sm outline-none",
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "group-data-invalid/slider:border-destructive group-data-invalid/slider:focus-visible:ring-destructive/24 dark:group-data-invalid/slider:focus-visible:ring-destructive/40",
      "data-dragging:cursor-grabbing",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      className,
    )}
    data-slot="slider-thumb"
    {...props}
  />
);

export const SliderHiddenInput = (props) => (
  <SliderPrimitive.HiddenInput data-slot="slider-hidden-input" {...props} />
);

export const SliderDraggingIndicator = ({
  className,
  style,
  ...props
}) => (
  <SliderPrimitive.DraggingIndicator
    className={cn(
      // Ark positions this element via `getDraggingIndicatorProps` (absolute + transform).
      // Only add visual styling + an extra offset via the `translate` property
      // (doesn't override `transform`).
      "pointer-events-none z-10 rounded-md bg-foreground px-2 py-1.5 font-medium text-background text-xs tabular-nums whitespace-nowrap shadow-sm",
      "data-[state=closed]:opacity-0",
      // Horizontal: above the thumb. Vertical: to the side of the thumb.
      "[translate:0_calc(-100%-8px)] data-[orientation=vertical]:[translate:calc(100%)_0]",
      className,
    )}
    data-slot="slider-dragging-indicator"
    style={style}
    {...props}
  />
);

export const SliderMarkerGroup = ({
  className,
  ...props
}) => (
  <SliderPrimitive.MarkerGroup
    className={cn(
      "mt-2 flex w-full justify-between px-0.5",
      "data-[orientation=vertical]:mt-0 data-[orientation=vertical]:h-full data-[orientation=vertical]:flex-col data-[orientation=vertical]:justify-between data-[orientation=vertical]:ps-3",
      className,
    )}
    data-slot="slider-marker-group"
    {...props}
  />
);

export const SliderMarker = ({
  className,
  ...props
}) => (
  <SliderPrimitive.Marker
    className={cn(
      "relative text-center text-muted-foreground text-xs",
      "before:absolute before:-top-2.5 before:left-1/2 before:size-1 before:-translate-x-1/2 before:rounded-full before:bg-border",
      "data-[state=at-value]:before:bg-primary data-[state=under-value]:before:bg-primary",
      className,
    )}
    data-slot="slider-marker"
    {...props}
  />
);

export const SliderContext = (props) => (
  <SliderPrimitive.Context {...props} />
);

export const SliderField = ({
  className,
  trackProps,
  rangeProps,
  thumbsProps,
  ...controlProps
}) => (
  <SliderControl className={className} {...controlProps}>
    <SliderTrack {...trackProps}>
      <SliderRange {...rangeProps} />
    </SliderTrack>
    <SliderThumbs>{thumbsProps?.children}</SliderThumbs>
  </SliderControl>
);

export const SliderThumbs = ({
  children
}) => (
  <SliderPrimitive.Context>
    {({ value }) =>
      value.map((_, index) => (
        <SliderThumb key={index} index={index}>
          {children?.(index)}
          <SliderHiddenInput />
        </SliderThumb>
      ))
    }
  </SliderPrimitive.Context>
);
