"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export function ProfileAbout({ about }: { about: string }) {
  const t = useTranslations("Profile.ProfileAbout");

  return (
    <Card>
      <CardContent className="space-y-4">
        <CardTitle className="text-foreground text-2xl font-extrabold">
          {t("title")}
        </CardTitle>
        <p>{about}</p>
      </CardContent>
    </Card>
  );
}
