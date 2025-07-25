"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Check,
  CreditCard,
  User,
  Building,
  Calendar,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { API } from "@/lib/api";
import { useTranslations } from "next-intl";
import type { useTranslations as useTranslationsType } from "next-intl";
import { RejectForm } from "./reject-form";

type PaymentRequest = {
  id: number;
  amount: number;
  consultantPlanId: number;
  consultantPlanTitle: string;
  customPlanId: number;
  customPlanTitle: string;
  image: string;
  imagePath: string;
  mentorId: number;
  mentorName: string;
  notes: string;
  requestDate: string;
  resevationAccount: string;
  roadmapPlanId: number;
  roadmapPlanTitle: string;
  senderAccount: string;
  status: string;
  userId: string;
  userName: string;
};

interface PaymentRequestDetailsProps {
  request: PaymentRequest;
}

function getStatusBadge(
  status: string,
  t: ReturnType<typeof useTranslationsType<"PaymentRequestDetails">>,
) {
  switch (status.toLowerCase()) {
    case "pending":
      return (
        <Badge
          variant="secondary"
          className="border-amber-200 bg-amber-50 text-amber-700"
        >
          {t("status.pending")}
        </Badge>
      );
    case "accepted":
      return (
        <Badge
          variant="secondary"
          className="border-green-200 bg-green-50 text-green-700"
        >
          {t("status.accepted")}
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
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getPlanTitle(
  request: PaymentRequest,
  t: ReturnType<typeof useTranslationsType<"PaymentRequestDetails">>,
) {
  if (request.consultantPlanTitle) return request.consultantPlanTitle;
  if (request.customPlanTitle) return request.customPlanTitle;
  if (request.roadmapPlanTitle) return request.roadmapPlanTitle;
  return t("unknown_plan");
}

export function PaymentRequestDetails({ request }: PaymentRequestDetailsProps) {
  const t = useTranslations("PaymentRequestDetails");
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await API.mutations.admin.acceptPaymentRequest(request.id);
      toast.success(t("accept_success_toast"));
      router.refresh();
    } catch {
      toast.error(t("accept_error_toast"));
    } finally {
      setIsAccepting(false);
    }
  };

  const isPending = request.status.toLowerCase() === "pending";

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-foreground text-3xl font-bold">
              {t("heading", { id: request.id })}
            </h1>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>

          {isPending && (
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Check className="mr-2 h-4 w-4" />
                    {t("accept_button")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t("accept_dialog_title")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("accept_dialog_description")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel_button")}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleAccept}
                      disabled={isAccepting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isAccepting
                        ? t("accepting_button")
                        : t("accept_final_button")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <RejectForm requestId={request.id} />
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t("payment_details_title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    {t("amount_label")}
                  </label>
                  <p className="text-foreground text-2xl font-bold">
                    ${request.amount}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    {t("status_label")}
                  </label>
                  <div className="mt-1">
                    {getStatusBadge(request.status, t)}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t("plan_label")}
                </label>
                <p className="font-medium">{getPlanTitle(request, t)}</p>
              </div>
            </CardContent>
          </Card>

          {/* User & Mentor Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("user_info_title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    {t("user_name_label")}
                  </label>
                  <p className="font-medium">{request.userName}</p>
                  <p className="text-muted-foreground text-sm">
                    {t("id_label")} {request.userId}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    {t("mentor_label")}
                  </label>
                  <p className="font-medium">{request.mentorName}</p>
                  <p className="text-muted-foreground text-sm">
                    {t("id_label")} {request.mentorId}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {t("bank_info_title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    {t("sender_account_label")}
                  </label>
                  <p className="font-mono text-sm">{request.senderAccount}</p>
                </div>
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    {t("recipient_account_label")}
                  </label>
                  <p className="font-mono text-sm">
                    {request.resevationAccount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {request.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t("notes_title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{request.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t("timeline_title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t("request_date_label")}
                </label>
                <p className="text-sm">
                  {new Date(request.requestDate).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Proof */}
          {request.image && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  {t("payment_proof_title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                  <Image
                    src={request.imagePath}
                    alt={t("payment_proof_alt")}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
