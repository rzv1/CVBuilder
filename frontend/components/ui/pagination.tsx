import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/frontend/lib/utils";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<"button">;

const PaginationLink = ({
  className,
  isActive,
  ...props
}: PaginationLinkProps) => (
  <button
    type="button"
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "inline-flex size-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:pointer-events-none disabled:opacity-50",
      isActive
        ? "bg-indigo-600 text-white shadow-xs shadow-indigo-600/30"
        : "text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent",
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cn("gap-1 px-2.5 w-auto border border-slate-700/80 bg-slate-900/60", className)}
    {...props}
  >
    <ChevronLeft className="size-4" />
    <span className="hidden sm:inline">Anterior</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    className={cn("gap-1 px-2.5 w-auto border border-slate-700/80 bg-slate-900/60", className)}
    {...props}
  >
    <span className="hidden sm:inline">Următor</span>
    <ChevronRight className="size-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex size-8 items-center justify-center text-slate-500", className)}
    {...props}
  >
    <MoreHorizontal className="size-4" />
    <span className="sr-only">Mai multe pagini</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export interface PaginationCompactProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function PaginationCompact({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationCompactProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl bg-slate-900/90 border border-slate-800 p-1 text-xs shadow-sm backdrop-blur-xs",
        className
      )}
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex size-7 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Pagina anterioară"
      >
        <ChevronLeft className="size-4" />
      </button>

      <span className="px-2 text-[11px] font-semibold text-slate-300 select-none">
        Pagina <strong className="text-white font-bold">{currentPage}</strong> din{" "}
        <strong className="text-white font-bold">{Math.max(1, totalPages)}</strong>
      </span>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex size-7 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Pagina următoare"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationCompact,
};
