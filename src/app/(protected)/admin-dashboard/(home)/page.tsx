"use client";

import { API } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  Users,
  CreditCard,
  Activity,
  TrendingUp,
  Clock,
  DollarSign,
  FileText,
  User,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";

export default function AdminPage() {
  const t = useTranslations("AdminPage");

  const { data: paymentRequests = [], isLoading: isLoadingPayments } = useQuery(
    {
      queryKey: ["payment-requests"],
      queryFn: () => API.queries.admin.getPaymentRequests(),
    },
  );

  const { data: mentorRequests = [], isLoading: isLoadingMentors } = useQuery({
    queryKey: ["mentor-requests"],
    queryFn: () => API.queries.admin.getMentorRequests(),
  });

  if (isLoadingPayments || isLoadingMentors) {
    return <div>{t("loading")}</div>;
  }

  // Calculate statistics
  const totalPaymentRequests = paymentRequests.length;
  const pendingPaymentRequests = paymentRequests.filter(
    (req) => req.status === "Pending",
  ).length;
  const totalPaymentAmount = paymentRequests.reduce(
    (sum, req) => sum + req.amount,
    0,
  );
  const totalMentorRequests = mentorRequests.length;

  // Get recent activities (last 5 payment requests)
  const recentPaymentRequests = paymentRequests
    .sort(
      (a, b) =>
        new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime(),
    )
    .slice(0, 5);

  const recentMentorRequests = mentorRequests.slice(0, 3);

  return (
    <div className="container mx-auto space-y-8 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-primary/10 rounded-lg p-2">
            <Home className="text-primary h-6 w-6" />
          </div>
          <div>
            <h1 className="text-foreground text-3xl font-bold">
              {t("heading")}
            </h1>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("payment_requests_card_title")}
            </CardTitle>
            <CreditCard className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPaymentRequests}</div>
            <p className="text-muted-foreground text-xs">
              {t("payment_requests_pending", { count: pendingPaymentRequests })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("mentor_requests_card_title")}
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMentorRequests}</div>
            <p className="text-muted-foreground text-xs">
              {t("mentor_requests_description")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("total_requested_amount_card_title")}
            </CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalPaymentAmount.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              {t("total_requested_amount_description")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("system_activity_card_title")}
            </CardTitle>
            <Activity className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingPaymentRequests + totalMentorRequests}
            </div>
            <p className="text-muted-foreground text-xs">
              {t("system_activity_description")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t("quick_actions_title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link href="/admin-dashboard/payment-requests">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                {t("review_payment_requests_button")}
                {pendingPaymentRequests > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {pendingPaymentRequests}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href="/admin-dashboard/mentor-requests">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                {t("review_mentor_applications_button")}
                {totalMentorRequests > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {totalMentorRequests}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Payment Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t("recent_payment_requests_title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentPaymentRequests.length === 0 ? (
              <div className="py-6 text-center">
                <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <CreditCard className="text-muted-foreground h-6 w-6" />
                </div>
                <p className="text-muted-foreground text-sm">
                  {t("no_payment_requests")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPaymentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between border-b pb-3 last:border-b-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{request.userName}</p>
                      <p className="text-muted-foreground text-xs">
                        {request.mentorName} • ${request.amount}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          request.status === "Pending"
                            ? "destructive"
                            : "secondary"
                        }
                        className={
                          request.status === "Pending"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : ""
                        }
                      >
                        {request.status === "Pending"
                          ? t("pending_status")
                          : request.status}
                      </Badge>
                      <Link
                        href={`/admin-dashboard/payment-requests/${request.id}`}
                      >
                        <Button variant="ghost" size="sm">
                          {t("view_button")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                {recentPaymentRequests.length > 0 && (
                  <Link href="/admin-dashboard/payment-requests">
                    <Button variant="ghost" className="mt-4 w-full">
                      {t("view_all_payment_requests_button")}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Mentor Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t("recent_mentor_applications_title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentMentorRequests.length === 0 ? (
              <div className="py-6 text-center">
                <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <Users className="text-muted-foreground h-6 w-6" />
                </div>
                <p className="text-muted-foreground text-sm">
                  {t("no_mentor_applications")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentMentorRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between border-b pb-3 last:border-b-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{request.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {request.jobTitle} • {request.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="border-amber-200 bg-amber-50 text-amber-700"
                      >
                        {t("pending_status")}
                      </Badge>
                      <Link
                        href={`/admin-dashboard/mentor-requests/${request.id}`}
                      >
                        <Button variant="ghost" size="sm">
                          {t("view_button")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                {recentMentorRequests.length > 0 && (
                  <Link href="/admin-dashboard/mentor-requests">
                    <Button variant="ghost" className="mt-4 w-full">
                      {t("view_all_mentor_applications_button")}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("system_summary_title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="p-4 text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium">
                  {t("pending_actions_label")}
                </span>
              </div>
              <div className="text-2xl font-bold text-amber-600">
                {pendingPaymentRequests + totalMentorRequests}
              </div>
              <div className="text-muted-foreground text-xs">
                {t("pending_actions_description")}
              </div>
            </div>

            <div className="p-4 text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">
                  {t("payment_volume_label")}
                </span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                ${totalPaymentAmount.toLocaleString()}
              </div>
              <div className="text-muted-foreground text-xs">
                {t("payment_volume_description")}
              </div>
            </div>

            <div className="p-4 text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">
                  {t("new_mentors_label")}
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {totalMentorRequests}
              </div>
              <div className="text-muted-foreground text-xs">
                {t("new_mentors_description")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
