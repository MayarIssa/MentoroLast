"use client";

import { Spinner } from "@/components/spinner";
import {
  ChatBubble,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import type { Message } from "@/lib/types/chat";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { useTranslations } from "next-intl";

function getMessageVariant(
  message: Message,
  currentUserId: string | undefined,
) {
  if (!currentUserId) {
    console.warn("currentUserId is undefined, defaulting to received");
    return "received";
  }
  return message.senderUserId === currentUserId ? "sent" : "received";
}

function formatMessageTime(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function ChatList({
  messages,
  isConnecting,
  className,
  currentUserId,
}: {
  messages: Message[];
  isConnecting: boolean;
  className?: string;
  currentUserId: string | undefined;
}) {
  const t = useTranslations("Chat");
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {isConnecting ? (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <p className="text-muted-foreground text-sm">
              {t("ChatList.loading")}
            </p>
          </div>
        </div>
      ) : (
        <ChatMessageList className="flex-1" smooth>
          {messages.map((message, idx) => {
            const variant = getMessageVariant(message, currentUserId);
            const isCurrentUser = variant === "sent";

            return (
              <div
                key={`message-${message.id}-${idx}`}
                className={cn(
                  "flex max-w-[85%] items-end gap-2",
                  isCurrentUser ? "ml-auto flex-row-reverse" : "mr-auto",
                )}
              >
                {/* Avatar */}
                <Avatar className="mb-1 h-8 w-8">
                  <AvatarFallback
                    className={cn(
                      "text-xs",
                      isCurrentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted",
                    )}
                  >
                    {isCurrentUser ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>

                {/* Message Bubble */}
                <div className="flex flex-col gap-1">
                  <ChatBubble variant={variant} className="max-w-full">
                    <ChatBubbleMessage
                      variant={variant}
                      className={cn(
                        "text-sm leading-relaxed",
                        isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground bg-zinc-900",
                      )}
                    >
                      {message.message}
                    </ChatBubbleMessage>
                  </ChatBubble>

                  {/* Timestamp */}
                  <p
                    className={cn(
                      "text-muted-foreground px-1 text-xs",
                      isCurrentUser ? "text-right" : "text-left",
                    )}
                  >
                    {formatMessageTime(message.sentAt)}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Bot className="text-muted-foreground h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-medium">
                {t("ChatList.noMessages")}
              </h3>
              <p className="text-muted-foreground max-w-sm text-sm">
                {t("ChatList.startConversation")}
              </p>
            </div>
          )}
        </ChatMessageList>
      )}
    </div>
  );
}
