"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import robot from "@/assets/robot.png";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Fragment, useState, useMemo } from "react";
import {
  ArrowRightCircle,
  Star,
  MapPin,
  Users,
  Badge as BadgeIcon,
  Search,
  X,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import FilterOnRole from "./filter-on-role";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api";
import { type MentorData } from "@/lib/types";

const Mentors = () => {
  const t = useTranslations("Mentors");
  const [curRole, setCurRole] = useState(t("all"));
  const [searchQuery, setSearchQuery] = useState("");
  const { data: mentors, isPending } = useQuery({
    queryKey: ["mentors"],
    queryFn: () => API.queries.mentors.getMentors(),
  });

  // Enhanced filtering logic with search functionality
  const filteredMentors = useMemo(() => {
    if (!mentors?.data) return [];

    return mentors.data.filter((mentor: MentorData) => {
      // Role/Category filter
      const matchesRole =
        curRole === t("all") ||
        mentor.category === curRole ||
        mentor.jobTitle === curRole;

      // Search filter - searches across multiple fields
      const matchesSearch =
        searchQuery === "" ||
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.about?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesRole && matchesSearch;
    });
  }, [mentors?.data, curRole, searchQuery, t]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <MaxWidthWrapper className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-primary text-7xl font-extrabold text-shadow-md">
                {t("title")}
              </h2>
              <div className="animate-float size-32">
                <Image
                  className="size-full object-contain"
                  src={robot}
                  alt={t("robotAlt")}
                />
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl text-center text-lg">
              {t("exploreMentorsDescription")}
            </p>
          </MaxWidthWrapper>

          {/* Categories Marquee */}
          <div
            className={cn(
              "flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
            )}
          >
            <div className="animate-marquee-left flex gap-6 py-0.5 pr-6">
              {new Array(2).fill(0).map((_, idx) => (
                <Fragment key={idx}>
                  {CATEGORIES.map((category) => (
                    <div
                      key={`${category.name}-${idx}`}
                      className="bg-primary text-primary-foreground rounded-3xl rounded-bl-none px-6 py-1.5 text-lg font-bold whitespace-nowrap shadow md:text-base"
                    >
                      {category.name}
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
            <div
              className="animate-marquee-left flex gap-6 py-0.5 pr-6"
              aria-hidden="true"
            >
              {new Array(2).fill(0).map((_, idx) => (
                <Fragment key={idx}>
                  {CATEGORIES.map((category) => (
                    <div
                      key={`${category.name}-${idx}`}
                      className="bg-primary text-primary-foreground rounded-3xl rounded-bl-none px-6 py-1.5 text-lg font-bold whitespace-nowrap shadow md:text-base"
                    >
                      {category.name}
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
          <div
            className={cn(
              "flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
            )}
          >
            <div className="animate-marquee-right flex gap-6 py-0.5 pr-6">
              {new Array(2).fill(0).map((_, idx) => (
                <Fragment key={idx}>
                  {CATEGORIES.map((category) => (
                    <div
                      key={`${category.name}-${idx}`}
                      className="bg-primary text-primary-foreground rounded-3xl rounded-bl-none px-6 py-1.5 text-lg font-bold whitespace-nowrap shadow md:text-base"
                    >
                      {category.name}
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
            <div
              className="animate-marquee-right flex gap-6 py-0.5 pr-6"
              aria-hidden="true"
            >
              {new Array(2).fill(0).map((_, idx) => (
                <Fragment key={idx}>
                  {CATEGORIES.map((category) => (
                    <div
                      key={`${category.name}-${idx}`}
                      className="bg-primary text-primary-foreground rounded-3xl rounded-bl-none px-6 py-1.5 text-lg font-bold whitespace-nowrap shadow md:text-base"
                    >
                      {category.name}
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mentors List Section */}
      <section className="py-16">
        <MaxWidthWrapper className="space-y-8">
          {/* Header with Search and Filters */}
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-primary text-6xl font-extrabold">
                  {t("exploreMentors")}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {filteredMentors?.length ?? 0} {t("mentorsFound")}
                  {searchQuery && (
                    <span className="ml-2">
                      {t("for")} &ldquo;
                      <span className="font-medium">{searchQuery}</span>&rdquo;
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{t("filter")}:</p>
                <FilterOnRole setCurRole={setCurRole} />
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 pl-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="hover:bg-muted absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 transform p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {searchQuery && (
                <p className="text-muted-foreground mt-1 text-xs">
                  {t("searchInfo")}
                </p>
              )}
            </div>

            {/* Active Filters Display */}
            {(searchQuery || curRole !== t("all")) && (
              <div className="flex flex-wrap gap-2">
                <p className="text-muted-foreground text-sm font-medium">
                  {t("activeFilters")}:
                </p>
                {curRole !== t("all") && (
                  <Badge variant="secondary" className="gap-1">
                    <BadgeIcon className="h-3 w-3" />
                    {curRole}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurRole(t("all"))}
                      className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    <Search className="h-3 w-3" />
                    {searchQuery}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Results */}
          {isPending ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <Skeleton className="size-32 flex-shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-8 w-48" />
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredMentors?.length === 0 ? (
            <div className="py-12 text-center">
              <div className="bg-muted mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
                {searchQuery ? (
                  <Search className="text-muted-foreground h-12 w-12" />
                ) : (
                  <Users className="text-muted-foreground h-12 w-12" />
                )}
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                {searchQuery ? t("noSearchResults") : t("noMentorsFound")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? t("tryDifferentSearch")
                  : t("tryDifferentFilter")}
              </p>
              {(searchQuery || curRole !== t("all")) && (
                <div className="space-x-2">
                  {searchQuery && (
                    <Button variant="outline" onClick={clearSearch}>
                      {t("clearSearch")}
                    </Button>
                  )}
                  {curRole !== t("all") && (
                    <Button
                      variant="outline"
                      onClick={() => setCurRole(t("all"))}
                    >
                      {t("clearFilter")}
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-1">
              {filteredMentors?.map((mentor: MentorData) => (
                <Link
                  key={mentor.id}
                  href={`/mentors/${mentor.id}`}
                  className="group block"
                >
                  <Card className="hover:border-primary/20 border-2 transition-all duration-300 group-hover:scale-[1.02] hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <Avatar className="border-primary/10 size-32 border-4">
                            <AvatarImage
                              src={mentor.image}
                              alt={t("mentorImageAlt", { name: mentor.name })}
                              className="object-cover"
                            />
                            <AvatarFallback className="text-2xl font-bold">
                              {mentor.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1 space-y-4">
                          {/* Header */}
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="text-foreground group-hover:text-primary text-2xl font-bold transition-colors">
                                  {mentor.name}
                                </h3>
                                <p className="text-primary text-lg font-semibold">
                                  {mentor.jobTitle}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <ArrowRightCircle className="text-primary size-6 transition-transform group-hover:translate-x-1" />
                              </div>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className="text-sm">
                                <BadgeIcon className="mr-1 size-3" />
                                {mentor.category}
                              </Badge>
                              {mentor.spotleft > 0 && (
                                <Badge
                                  variant="default"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Users className="mr-1 size-3" />
                                  {t("spotsLeft", { count: mentor.spotleft })}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Info Grid */}
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Rating */}
                            <div className="flex items-center gap-2">
                              <Star className="size-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">
                                {mentor.averageRating ?? "5.0"}
                              </span>
                              <span className="text-muted-foreground text-sm">
                                ({t("rating")})
                              </span>
                            </div>

                            {/* Location */}
                            {mentor.location && (
                              <div className="text-muted-foreground flex items-center gap-2">
                                <MapPin className="size-4" />
                                <span className="truncate text-sm">
                                  {mentor.location}
                                </span>
                              </div>
                            )}

                            {/* Experience indicator */}
                            <div className="text-muted-foreground flex items-center gap-2">
                              <BadgeIcon className="size-4" />
                              <span className="text-sm">
                                {t("experiencedMentor")}
                              </span>
                            </div>
                          </div>

                          {/* About */}
                          {mentor.about && (
                            <div className="space-y-2">
                              <h4 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                                {t("about")}
                              </h4>
                              <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                                {mentor.about}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </MaxWidthWrapper>
      </section>
    </>
  );
};

export default Mentors;
