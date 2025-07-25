"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Complaint } from "@/lib/api/queries/complaints";
import { format } from "date-fns";
import {
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  AlertCircle,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

function getStatusBadge(
  status: string,
  t: ReturnType<typeof useTranslations<"StudentComplaints">>,
) {
  switch (status.toLowerCase()) {
    case "pending":
      return (
        <Badge
          variant="secondary"
          className="border-amber-200 bg-amber-50 text-amber-700"
        >
          <AlertCircle className="mr-1 h-3 w-3" />
          {t("status.pending")}
        </Badge>
      );
    case "resolved":
      return (
        <Badge
          variant="secondary"
          className="border-green-200 bg-green-50 text-green-700"
        >
          {t("status.resolved")}
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          variant="secondary"
          className="border-red-200 bg-red-50 text-red-700"
        >
          {t("status.rejected")}
        </Badge>
      );
    case "in progress":
      return (
        <Badge
          variant="secondary"
          className="border-blue-200 bg-blue-50 text-blue-700"
        >
          {t("status.in_progress")}
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export function ComplaintList({ complaints }: { complaints: Complaint[] }) {
  const t = useTranslations("StudentComplaints");
  const dir = useLocale() === "ar" ? "rtl" : "ltr";

  return (
    <div className="grid gap-4 lg:grid-cols-2" dir={dir}>
      {complaints.map((complaint) => (
        <Card
          key={complaint.id}
          className="transition-all duration-200 hover:shadow-lg"
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                  <FileTextIcon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {t("complaintTitle", { id: complaint.id })}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <CalendarIcon className="stroke-primary h-4 w-4" />
                    {format(
                      new Date(complaint.createdAt),
                      "dd/MM/yyyy 'at' HH:mm",
                    )}
                  </CardDescription>
                </div>
              </div>
              {getStatusBadge(complaint.status, t)}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* User Information */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="mb-2 flex items-center gap-2">
                <UserIcon className="text-primary h-4 w-4" />
                <span className="text-sm font-medium">{t("filedBy")}</span>
              </div>
              <p className="text-sm font-semibold">{complaint.userName}</p>
              <p className="text-muted-foreground text-xs">
                {t("userId", { id: complaint.userId })}
              </p>
            </div>

            {/* Complaint Content */}
            <div className="space-y-2">
              <h4 className="text-foreground text-sm font-medium">
                {t("complaintDetails")}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {complaint.content}
              </p>
            </div>

            {/* Notes Section */}
            {complaint.notes && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-foreground text-sm font-medium">
                    {t("notes")}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {complaint.notes}
                  </p>
                </div>
              </>
            )}

            {/* Rejection Reason */}
            {complaint.resonOfRejection &&
              complaint.status.toLowerCase() === "rejected" && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-red-600">
                      {t("rejectionReason")}
                    </h4>
                    <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">
                      {complaint.resonOfRejection}
                    </p>
                  </div>
                </>
              )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
