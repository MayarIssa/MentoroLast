"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export function BackButton() {
  const pathname = usePathname();
  const isBackable = pathname.split("/").length > 2;
  const t = useTranslations("BackButton");

  return (
    <Button
      variant="ghost"
      asChild
      className={cn(!isBackable && "pointer-events-none opacity-25")}
    >
      <Link
        href={
          isBackable
            ? pathname.split("/").slice(0, -1).join("/")
            : "/mentor-dashboard"
        }
      >
        <ArrowLeft />
        {t("goBack")}
      </Link>
    </Button>
  );
}
