"use client";;
import { Pagination as PaginationPrimitive } from "@ark-ui/react/pagination";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Pagination = ({
  className,
  ...props
}) => (
  <PaginationPrimitive.Root
    className={cn("flex flex-wrap items-center gap-1.5", className)}
    data-slot="pagination"
    {...props}
  />
);

export const PaginationRootProvider = ({
  ...props
}) => (
  <PaginationPrimitive.RootProvider
    data-slot="pagination-root-provider"
    {...props}
  />
);

export const PaginationPrevTrigger = ({
  ...props
}) => (
  <PaginationPrimitive.PrevTrigger
    data-slot="pagination-prev-trigger"
    {...props}
  />
);

export const PaginationNextTrigger = ({
  ...props
}) => (
  <PaginationPrimitive.NextTrigger
    data-slot="pagination-next-trigger"
    {...props}
  />
);

export const PaginationFirstTrigger = ({
  ...props
}) => (
  <PaginationPrimitive.FirstTrigger
    data-slot="pagination-first-trigger"
    {...props}
  />
);

export const PaginationLastTrigger = ({
  ...props
}) => (
  <PaginationPrimitive.LastTrigger
    data-slot="pagination-last-trigger"
    {...props}
  />
);

export const PaginationItem = ({
  ...props
}) => (
  <PaginationPrimitive.Item data-slot="pagination-item" {...props} />
);

export const PaginationEllipsis = ({
  className,
  children,
  ...props
}) => (
  <PaginationPrimitive.Ellipsis
    className={cn(
      "inline-flex h-9 min-w-9 items-center justify-center px-1 text-muted-foreground text-sm sm:h-8",
      className,
    )}
    data-slot="pagination-ellipsis"
    {...props}
  >
    {children ? children : "…"}
  </PaginationPrimitive.Ellipsis>
);

export const PaginationContext = (props) => (
  <PaginationPrimitive.Context {...props} />
);

export const PaginationItems = ({
  size = "icon",
  variant = "ghost",
  itemType = "button"
}) => {
  return (
    <PaginationContext>
      {(pagination) =>
        pagination.pages.map((page, index) =>
          page.type === "page" ? (
            <PaginationItem key={index} {...page}>
              {itemType === "button" ? (
                <Button
                  size={size}
                  variant={
                    pagination?.page === page.value ? "outline" : variant
                  }
                >
                  {page.value}
                </Button>
              ) : (
                <a
                  key={index}
                  className={buttonVariants({ size, variant })}
                  {...pagination.getItemProps(page)}
                >
                  {page.value}
                </a>
              )}
            </PaginationItem>
          ) : (
            <PaginationEllipsis key={index} index={index} />
          ),
        )
      }
    </PaginationContext>
  );
};

export { usePagination, usePaginationContext } from "@ark-ui/react/pagination";
