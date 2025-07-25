import { API } from "@/lib/api";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Star,
  BookOpen,
  Target,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { getTranslations } from "next-intl/server";

export default async function MentorPage({
  params,
}: {
  params: Promise<{ mentorId: string }>;
}) {
  const { mentorId } = await params;
  if (isNaN(Number(mentorId))) {
    return notFound();
  }

  const t = await getTranslations("MentorPage");

  try {
    const mentor = await API.queries.mentors.getMentorById(mentorId);

    const plans = [
      { name: "Roadmap", data: mentor.mentorPlans?.roadmapPlan },
      { name: "Custom", data: mentor.mentorPlans?.customPlan },
      { name: "Consultant", data: mentor.mentorPlans?.consultantPlan },
    ].filter((p) => p.data);

    return (
      <MaxWidthWrapper className="py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Mentor Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 size-32 overflow-hidden rounded-full">
                  <Image
                    src={`http://mentorohelp.runasp.net/${mentor.image}`}
                    width={128}
                    height={128}
                    alt={mentor.name}
                    className="size-full object-cover"
                  />
                </div>
                <CardTitle className="text-2xl">{mentor.name}</CardTitle>
                <CardDescription className="text-primary text-lg font-semibold">
                  {mentor.jobTitle}
                </CardDescription>
                <Badge variant="secondary" className="mx-auto">
                  {mentor.category}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="size-4" />
                  <span>{mentor.location}</span>
                </div>

                <div className="text-muted-foreground flex items-center gap-2">
                  <Users className="size-4" />
                  <span>{t("spots_left", { count: mentor.spotleft })}</span>
                </div>

                <div className="text-muted-foreground flex items-center gap-2">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span>{t("reviews")}</span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold">{t("contact_information")}</h4>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Mail className="size-4" />
                    <span>{mentor.email}</span>
                  </div>
                  {mentor.linkedin && (
                    <a
                      href={mentor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex items-center gap-2 text-sm hover:underline"
                    >
                      <Linkedin className="size-4" />
                      <span>{t("linkedin")}</span>
                    </a>
                  )}
                  {mentor.github && (
                    <a
                      href={mentor.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex items-center gap-2 text-sm hover:underline"
                    >
                      <Github className="size-4" />
                      <span>{t("github")}</span>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="size-5" />
                  {t("about_me")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {mentor.about}
                </p>
              </CardContent>
            </Card>

            {/* Mentorship Plans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="size-5" />
                  {t("mentorship_plans")}
                </CardTitle>
                <CardDescription>
                  {t("mentorship_plans_description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {plans.length > 0 ? (
                  <Tabs defaultValue={plans[0]?.name} className="w-full">
                    <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
                      {plans.map((plan) => (
                        <TabsTrigger key={plan.name} value={plan.name}>
                          {t(plan.name as "Roadmap" | "Custom" | "Consultant")}{" "}
                          {t("plan")}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {plans.map((plan) => (
                      <TabsContent key={plan.name} value={plan.name}>
                        <Card className="border-0 shadow-none">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-xl">
                                {plan.data?.title ||
                                  `${t(plan.name as "Roadmap" | "Custom" | "Consultant")} ${t("plan")}`}
                              </CardTitle>
                              <Badge variant="default" className="text-lg">
                                <DollarSign className="mr-1 size-4" />
                                {t("price_label", { price: plan.data?.price })}
                              </Badge>
                            </div>
                            <div className="text-muted-foreground flex items-center text-sm">
                              <Clock className="mr-1 size-4" />
                              {t("duration_label", {
                                duration: plan.data?.duration,
                              })}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4">
                              {plan.data?.description}
                            </p>

                            {/* Plan Features */}
                            <div className="mb-6 space-y-2">
                              <h4 className="font-semibold">
                                {t("whats_included")}
                              </h4>
                              <ul className="space-y-1 text-sm">
                                {plan.name === "Roadmap" && (
                                  <>
                                    <li className="flex items-center gap-2">
                                      <Target className="size-4 text-green-500" />
                                      {t("roadmap_feature_1")}
                                    </li>
                                    <li className="flex items-center gap-2">
                                      <Target className="size-4 text-green-500" />
                                      {t("roadmap_feature_2")}
                                    </li>
                                    <li className="flex items-center gap-2">
                                      <Target className="size-4 text-green-500" />
                                      {t("roadmap_feature_3")}
                                    </li>
                                  </>
                                )}
                                {plan.name === "Custom" && (
                                  <>
                                    <li className="flex items-center gap-2">
                                      <Target className="size-4 text-green-500" />
                                      {t("custom_feature_1")}
                                    </li>
                                    <li className="flex items-center gap-2">
                                      <Target className="size-4 text-green-500" />
                                      {t("custom_feature_2")}
                                    </li>
                                    <li className="flex items-center gap-2">
                                      <Target className="size-4 text-green-500" />
                                      {t("custom_feature_3")}
                                    </li>
                                  </>
                                )}
                                {plan.name === "Consultant" && (
                                  <>
                                    <li className="flex items-center gap-2">
                                      <Target className="size-4 text-green-500" />
                                      {t("consultant_feature_1")}
                                    </li>
                                    <li className="flex items-center gap-2">
                                      <Target className="size-4 text-green-500" />
                                      {t("consultant_feature_2")}
                                    </li>
                                    <li className="flex items-center gap-2">
                                      <Target className="size-4 text-green-500" />
                                      {t("consultant_feature_3")}
                                    </li>
                                  </>
                                )}
                              </ul>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button asChild className="w-full" size="lg">
                              <Link href="/auth">{t("subscribe_button")}</Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  <div className="text-muted-foreground py-8 text-center">
                    <BookOpen className="mx-auto mb-4 size-12 opacity-50" />
                    <p>{t("no_plans_available")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </MaxWidthWrapper>
    );
  } catch (error) {
    console.error(error);
    return notFound();
  }
}
