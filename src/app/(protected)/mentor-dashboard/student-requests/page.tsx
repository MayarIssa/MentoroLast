"use client";

import { Spinner } from "@/components/spinner";
import { API } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Inbox, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { RequestCard } from "./_components/request-card";

export default function StudentRequests() {
  const t = useTranslations("StudentRequests");

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["student-requests"],
    queryFn: () => API.queries.mentors.getRequestsToMentor(),
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <Inbox className="size-8" />
          <h1 className="text-3xl font-bold">{t("heading")}</h1>
        </div>

        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {requests.length === 0 ? (
        <div className="py-12 text-center">
          <User className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <p className="text-muted-foreground text-lg">{t("no_requests")}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {requests.map((request, index) => (
            <RequestCard
              key={`${request.studentName}-${request.planTitle}-${index}`}
              request={request}
            />
          ))}
        </div>
      )}
    </div>
  );
}
