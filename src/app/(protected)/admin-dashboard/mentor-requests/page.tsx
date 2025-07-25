"use client";

import { API } from "@/lib/api";
import { MentorRequestsView } from "./_components/mentor-requests-view";
import { Users, FileText, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";

export default function MentorRequestsPage() {
  const t = useTranslations("MentorRequestsPage");

  const { data: mentorRequests = [], isLoading } = useQuery({
    queryKey: ["mentor-requests"],
    queryFn: () => API.queries.admin.getMentorRequests(),
  });

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-primary/10 rounded-lg p-2">
            <FileText className="text-primary h-6 w-6" />
          </div>
          <div>
            <h1 className="text-foreground text-3xl font-bold">
              {t("heading")}
            </h1>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">{t("pending_label")}</span>
            <Badge
              variant="secondary"
              className="border-amber-200 bg-amber-50 text-amber-700"
            >
              {mentorRequests.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      {mentorRequests.length === 0 ? (
        <div className="py-12 text-center">
          <div className="bg-muted mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
            <Users className="text-muted-foreground h-10 w-10" />
          </div>
          <h3 className="text-foreground mb-2 text-lg font-semibold">
            {t("no_requests_title")}
          </h3>
          <p className="text-muted-foreground mx-auto max-w-md">
            {t("no_requests_description")}
          </p>
        </div>
      ) : (
        <MentorRequestsView requests={mentorRequests} />
      )}
    </div>
  );
}
