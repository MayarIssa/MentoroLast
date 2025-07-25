"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { API } from "@/lib/api";
import type { Plan } from "@/lib/types/plans";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Crown } from "lucide-react";
import { useTranslations } from "next-intl";

export function Plans() {
  const t = useTranslations("Profile.Plans");
  const { data: plans, isPending } = useQuery({
    queryKey: ["plans"],
    queryFn: () => API.queries.plans.getPlans(),
  });

  console.log(plans);

  if (isPending) return <Skeleton className="h-[30rem] w-full" />;

  return (
    <Card className="border-border rounded-xl shadow-lg transition-all duration-300">
      <CardHeader className="p-6">
        <CardTitle className="text-foreground text-2xl font-extrabold">
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <Carousel className="w-full">
          <CarouselPrevious className="bg-primary/10 hover:bg-primary/20 top-1/2 left-0 z-10 rounded-full shadow-md" />
          <CarouselContent>
            {plans?.map((plan, idx) => (
              <CarouselItem
                key={`plan-${plan.title}-${idx}`}
                className="w-full"
              >
                <Plan plan={plan} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext className="bg-primary/10 hover:bg-primary/20 top-1/2 right-0 z-10 rounded-full shadow-md" />
        </Carousel>
      </CardContent>
    </Card>
  );
}

function Plan({ plan }: { plan: Plan }) {
  const t = useTranslations("Profile.Plans.Starter");
  const perks: Record<typeof plan.title, string[]> = {
    Custom: ["Chat with mentor", "Free sessions", "Tasks", "Resources"],
    Consultant: [
      "Chat with mentor",
      "Free sessions",
      "Tasks",
      "Resources",
      "1 to 1 Calls with mentor",
    ],
    Roadmap: [
      "Chat with mentor",
      "Free sessions",
      "Tasks",
      "Resources",
      "Specialized Roadmap",
    ],
  };

  return (
    <div className="bg-card flex flex-col items-center justify-center gap-4 rounded-lg p-6 shadow-lg">
      <h4 className="text-foreground text-2xl font-semibold">{plan.title}</h4>
      <div className="bg-primary/10 flex items-center gap-2 rounded-full px-4 py-2 shadow-sm">
        <Crown className="text-primary size-6" />
        <p className="text-foreground text-xl font-bold">
          {plan.price}LE{" "}
          <span className="text-muted-foreground text-sm font-semibold">
            {t("price")}
          </span>
        </p>
      </div>
      <p className="text-muted-foreground max-w-48 text-center">
        {t("description")}
      </p>
      <ul className="flex flex-col gap-2">
        {perks[plan.title].map((perk) => (
          <li
            key={perk}
            className="bg-primary/5 flex items-center gap-2 rounded-md px-3 py-2 shadow-sm"
          >
            <CheckCircle className="text-primary size-5" />
            <span className="text-foreground">{perk}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
