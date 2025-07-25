"use client";

import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Send, Smile, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import type { HubConnection } from "@microsoft/signalr";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function ChatInputBox({
  connection,
  activeAssignmentId,
}: {
  connection: HubConnection;
  activeAssignmentId: number;
}) {
  const t = useTranslations("Chat");
  const [isLoading, setIsLoading] = useState(false);
  const sendMessageSchema = z.object({
    message: z.string().min(1, t("ChatInputBox.emptyMessageError")),
  });

  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof sendMessageSchema>) {
    if (isLoading) return;

    try {
      setIsLoading(true);
      form.setValue("message", "");
      await connection.invoke(
        "SendMessage",
        activeAssignmentId,
        values.message,
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      // Restore the message if sending failed
      form.setValue("message", values.message);
    } finally {
      setIsLoading(false);
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void form.handleSubmit(onSubmit)();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const currentMessage = form.getValues("message");
    form.setValue("message", currentMessage + emoji);
  };

  const messageValue = form.watch("message");
  const isMessageEmpty = !messageValue?.trim();

  return (
    <div className="pb-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-3"
        >
          {/* Additional Actions */}
          <div className="flex gap-1 pb-2">
            <EmojiPicker onEmojiSelect={handleEmojiSelect}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hover:bg-muted h-9 w-9 rounded-full"
                disabled={isLoading}
              >
                <Smile className="h-4 w-4" />
              </Button>
            </EmojiPicker>
          </div>

          {/* Message Input */}
          <div className="flex-1">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <ChatInput
                  placeholder={t("ChatInputBox.messagePlaceholder")}
                  className="bg-muted/50 focus-visible:ring-primary/20 focus-visible:border-primary max-h-32 min-h-[60px] resize-none rounded-2xl border-2 px-4 py-3 text-base transition-all focus-visible:ring-2"
                  {...field}
                  onKeyDown={onKeyDown}
                  disabled={isLoading}
                />
              )}
            />
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            size="icon"
            className="bg-primary hover:bg-primary/90 h-12 w-12 rounded-full transition-all disabled:opacity-50"
            disabled={isMessageEmpty || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </Form>

      {/* Helper text */}
      <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
        <span>{t("ChatInputBox.helperText")}</span>
        <span className={messageValue?.length > 500 ? "text-destructive" : ""}>
          {messageValue?.length || 0}/1000
        </span>
      </div>
    </div>
  );
}
