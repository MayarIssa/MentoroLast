"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useAcceptRequestMutation,
  useRejectRequestMutation,
} from "@/hooks/use-accept-request-mutation";
import { CheckCircle, FileText, Target, User, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function RequestCard({
  request,
}: {
  request: {
    id: number;
    studentName: string;
    planTitle: string;
    goal: string;
  };
}) {
  const t = useTranslations("RequestCard");
  const router = useRouter();
  const { mutate: acceptRequest, isPending: isAccepting } =
    useAcceptRequestMutation();
  const { mutate: rejectRequest, isPending: isRejecting } =
    useRejectRequestMutation();

  const handleAcceptRequest = async () => {
    acceptRequest(request.id.toString(), {
      onSuccess: () => {
        router.refresh();
      },
    });
  };

  const handleRejectRequest = async () => {
    rejectRequest(request.id.toString(), {
      onSuccess: () => {
        router.refresh();
      },
    });
  };

  return (
    <Card className="transition-shadow duration-200 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="text-primary h-5 w-5" />
          <CardTitle className="text-lg">{request.studentName}</CardTitle>
        </div>
        <CardDescription className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {t("plan_label", { planTitle: request.planTitle })}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Target className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
            <div>
              <p className="text-muted-foreground mb-1 text-sm font-medium">
                {t("goal_label")}
              </p>
              <p className="text-sm leading-relaxed">{request.goal}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Button
          onClick={handleAcceptRequest}
          className="flex-1 bg-green-600 text-white hover:bg-green-700"
          size="sm"
          disabled={isAccepting}
        >
          {isAccepting ? <Spinner /> : <CheckCircle className="h-4 w-4" />}
          {t("accept_button")}
        </Button>
        <Button
          onClick={handleRejectRequest}
          variant="destructive"
          className="flex-1"
          size="sm"
          disabled={isRejecting}
        >
          {isRejecting ? <Spinner /> : <XCircle className="h-4 w-4" />}
          {t("reject_button")}
        </Button>
      </CardFooter>
    </Card>
  );
}
