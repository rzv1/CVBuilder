"use client";;
import {
  Accordion as AccordionPrimitive,
  useAccordion,
} from "@ark-ui/react/accordion";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/frontend/lib/utils";

export const Accordion = ({
  className,
  ...props
}) => {
  return (
    <AccordionPrimitive.Root
      className={cn(
        "flex w-full data-[orientation=vertical]:flex-col data-[orientation=horizontal]:max-h-[calc(100vh-8rem)] data-[orientation=horizontal]:h-80 data-[orientation=horizontal]:flex-row",
        className,
      )}
      {...props}
    />
  );
};

export const AccordionItem = ({
  className,
  ...props
}) => {
  return (
    <AccordionPrimitive.Item
      className={cn(
        "[overflow-anchor:none] border-b border-border last:border-b-0 data-[orientation=horizontal]:flex data-[orientation=horizontal]:border-b-0 data-[orientation=horizontal]:border-e data-[orientation=horizontal]:last:border-e-0",
        className,
      )}
      {...props}
    />
  );
};

export const AccordionTrigger = ({
  className,
  children,
  indicator,
  ...props
}) => {
  return (
    <AccordionPrimitive.ItemTrigger
      className={cn(
        "flex w-full flex-1 cursor-pointer items-center justify-between gap-3 rounded-md border-none bg-transparent px-2 py-4 text-start font-medium text-sm leading-normal outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-64 data-[orientation=vertical]:min-h-10 data-[orientation=horizontal]:h-full data-[orientation=horizontal]:min-w-10 data-[orientation=horizontal]:[writing-mode:sideways-lr]",
        className,
      )}
      {...props}
    >
      {children}
      <AccordionPrimitive.ItemIndicator
        data-slot="accordion-indicator"
        className="inline-flex origin-center items-center justify-center text-foreground transition-transform duration-200 ease-out data-[state=open]:rotate-180 [&_svg]:size-[1.2em] data-[orientation=horizontal]:-rotate-90 data-[orientation=horizontal]:data-[state=open]:rotate-90"
      >
        {indicator || (
          <ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 opacity-80" />
        )}
      </AccordionPrimitive.ItemIndicator>
    </AccordionPrimitive.ItemTrigger>
  );
};

export const AccordionPanel = ({
  className,
  children,
  containerClassName,
  ...props
}) => {
  return (
    <AccordionPrimitive.ItemContent
      className={cn(
        "overflow-hidden rounded-lg text-muted-foreground text-sm [--radix-accordion-content-height:var(--height)] data-[orientation=vertical]:data-[state=open]:animate-accordion-down data-[orientation=vertical]:data-[state=closed]:animate-accordion-up data-[orientation=horizontal]:will-change-[width] data-[orientation=horizontal]:data-[state=open]:animate-[accordion-open-x_200ms_ease-out] data-[orientation=horizontal]:data-[state=closed]:animate-[accordion-close-x_200ms_ease-out] data-[orientation=horizontal]:*:whitespace-nowrap data-[orientation=horizontal]:[&>div]:pb-2.5",
        className,
      )}
      {...props}
    >
      <div className={cn("px-2 pt-0 pb-4 leading-normal", containerClassName)}>
        {children}
      </div>
    </AccordionPrimitive.ItemContent>
  );
};

export const AccordionContext = AccordionPrimitive.Context;

export const AccordionProvider = ({
  children,
  className,
  ...props
}) => {
  return (
    <AccordionPrimitive.RootProvider
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </AccordionPrimitive.RootProvider>
  );
};

export { useAccordion };
