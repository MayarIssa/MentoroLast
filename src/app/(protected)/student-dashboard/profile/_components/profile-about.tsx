import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { NotebookIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function ProfileAbout({ about }: { about: string }) {
  const t = useTranslations("Profile.ProfileAbout");

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-2">
          <NotebookIcon className="stroke-primary" />
          <CardTitle className="text-2xl font-semibold">{t("title")}</CardTitle>
        </div>
        <p className="text-muted-foreground mt-2">{about}</p>
      </CardContent>
    </Card>
  );
}
