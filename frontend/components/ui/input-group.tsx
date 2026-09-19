import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/frontend/lib/utils";

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, size = "default", children, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 text-xs",
      default: "h-9 text-sm",
      lg: "h-10 text-base",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full items-center rounded-lg border border-slate-700 bg-slate-950 px-2.5 shadow-xs transition-colors",
          "focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50",
          "hover:border-slate-600",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
InputGroup.displayName = "InputGroup";

export interface InputGroupAddonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  placement?: "inline-start" | "inline-end";
}

const InputGroupAddon = React.forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className, placement = "inline-start", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex shrink-0 items-center justify-center text-slate-400 select-none [&_svg]:size-4",
          placement === "inline-start" ? "mr-2" : "ml-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
InputGroupAddon.displayName = "InputGroupAddon";

export interface InputGroupInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  InputGroupInputProps
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex-1 min-w-0 bg-transparent py-1 text-slate-100 placeholder:text-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
InputGroupInput.displayName = "InputGroupInput";

export interface InputGroupButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  InputGroupButtonProps
>(({ className, type = "button", ...props }, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md text-xs font-semibold px-2 py-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus:outline-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
InputGroupButton.displayName = "InputGroupButton";

export interface InputGroupClearProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClear: () => void;
  visible?: boolean;
}

const InputGroupClear = React.forwardRef<
  HTMLButtonElement,
  InputGroupClearProps
>(({ className, onClear, visible = true, ...props }, ref) => {
  if (!visible) return null;

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClear}
      aria-label="Clear input"
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-1 focus:outline-none",
        className
      )}
      {...props}
    >
      <X className="size-3" />
    </button>
  );
});
InputGroupClear.displayName = "InputGroupClear";

export {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
  InputGroupClear,
};
