import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/frontend/lib/utils";

const messageVariants = cva("flex w-full gap-2.5 transition-opacity", {
  variants: {
    sender: {
      user: "justify-end flex-row-reverse",
      assistant: "justify-start flex-row",
      system: "justify-center",
    },
  },
  defaultVariants: {
    sender: "assistant",
  },
});

export interface MessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageVariants> {}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ className, sender, ...props }, ref) => (
    <div
      ref={ref}
      data-sender={sender}
      className={cn(messageVariants({ sender, className }))}
      {...props}
    />
  )
);
Message.displayName = "Message";

export interface MessageAvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const MessageAvatar = React.forwardRef<HTMLDivElement, MessageAvatarProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex size-7 shrink-0 items-center justify-center rounded-full mt-0.5", className)}
      {...props}
    />
  )
);
MessageAvatar.displayName = "MessageAvatar";

export interface MessageBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  sender?: "user" | "assistant" | "system";
}

const MessageBody = React.forwardRef<HTMLDivElement, MessageBodyProps>(
  ({ className, sender = "assistant", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-1 max-w-[85%] min-w-0",
        sender === "user" ? "items-end" : "items-start",
        sender === "system" && "max-w-full items-center text-center",
        className
      )}
      {...props}
    />
  )
);
MessageBody.displayName = "MessageBody";

const bubbleVariants = cva(
  "text-xs leading-relaxed px-3.5 py-2.5 rounded-2xl break-words shadow-sm transition-all",
  {
    variants: {
      variant: {
        user: "rounded-tr-none bg-neutral-900 text-white shadow-xs",
        assistant:
          "rounded-tl-none bg-white border border-neutral-200 text-neutral-900 shadow-2xs",
        system:
          "rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-600 text-[11px] px-3 py-1.5",
        ghost: "bg-transparent text-neutral-700 p-0 shadow-none",
      },
    },
    defaultVariants: {
      variant: "assistant",
    },
  }
);

export interface MessageBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bubbleVariants> {}

const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(bubbleVariants({ variant, className }))}
      {...props}
    />
  )
);
MessageBubble.displayName = "MessageBubble";

export interface MessageHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sender?: "user" | "assistant";
}

const MessageHeader = React.forwardRef<HTMLDivElement, MessageHeaderProps>(
  ({ className, sender, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 text-[11px] text-neutral-500 px-0.5",
        sender === "user" && "flex-row-reverse",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
MessageHeader.displayName = "MessageHeader";

export interface MessageActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const MessageActions = React.forwardRef<HTMLDivElement, MessageActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-wrap items-center gap-1.5 mt-1.5", className)}
      {...props}
    />
  )
);
MessageActions.displayName = "MessageActions";

export interface MessageTimestampProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

const MessageTimestamp = React.forwardRef<
  HTMLSpanElement,
  MessageTimestampProps
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-[10px] text-neutral-400 font-mono", className)}
    {...props}
  />
));
MessageTimestamp.displayName = "MessageTimestamp";

export {
  Message,
  MessageAvatar,
  MessageBody,
  MessageBubble,
  MessageHeader,
  MessageActions,
  MessageTimestamp,
  messageVariants,
  bubbleVariants,
};
