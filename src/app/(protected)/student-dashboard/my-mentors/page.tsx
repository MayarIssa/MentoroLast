"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  MapPin,
  Mail,
  Github,
  Linkedin,
  MessageSquare,
  Target,
  Calendar,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

type MentorData = {
  id: number;
  name: string;
  userId: string;
  email: string;
  image: string | null;
  jobTitle: string;
  about: string;
  location: string;
  spotleft: number;
  category: string;
  linkedin: string;
  github: string;
  role: string | null;
  averageRating: number;
  mentorPlans: null;
};

type AssignedMentorData = {
  goal: string;
  mentorName: string;
  planTitle: string;
  status: string;
  mentor: MentorData | null;
};

export default function MyMentorsPage() {
  const t = useTranslations("YourMentors");

  const {
    data: assignedMentors = [],
    isLoading,
    error,
  } = useQuery<AssignedMentorData[]>({
    queryKey: ["assigned-mentors"],
    queryFn: () => API.queries.mentors.getMentorsAssignedToStudent(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold">{t("heading")}</h1>
          <p className="text-muted-foreground mt-2 text-xl">
            {t("description")}
          </p>
        </div>

        <div className="text-center">
          <p className="text-lg">{t("loading")}</p>
        </div>

        {/* Loading skeletons */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold">{t("heading")}</h1>
          <p className="text-muted-foreground mt-2 text-xl">
            {t("description")}
          </p>
        </div>

        <div className="text-center">
          <p className="text-destructive text-lg">{t("error")}</p>
        </div>
      </div>
    );
  }

  if (assignedMentors.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold">{t("heading")}</h1>
          <p className="text-muted-foreground mt-2 text-xl">
            {t("description")}
          </p>
        </div>

        <div className="py-12 text-center">
          <User className="text-muted-foreground mx-auto mb-4 h-24 w-24" />
          <h2 className="mb-2 text-2xl font-semibold">{t("no_mentors")}</h2>
          <p className="text-muted-foreground mx-auto max-w-md">
            {t("no_mentors_description")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold">{t("heading")}</h1>
        <p className="text-muted-foreground mt-2 text-xl">{t("description")}</p>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignedMentors.map((assignment) => {
          const mentor = assignment.mentor;

          if (!mentor) {
            return null;
          }

          return (
            <Card
              key={`${mentor.id}-${assignment.planTitle}`}
              className="overflow-hidden transition-shadow hover:shadow-lg"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={mentor.image ?? undefined}
                      alt={mentor.name}
                    />
                    <AvatarFallback className="text-lg font-semibold">
                      {mentor.name?.charAt(0)?.toUpperCase() ?? "M"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate text-lg">
                      {mentor.name}
                    </CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-1">
                      {mentor.jobTitle && (
                        <>
                          <span className="truncate">{mentor.jobTitle}</span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-end">
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {t("active")}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Plan Information */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">{t("plan_label")}</span>
                    <span className="text-muted-foreground">
                      {assignment.planTitle}
                    </span>
                  </div>

                  {assignment.goal && (
                    <div className="flex items-start gap-2 text-sm">
                      <Target className="text-muted-foreground mt-0.5 h-4 w-4" />
                      <div>
                        <span className="font-medium">{t("goal_label")}</span>
                        <p className="text-muted-foreground mt-1 line-clamp-2">
                          {assignment.goal}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mentor Details */}
                {mentor.location && (
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{mentor.location}</span>
                  </div>
                )}

                {mentor.category && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{t("category")}:</span>
                    <Badge variant="secondary">{mentor.category}</Badge>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Link href={`/student-dashboard/chat`} className="flex-1">
                    <Button variant="default" size="sm" className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {t("send_message")}
                    </Button>
                  </Link>

                  <Link href={`/student-dashboard/${mentor.id}`}>
                    <Button variant="outline" size="sm">
                      <User className="mr-2 h-4 w-4" />
                      {t("view_profile")}
                    </Button>
                  </Link>
                </div>

                {/* Contact Links */}
                <div className="flex items-center gap-3 border-t pt-2">
                  {mentor.email && (
                    <Link
                      href={`mailto:${mentor.email}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title={t("email")}
                    >
                      <Mail className="h-4 w-4" />
                    </Link>
                  )}

                  {mentor.linkedin && (
                    <Link
                      href={`https://${mentor.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title={t("linkedin")}
                    >
                      <Linkedin className="h-4 w-4" />
                    </Link>
                  )}

                  {mentor.github && (
                    <Link
                      href={`https://${mentor.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title={t("github")}
                    >
                      <Github className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
