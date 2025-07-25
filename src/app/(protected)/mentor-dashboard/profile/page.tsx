import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { BiLogoGmail } from "react-icons/bi";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { ProfileInfo } from "./_components/profile-info";
import { getCurrentUser } from "@/server/actions/auth";
import { ProfileAbout } from "./_components/profile-about";
import { Dashboard } from "./_components/dashboard";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Plans } from "./_components/plans";
import { getTranslations } from "next-intl/server";
import { EditProfileDialog } from "./_components/edit-profile-dialog";

export default async function Profile() {
  const t = await getTranslations("MentorProfile");

  const user = await getCurrentUser();

  if (!user) {
    return <div>{t("noUserData")}</div>;
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <EditProfileDialog
          profile={{
            About: user.about,
            Name: user.name,
            Github: user.github,
            Location: user.location,
            JobTitle: user.jobTitle,
            Linkedin: user.linkedin,
          }}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProfileInfo user={user} />
          <ProfileAbout about={user.about} />
          <Dashboard />
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4">
              <CardTitle className="text-shadow text-2xl font-semibold">
                {t("Location.title")}
              </CardTitle>
              <p className="flex items-center gap-3 text-sm font-semibold">
                <MapPin className="text-primary size-6" />
                {user.location}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4 p-6">
              <CardTitle className="text-shadow text-2xl font-semibold">
                {t("Connect.title")}
              </CardTitle>
              <div className="flex flex-wrap gap-3">
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-full",
                  )}
                  href={user.linkedin || ""}
                >
                  <BsLinkedin />
                  {t("Connect.linkedin")}
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-full",
                  )}
                  href={`mailto:${user.email}`}
                >
                  <BiLogoGmail />
                  {t("Connect.gmail")}
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-full",
                  )}
                  href={user.github || ""}
                >
                  <BsGithub className="size-6" />
                  {t("Connect.github")}
                </Link>
              </div>
            </CardContent>
          </Card>
          <Plans />
        </div>
      </div>
    </section>
  );
}
