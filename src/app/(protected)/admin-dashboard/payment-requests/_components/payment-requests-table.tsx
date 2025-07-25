"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, CreditCard, User, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

type PaymentRequest = {
  acceptationOrRejectionDate: string;
  amount: number;
  consultantPlanId: number;
  consultantPlanTitle: string;
  customPlanId: number;
  customPlanTitle: string;
  id: number;
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

interface PaymentRequestsTableProps {
  requests: PaymentRequest[];
}

export function PaymentRequestsTable({ requests }: PaymentRequestsTableProps) {
  const t = useTranslations("PaymentRequestsTable");
  const [filter, setFilter] = useState<string>("all");

  const filteredRequests = requests.filter((request) => {
    if (filter === "all") return true;
    return request.status.toLowerCase() === filter;
  });

  const getStatusBadge = (status: string) => {
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
  };

  const getPlanTitle = (request: PaymentRequest) => {
    if (request.consultantPlanTitle) return request.consultantPlanTitle;
    if (request.customPlanTitle) return request.customPlanTitle;
    if (request.roadmapPlanTitle) return request.roadmapPlanTitle;
    return t("unknown_plan");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {t("title", { count: filteredRequests.length })}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              {t("filter_all")}
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
            >
              {t("filter_pending")}
            </Button>
            <Button
              variant={filter === "accepted" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("accepted")}
            >
              {t("filter_accepted")}
            </Button>
            <Button
              variant={filter === "rejected" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("rejected")}
            >
              {t("filter_rejected")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table_header_user")}</TableHead>
              <TableHead>{t("table_header_mentor")}</TableHead>
              <TableHead>{t("table_header_plan")}</TableHead>
              <TableHead>{t("table_header_amount")}</TableHead>
              <TableHead>{t("table_header_status")}</TableHead>
              <TableHead>{t("table_header_request_date")}</TableHead>
              <TableHead>{t("table_header_actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">{request.userName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{request.mentorName}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{getPlanTitle(request)}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">${request.amount}</span>
                </TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>
                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {new Date(request.requestDate).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin-dashboard/payment-requests/${request.id}`}
                  >
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-4 w-4" />
                      {t("view_button")}
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredRequests.length === 0 && (
          <div className="text-muted-foreground py-8 text-center">
            {t("no_requests")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
