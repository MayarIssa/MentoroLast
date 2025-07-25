"use client";

import { ResourceCards } from "./_components/resource-cards";
import { useTranslations } from "next-intl";

export default function Courses() {
  const t = useTranslations("Resources.Courses");

  return (
    <div className="space-y-8">
      <div className="bg-primary/10 border-primary text-primary-foreground rounded-lg border-l-4 p-6">
        <h2 className="text-primary text-3xl font-extrabold">{t("heading")}</h2>
      </div>
      <ResourceCards />
    </div>
  );
}
