"use client";

import { useChat } from "@/hooks/use-chat";
import { useChatMessages } from "@/hooks/use-chat-messages";
import { ChatList } from "./chat-list";
import { ChatSidebar } from "./chat-sidebar";
import { useEffect, useState } from "react";
import { ChatInputBox } from "./chat-input";
import { Spinner } from "@/components/spinner";
import { useAssignedMentorsQuery } from "@/hooks/use-chat-assignments";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Users, Wifi, WifiOff } from "lucide-react";

export function Chat({
  token,
  currentUserId,
}: {
  token: string;
  currentUserId: string;
}) {
  const t = useTranslations("Chat");
  const [activeAssignmentId, setActiveAssignmentId] = useState<number>();
  const { connection, isConnecting, connectionError } = useChat({
    token,
    activeAssignmentId,
  });
  const { data: assignments } = useAssignedMentorsQuery();
  const { data: chatMessages, isPending: areMessagesPending } =
    useChatMessages(activeAssignmentId);

  useEffect(() => {
    if (
      assignments &&
      assignments.length > 0 &&
      activeAssignmentId === undefined &&
      assignments[0]
    ) {
      setActiveAssignmentId(assignments[0].id);
    }
  }, [assignments, activeAssignmentId]);

  const selectedAssignment = assignments?.find(
    (assignment) => assignment.id === activeAssignmentId,
  );

  if (!connection) {
    return (
      <Card className="flex h-[calc(100vh-16rem)] items-center justify-center border-0">
        <CardContent className="flex flex-col items-center gap-4">
          <Spinner size="page" />
          <p className="text-muted-foreground text-sm">
            {t("Chat.connecting")}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (connectionError) {
    return (
      <Card className="border-destructive/20 flex h-[calc(100vh-16rem)] items-center justify-center">
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <WifiOff className="text-destructive h-12 w-12" />
          <div>
            <h3 className="text-destructive mb-2 text-lg font-semibold">
              {t("Chat.connectionError")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("Chat.errorPrefix")} {connectionError}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid h-[calc(100vh-16rem)] grid-cols-3 gap-6">
      {/* Sidebar */}
      <Card className="col-span-1 flex flex-col overflow-hidden">
        <ChatSidebar
          activeAssignmentId={activeAssignmentId}
          setActiveAssignmentId={setActiveAssignmentId}
        />
      </Card>

      {/* Main Chat Area */}
      <Card className="col-span-2 flex flex-col overflow-hidden p-0">
        {activeAssignmentId ? (
          <>
            {/* Chat Header */}
            <CardHeader className="border-b pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <MessageCircle className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {selectedAssignment?.name ?? t("Chat.defaultHeading")}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {chatMessages?.length ?? 0} {t("Chat.messages")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={isConnecting ? "secondary" : "default"}
                    className="flex items-center gap-1"
                  >
                    <Wifi className="h-3 w-3" />
                    {isConnecting
                      ? t("Chat.connectingBadge")
                      : t("Chat.connectedBadge")}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            {/* Chat Messages */}
            <CardContent className="flex-1 overflow-hidden p-0">
              <ChatList
                messages={chatMessages ?? []}
                isConnecting={isConnecting || areMessagesPending}
                currentUserId={currentUserId}
              />
            </CardContent>

            <Separator />

            {/* Chat Input */}
            <CardFooter className="block">
              <ChatInputBox
                connection={connection}
                activeAssignmentId={activeAssignmentId}
              />
            </CardFooter>
          </>
        ) : (
          <CardContent className="flex h-full flex-col items-center justify-center">
            <div className="max-w-md text-center">
              <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Users className="text-muted-foreground h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                {t("Chat.selectChatHeading")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("Chat.selectChatDescription")}
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
