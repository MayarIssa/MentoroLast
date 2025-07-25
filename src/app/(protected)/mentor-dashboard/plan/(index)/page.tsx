"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { API } from "@/lib/api";
import { Plus, BookOpen, Clock, Target } from "lucide-react";
import Link from "next/link";
import { PlanCard } from "./_components/plan-card";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";

// Loading skeleton component for plan cards
function PlanCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Separator />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

// Empty state component
function EmptyState() {
  const t = useTranslations("Plans");

  return (
    <Card className="border-muted-foreground/25 border-2 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-muted mx-auto flex h-20 w-20 items-center justify-center rounded-full">
          <BookOpen className="text-muted-foreground h-10 w-10" />
        </div>
        <h3 className="text-foreground mt-6 text-lg font-semibold">
          {t("PlanPage.emptyStateTitle")}
        </h3>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
          {t("PlanPage.emptyStateDescription")}
        </p>
        <Button className="mt-6" asChild>
          <Link href="/mentor-dashboard/plan/create">
            <Plus className="h-4 w-4" />
            {t("PlanPage.createUpdateButton")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function PlanPage() {
  const t = useTranslations("Plans");

  const {
    data: plans = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: () => API.queries.plans.getPlans(),
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {t("PlanPage.heading")}
            </h1>
            <p className="text-muted-foreground">{t("PlanPage.subtitle")}</p>
          </div>
          <Button size="lg" asChild>
            <Link href="/mentor-dashboard/plan/create">
              <Plus className="h-4 w-4" />
              {t("PlanPage.createUpdateButton")}
            </Link>
          </Button>
        </div>
        <Separator className="mt-6" />
      </div>

      {/* Stats Cards */}
      {!isLoading && plans.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">
                {t("PlanPage.totalPlans")}
              </h3>
              <BookOpen className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plans.length}</div>
              <p className="text-muted-foreground text-xs">
                {t("PlanPage.totalPlansDescription")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">{t("PlanPage.planTypes")}</h3>
              <Target className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(plans.map((plan) => plan.title)).size}
              </div>
              <p className="text-muted-foreground text-xs">
                {t("PlanPage.planTypesDescription")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">{t("PlanPage.avgPrice")}</h3>
              <Clock className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {Math.round(
                  plans.reduce((acc, plan) => acc + plan.price, 0) /
                    plans.length,
                )}
              </div>
              <p className="text-muted-foreground text-xs">
                {t("PlanPage.avgPriceDescription")}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PlanCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center">
                <h3 className="text-destructive text-lg font-semibold">
                  {t("PlanPage.errorTitle")}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  {t("PlanPage.errorDescription")}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : plans.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <PlanCard key={`plan-${plan.title}-${index}`} plan={plan} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
