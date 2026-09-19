import * as React from "react";
import { cn } from "@/frontend/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-neutral-200/80",
        shimmer
          ? "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent"
          : "animate-pulse",
        className
      )}
      {...props}
    />
  );
}

function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-3 w-full rounded-sm",
            i === lines - 1 && "w-3/5"
          )}
        />
      ))}
    </div>
  );
}

function SkeletonAvatar({
  size = "default",
  className,
}: {
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "size-7 rounded-lg",
    default: "size-9 rounded-xl",
    lg: "size-12 rounded-2xl",
  };

  return <Skeleton className={cn(sizeClasses[size], className)} />;
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <SkeletonAvatar size="default" />
        <div className="flex flex-col gap-1.5 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard };
