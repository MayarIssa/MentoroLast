"use client";

import {
  useAdminComplaints,
  useAcceptComplaintMutation,
  useRejectComplaintMutation,
  useDeleteComplaintMutation,
  useArchivedComplaints,
} from "@/hooks/use-admin-complaints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Archive } from "lucide-react";
import { Spinner } from "@/components/spinner";
import { ComplaintsTable } from "./components";
import { useTranslations } from "next-intl";

export default function ComplaintsPage() {
  const { data: complaints, isLoading, error } = useAdminComplaints();
  const {
    data: archivedComplaints,
    isLoading: isArchivedComplaintsLoading,
    error: archivedComplaintsError,
  } = useArchivedComplaints();

  const acceptMutation = useAcceptComplaintMutation();
  const rejectMutation = useRejectComplaintMutation();
  const deleteMutation = useDeleteComplaintMutation();
  const t = useTranslations("AdminComplaints");

  const handleAccept = async (id: number) => {
    try {
      await acceptMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error accepting complaint:", error);
    }
  };

  const handleReject = async (id: number, notes: string) => {
    try {
      await rejectMutation.mutateAsync({
        id,
        notes,
      });
    } catch (error) {
      console.error("Error rejecting complaint:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  if (isLoading || isArchivedComplaintsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error || archivedComplaintsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {t("errorTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t("errorDescription")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            <AlertCircle /> {t("active")} ({complaints?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="archived">
            <Archive /> {t("archived")} ({archivedComplaints?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <ComplaintsTable
            title={t("active")}
            description={t("activeDescription")}
            complaints={complaints}
            onAccept={handleAccept}
            onReject={handleReject}
            onDelete={handleDelete}
            showActions={true}
          />
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          <ComplaintsTable
            title={t("archived")}
            description={t("archivedDescription")}
            complaints={archivedComplaints}
            onAccept={handleAccept}
            onReject={handleReject}
            onDelete={handleDelete}
            showActions={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
