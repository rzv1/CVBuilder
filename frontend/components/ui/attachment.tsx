import * as React from "react";
import { 
  FileText, 
  FileCode, 
  Image as ImageIcon, 
  File, 
  X, 
  Download, 
  Eye,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/frontend/lib/utils";

const attachmentVariants = cva(
  "group relative flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-2.5 transition-all hover:border-neutral-300 shadow-2xs",
  {
    variants: {
      variant: {
        default: "w-full max-w-sm",
        chip: "inline-flex w-auto py-1.5 px-3 rounded-lg text-xs",
        compact: "w-full max-w-xs p-2 text-xs",
      },
      status: {
        idle: "",
        uploading: "border-neutral-900/30 bg-neutral-50",
        success: "border-emerald-200 bg-emerald-50/50",
        error: "border-red-200 bg-red-50/50",
      },
    },
    defaultVariants: {
      variant: "default",
      status: "idle",
    },
  }
);

export interface AttachmentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof attachmentVariants> {
  name: string;
  size?: string;
  type?: "pdf" | "json" | "image" | "doc" | "default";
  progress?: number;
  onRemove?: () => void;
  onDownload?: () => void;
  onPreview?: () => void;
}

const Attachment = React.forwardRef<HTMLDivElement, AttachmentProps>(
  (
    {
      className,
      variant,
      status = "idle",
      name,
      size,
      type = "default",
      progress,
      onRemove,
      onDownload,
      onPreview,
      ...props
    },
    ref
  ) => {
    const renderIcon = () => {
      switch (type) {
        case "pdf":
          return <FileText className="size-5 text-red-500" />;
        case "json":
          return <FileCode className="size-5 text-blue-500" />;
        case "image":
          return <ImageIcon className="size-5 text-emerald-500" />;
        default:
          return <File className="size-5 text-neutral-400" />;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(attachmentVariants({ variant, status, className }))}
        {...props}
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 border border-neutral-200/80">
          {renderIcon()}
        </div>

        <div className="flex flex-1 flex-col min-w-0 pr-1">
          <span className="truncate text-xs font-semibold text-neutral-900">
            {name}
          </span>
          <div className="flex items-center gap-2 text-[10px] text-neutral-500">
            {size && <span>{size}</span>}
            {status === "uploading" && progress !== undefined && (
              <span className="text-neutral-900 font-medium">{progress}%</span>
            )}
            {status === "success" && (
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 className="size-3" /> Pregătit
              </span>
            )}
            {status === "error" && (
              <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                <AlertCircle className="size-3" /> Eroare
              </span>
            )}
          </div>

          {/* Progress bar if uploading */}
          {status === "uploading" && progress !== undefined && (
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full bg-neutral-900 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onPreview && (
            <button
              type="button"
              onClick={onPreview}
              title="Previzualizează"
              className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            >
              <Eye className="size-3.5" />
            </button>
          )}
          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              title="Descarcă"
              className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            >
              <Download className="size-3.5" />
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              title="Elimină"
              className="rounded-md p-1 text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }
);
Attachment.displayName = "Attachment";

export { Attachment, attachmentVariants };
