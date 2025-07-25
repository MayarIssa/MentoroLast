"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssignedMentorsQuery } from "@/hooks/use-chat-assignments";
import { User, MessageCircle, Clock, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { parseImageUrl } from "@/lib/utils/parse-image-url";

export function ChatSidebar({
  activeAssignmentId,
  setActiveAssignmentId,
}: {
  activeAssignmentId: number | undefined;
  setActiveAssignmentId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
}) {
  const t = useTranslations("Chat");
  const { data: assignments, isPending: isAssignmentsPending } =
    useAssignedMentorsQuery();

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
            <Users className="text-primary h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">
              {t("ChatSidebar.heading")}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {assignments?.length ?? 0} {t("ChatSidebar.mentors")}
            </p>
          </div>
        </div>
      </CardHeader>

      <Separator />

      {/* Chat List */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="space-y-2 p-4">
            {isAssignmentsPending ? (
              <ChatSidebarSkeleton />
            ) : assignments && assignments.length > 0 ? (
              assignments.map((assignment, idx) => {
                const isActive = activeAssignmentId === assignment.id;

                return (
                  <Card
                    key={idx}
                    className={`cursor-pointer p-0 transition-all duration-200 hover:shadow-md ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setActiveAssignmentId(assignment.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={parseImageUrl(assignment.image)} />
                          <AvatarFallback
                            className={`text-sm ${
                              isActive
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center justify-between">
                            <h4
                              className={`truncate font-semibold ${
                                isActive
                                  ? "text-primary-foreground"
                                  : "text-foreground"
                              }`}
                            >
                              {assignment.name}
                            </h4>
                            <Badge
                              variant={isActive ? "secondary" : "outline"}
                              className="ml-2 shrink-0"
                            >
                              <MessageCircle className="mr-1 h-3 w-3" />
                              {t("ChatSidebar.new")}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <Clock className="h-3 w-3" />
                            <span
                              className={
                                isActive
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              }
                            >
                              {assignment.planTitle
                                ? `${t("ChatSidebar.plan")} ${
                                    assignment.planTitle
                                  }`
                                : t("ChatSidebar.active")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <Users className="text-muted-foreground h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-medium">
                  {t("ChatSidebar.noMentorsHeading")}
                </h3>
                <p className="text-muted-foreground max-w-sm text-sm">
                  {t("ChatSidebar.noMentorsDescription")}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </div>
  );
}

function ChatSidebarSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}
