import * as React from "react";
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X 
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/frontend/lib/utils";

type ToastVariant = "default" | "success" | "destructive" | "warning" | "info";

export interface ToastItem {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: ToastItem[];
  toast: (options: Omit<ToastItem, "id">) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

let toastCount = 0;
let globalToastFn: ((options: Omit<ToastItem, "id">) => string) | null = null;

export function toast(options: Omit<ToastItem, "id">) {
  if (globalToastFn) {
    return globalToastFn(options);
  }
  return "";
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = React.useCallback(
    (options: Omit<ToastItem, "id">) => {
      const id = String(++toastCount);
      const newToast: ToastItem = {
        ...options,
        id,
        duration: options.duration ?? 4000,
      };

      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, newToast.duration);
      }

      return id;
    },
    [dismiss]
  );

  React.useEffect(() => {
    globalToastFn = addToast;
    return () => {
      globalToastFn = null;
    };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, toast: addToast, dismiss }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    return {
      toast,
      dismiss: () => {},
      toasts: [],
    };
  }
  return context;
}

const toastVariants = cva(
  "pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-200",
  {
    variants: {
      variant: {
        default:
          "border-slate-800 bg-slate-900/95 text-slate-100 shadow-slate-950/50",
        success:
          "border-emerald-500/40 bg-slate-900/95 text-slate-100 shadow-emerald-950/30",
        destructive:
          "border-rose-500/40 bg-slate-900/95 text-slate-100 shadow-rose-950/30",
        warning:
          "border-amber-500/40 bg-slate-900/95 text-slate-100 shadow-amber-950/30",
        info:
          "border-blue-500/40 bg-slate-900/95 text-slate-100 shadow-blue-950/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-md w-full">
      {toasts.map((t) => {
        const renderIcon = () => {
          switch (t.variant) {
            case "success":
              return <CheckCircle2 className="size-4.5 text-emerald-400 shrink-0 mt-0.5" />;
            case "destructive":
              return <AlertCircle className="size-4.5 text-rose-400 shrink-0 mt-0.5" />;
            case "warning":
              return <AlertTriangle className="size-4.5 text-amber-400 shrink-0 mt-0.5" />;
            case "info":
              return <Info className="size-4.5 text-blue-400 shrink-0 mt-0.5" />;
            default:
              return <Info className="size-4.5 text-slate-400 shrink-0 mt-0.5" />;
          }
        };

        return (
          <div
            key={t.id}
            className={cn(toastVariants({ variant: t.variant }))}
          >
            {renderIcon()}
            <div className="flex-1 min-w-0 pr-2">
              {t.title && (
                <div className="text-xs font-bold text-slate-100">
                  {t.title}
                </div>
              )}
              {t.description && (
                <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  {t.description}
                </div>
              )}
              {t.action && (
                <button
                  type="button"
                  onClick={t.action.onClick}
                  className="mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                >
                  {t.action.label}
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="rounded-md p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export { toastVariants };
