"use client";

import { API } from "@/lib/api";
import { PaymentRequestsView } from "./_components/payment-requests-view";
import { CreditCard, FileText, Clock, Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";

export default function PaymentRequestsPage() {
  const t = useTranslations("PaymentRequestsPage");

  const { data: paymentRequests = [], isLoading } = useQuery({
    queryKey: ["payment-requests"],
    queryFn: () => API.queries.admin.getPaymentRequests(),
  });
  const { data: archivedPayments = [], isLoading: isArchivedPaymentsLoading } =
    useQuery({
      queryKey: ["archived-payments"],
      queryFn: () => API.queries.admin.getArchivedPayments(),
    });
  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-primary/10 rounded-lg p-2">
            <CreditCard className="text-primary h-6 w-6" />
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
              {paymentRequests.filter((req) => req.status === "Pending").length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">{t("total_label")}</span>
            <Badge
              variant="secondary"
              className="border-green-200 bg-green-50 text-green-700"
            >
              {paymentRequests.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Archive className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">{t("archived_label")}</span>
            <Badge
              variant="secondary"
              className="border-blue-200 bg-blue-50 text-blue-700"
            >
              {archivedPayments.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t("current_tab")}
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            {t("archived_tab")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-6">
          {paymentRequests.length === 0 ? (
            <div className="py-12 text-center">
              <div className="bg-muted mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
                <CreditCard className="text-muted-foreground h-10 w-10" />
              </div>
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                {t("no_requests_title")}
              </h3>
              <p className="text-muted-foreground mx-auto max-w-md">
                {t("no_requests_description")}
              </p>
            </div>
          ) : (
            <PaymentRequestsView requests={paymentRequests} />
          )}
        </TabsContent>

        <TabsContent value="archived" className="mt-6">
          {isArchivedPaymentsLoading ? (
            <div className="py-12 text-center">
              <div className="text-muted-foreground">
                {t("loading_archived")}
              </div>
            </div>
          ) : archivedPayments.length === 0 ? (
            <div className="py-12 text-center">
              <div className="bg-muted mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
                <Archive className="text-muted-foreground h-10 w-10" />
              </div>
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                {t("no_archived_requests_title")}
              </h3>
              <p className="text-muted-foreground mx-auto max-w-md">
                {t("no_archived_requests_description")}
              </p>
            </div>
          ) : (
            <PaymentRequestsView requests={archivedPayments} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
