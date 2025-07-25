"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { API } from "@/lib/api";
import type { Plan } from "@/lib/types/plans";
import {
  DollarSign,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  Target,
  BookOpen,
} from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";

// Plan type colors mapping
const planTypeColors = {
  Customized: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  Roadmap: "bg-green-500/10 text-green-700 border-green-500/20",
  Consultant: "bg-purple-500/10 text-purple-700 border-purple-500/20",
} as const;

// Plan type icons mapping
const planTypeIcons = {
  Customized: <Target className="h-4 w-4" />,
  Roadmap: <BookOpen className="h-4 w-4" />,
  Consultant: <Clock className="h-4 w-4" />,
} as const;

export function PlanCard({ plan }: { plan: Plan }) {
  const t = useTranslations("Profile.PlanCard");
  const [isDeleting, startDeleting] = useTransition();
  const router = useRouter();

  function handleDelete() {
    startDeleting(async () => {
      try {
        await API.mutations.plans.deletePlan(plan.title);
        router.refresh();
      } catch (error) {
        console.error("Failed to delete plan:", error);
      }
    });
  }

  const PlanIcon = planTypeIcons[plan.title as keyof typeof planTypeIcons] ?? (
    <Target className="h-4 w-4" />
  );
  const colorClass =
    planTypeColors[plan.title as keyof typeof planTypeColors] ??
    "bg-gray-500/10 text-gray-700 border-gray-500/20";

  return (
    <Card className="group border-muted-foreground/20 hover:border-muted-foreground/30 relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Plan Type Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge
          variant="secondary"
          className={`${colorClass} gap-1.5 font-medium`}
        >
          {PlanIcon}
          {plan.title}
        </Badge>
      </div>

      {/* Actions Dropdown */}
      <div className="absolute top-4 left-4 z-10 opacity-0 transition-opacity group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-background/80 hover:bg-background h-8 w-8 backdrop-blur-sm"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem asChild>
              <Link
                href={`/mentor-dashboard/plan/create?type=${plan.title}`}
                className="cursor-pointer"
              >
                <Edit className="h-4 w-4" />
                {t("editButton")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="h-4 w-4" />
                  {t("deleteButton")}
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("deleteConfirmDescription")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancelButton")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? (
                      <>
                        <Spinner />
                        {t("deletingButton")}
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        {t("deleteButton")}
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardHeader className="pt-12 pb-4">
        <CardTitle className="line-clamp-2 pr-16 text-xl font-bold">
          {plan.title} {t("planSuffix")}
        </CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-3 leading-relaxed">
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Plan Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 flex items-center gap-2 rounded-lg p-2">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
              <Calendar className="text-primary h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground text-xs font-medium">
                {t("durationLabel")}
              </p>
              <p className="text-foreground truncate text-sm font-semibold">
                {plan.duration}
              </p>
            </div>
          </div>

          <div className="bg-muted/50 flex items-center gap-2 rounded-lg p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground text-xs font-medium">
                {t("priceLabel")}
              </p>
              <p className="text-foreground text-sm font-semibold">
                ${plan.price}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      {/* Hover Gradient Effect */}
      <div className="from-primary to-primary/50 pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-5" />
    </Card>
  );
}
