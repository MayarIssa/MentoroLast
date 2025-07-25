"use client";

import { API } from "@/lib/api";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils/index";
import { Fragment } from "react";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function StudentDashboard() {
  const t = useTranslations("StudentDashboard");

  const { data: mentors = { data: [] }, isLoading } = useQuery({
    queryKey: ["student-dashboard-mentors"],
    queryFn: () => API.queries.mentors.getAllMentors(),
  });

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  return (
    <section className="space-y-8">
      <div className="mx-auto text-center">
        <h1 className="text-4xl font-extrabold">{t("heading")}</h1>
        <p className="text-muted-foreground text-xl">{t("description")}</p>
      </div>
      <div className="relative -mx-8 w-[calc(100%+4rem)]">
        <div
          className={cn(
            "flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
          )}
        >
          <div
            className="flex min-w-full gap-6"
            style={{ animation: "marquee-left 20s linear infinite" }}
          >
            {new Array(2).fill(0).map((_, idx) => (
              <Fragment key={idx}>
                {CATEGORIES.map((category) => (
                  <div
                    key={`${category.name}-${idx}`}
                    className="bg-primary text-primary-foreground flex-shrink-0 rounded-3xl rounded-bl-none px-6 py-1.5 text-lg font-bold whitespace-nowrap shadow md:text-base"
                  >
                    {category.name} {/* Untranslated as requested */}
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mentors.data.map((mentor) => (
          <Link
            href={`/student-dashboard/${mentor.id}`}
            key={mentor.id}
            className="bg-card group overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg"
          >
            <div className="from-primary to-primary/80 group-hover:to-primary relative flex h-24 items-center justify-center bg-gradient-to-r transition-all duration-300">
              <div className="bg-card flex size-16 items-center justify-center overflow-hidden rounded-full shadow-lg transition-all duration-300 group-hover:scale-110">
                <Image
                  src={`http://mentorohelp.runasp.net/${mentor.image}`}
                  alt={mentor.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover object-center"
                />
              </div>
              {mentor.spotleft && (
                <div className="text-primary bg-card absolute top-3 right-3 rounded-full px-2 py-1 text-xs font-semibold">
                  {t("spots_left", { count: mentor.spotleft })}
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="mb-1 text-xl font-semibold">{mentor.name}</h3>
                {mentor.jobTitle && (
                  <p className="text-primary text-sm font-medium">
                    {mentor.jobTitle}
                  </p>
                )}
              </div>

              {mentor.about && (
                <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                  {mentor.about}
                </p>
              )}

              {mentor.location && (
                <div className="text-muted-foreground mb-4 flex items-center text-sm">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>{mentor.location}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
