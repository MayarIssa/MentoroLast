"use client";

import { API } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Users,
  DollarSign,
  Clock,
} from "lucide-react";
import RequestDialog from "./_components/request-dialog";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";
import { Spinner } from "@/components/spinner";

export default function MentorPage() {
  const t = useTranslations("MentorPage");
  const params = useParams();
  const mentorId = params.mentorId as string;

  const { data: mentor, isLoading } = useQuery({
    queryKey: ["mentor", mentorId],
    queryFn: () => API.queries.mentors.getMentorById(mentorId),
  });

  if (isNaN(Number(mentorId))) {
    return notFound();
  }

  if (isLoading || !mentor) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const plans = [
    { name: "Roadmap", data: mentor.mentorPlans?.roadmapPlan },
    { name: "Customized", data: mentor.mentorPlans?.customPlan },
    { name: "Consultant", data: mentor.mentorPlans?.consultantPlan },
  ].filter((p) => p.data);

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <header className="mb-12 flex flex-col items-center gap-8 md:flex-row">
        <Avatar className="border-primary h-32 w-32 border-4">
          <AvatarImage
            src={
              mentor.image
                ? `http://mentorohelp.runasp.net/${mentor.image}`
                : undefined
            }
            alt={mentor.name}
          />
          <AvatarFallback className="text-4xl font-bold">
            {mentor.name?.charAt(0).toUpperCase() ?? ""}
          </AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold">{mentor.name}</h1>
          <p className="text-primary mt-1 text-xl font-semibold">
            {mentor.jobTitle}
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4 md:justify-start">
            {mentor.github && (
              <Link
                href={`https://${mentor.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-6 w-6" />
              </Link>
            )}
            {mentor.linkedin && (
              <Link
                href={`https://${mentor.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </Link>
            )}
            {mentor.email && (
              <Link
                href={`mailto:${mentor.email}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-6 w-6" />
              </Link>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            {mentor.location && (
              <div className="text-muted-foreground flex items-center text-sm">
                <MapPin className="mr-1.5 h-4 w-4" />
                {mentor.location}
              </div>
            )}
            {mentor.spotleft > 0 && (
              <Badge variant="default" className="flex items-center">
                <Users className="mr-1.5 h-4 w-4" />
                {t("spots_left", { count: mentor.spotleft })}
              </Badge>
            )}
            <Badge variant="secondary">{mentor.category}</Badge>
          </div>
        </div>
        <div className="mt-6 w-full md:mt-0 md:ml-auto md:w-auto">
          <RequestDialog mentorId={mentorId} />
        </div>
      </header>

      <main className="space-y-12">
        <Card>
          <CardHeader>
            <CardTitle>{t("about_me")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{mentor.about}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("mentorship_plans")}</CardTitle>
            <CardDescription>
              {t("mentorship_plans_description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={plans[0]?.name} className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
                {plans.map((plan) => (
                  <TabsTrigger key={plan.name} value={plan.name}>
                    {t(plan.name as "Roadmap" | "Customized" | "Consultant")}
                  </TabsTrigger>
                ))}
              </TabsList>
              {plans.map((plan) => (
                <TabsContent key={plan.name} value={plan.name}>
                  <Card className="border-0 shadow-none">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>
                          {t(
                            plan.name as
                              | "Roadmap"
                              | "Customized"
                              | "Consultant",
                          )}
                        </span>
                        <Badge variant="default" className="text-lg">
                          <DollarSign className="mr-1.5 h-5 w-5" />
                          {t("price_label", { price: plan.data?.price })}
                        </Badge>
                      </CardTitle>
                      <div className="text-muted-foreground flex items-center text-sm">
                        <Clock className="mr-1.5 h-4 w-4" />
                        {t("duration_label", { duration: plan.data?.duration })}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {plan.data?.description}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
