"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  CheckCircle,
  XCircle,
  User,
  Mail,
  Briefcase,
  MapPin,
  Github,
  Linkedin,
  CreditCard,
  FileText,
  Play,
  Download,
} from "lucide-react";
import {
  useAcceptMentorRequestMutation,
  useRejectMentorRequestMutation,
} from "@/hooks/use-admin-mutations";
import { Spinner } from "@/components/spinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { useTranslations } from "next-intl";

interface MentorRequestDetailsType {
  id: number;
  name: string;
  email: string;
  image: string;
  jobTitle: string;
  category: string;
  about: string;
  location: string;
  accountBank: string;
  introVideo: string;
  cv: string;
  linkedin: string;
  github: string;
}

export function MentorRequestDetails({
  request,
}: {
  request: MentorRequestDetailsType;
}) {
  const router = useRouter();
  const { mutate: acceptRequest, isPending: isAccepting } =
    useAcceptMentorRequestMutation();
  const { mutate: rejectRequest, isPending: isRejecting } =
    useRejectMentorRequestMutation();
  const t = useTranslations("MentorRequestDetails");

  const handleAcceptRequest = async () => {
    acceptRequest(request.id.toString(), {
      onSuccess: () => {
        toast.success(t("acceptSuccess"));
        router.push("/admin-dashboard/mentor-requests");
      },
      onError: (error) => {
        toast.error(error.message || t("acceptError"));
      },
    });
  };

  const handleRejectRequest = async () => {
    rejectRequest(request.id.toString(), {
      onSuccess: () => {
        toast.success(t("rejectSuccess"));
        router.push("/admin-dashboard/mentor-requests");
      },
      onError: (error) => {
        toast.error(error.message || t("rejectError"));
      },
    });
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      {/* Header Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <Avatar className="border-muted h-24 w-24 border-4">
                <AvatarImage src={request.image} alt={request.name} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <CardTitle className="text-foreground text-3xl font-bold">
                  {request.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5" />
                  {request.email}
                </CardDescription>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-primary h-4 w-4" />
                    <span className="font-medium">{request.jobTitle}</span>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {request.category}
                  </Badge>
                </div>
                {request.location && (
                  <div className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{request.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Information */}
        <div className="space-y-6 lg:col-span-2">
          {/* About Section */}
          {request.about && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t("about")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {request.about}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Social Links */}
          {(request.github || request.linkedin) && (
            <Card>
              <CardHeader>
                <CardTitle>{t("socialProfiles")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {request.github && (
                    <Button variant="outline" asChild>
                      <a
                        href={`https://${request.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        <Github className="h-4 w-4" />
                        {t("github")}
                      </a>
                    </Button>
                  )}
                  {request.linkedin && (
                    <Button variant="outline" asChild>
                      <a
                        href={`https://${request.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        <Linkedin className="h-4 w-4" />
                        {t("linkedin")}
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents & Media */}
          <Card>
            <CardHeader>
              <CardTitle>{t("documents")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {request.cv && (
                  <Button variant="outline" asChild className="h-auto p-4">
                    <a
                      href={request.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{t("cv")}</div>
                        <div className="text-muted-foreground text-sm">
                          {t("viewDocument")}
                        </div>
                      </div>
                      <Download className="ml-auto h-4 w-4" />
                    </a>
                  </Button>
                )}

                {request.introVideo && (
                  <Button variant="outline" asChild className="h-auto p-4">
                    <a
                      href={request.introVideo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                        <Play className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{t("introVideo")}</div>
                        <div className="text-muted-foreground text-sm">
                          {t("watchVideo")}
                        </div>
                      </div>
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Banking Information */}
          {request.accountBank && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {t("bankAccount")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground font-semibold">
                  {request.accountBank}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>{t("actions")}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="default" disabled={isAccepting}>
                    {isAccepting ? (
                      <Spinner />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {t("accept")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t("acceptConfirmTitle")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("acceptConfirmDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleAcceptRequest}
                      disabled={isAccepting}
                    >
                      {isAccepting ? <Spinner /> : t("confirm")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isRejecting}>
                    {isRejecting ? (
                      <Spinner />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    {t("reject")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t("rejectConfirmTitle")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("rejectConfirmDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRejectRequest}
                      disabled={isRejecting}
                    >
                      {isRejecting ? <Spinner /> : t("confirm")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
