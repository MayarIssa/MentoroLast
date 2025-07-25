"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Star, MapPin, Users, Github, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { type MentorData } from "@/lib/types";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api";
import { Spinner } from "@/components/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function PopularMentors() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const t = useTranslations("Home.PopularMentors");
  const { data: mentors, isPending } = useQuery({
    queryKey: ["mentors"],
    queryFn: () => API.queries.mentors.getMentors(),
  });
  const [curMentor, setCurMentor] = useState<MentorData | undefined>(
    mentors?.data[0],
  );

  return (
    <section className="py-16">
      <MaxWidthWrapper className="space-y-8">
        <motion.h2
          className="text-secondary-foreground text-center text-5xl font-extrabold uppercase lg:text-start lg:text-6xl"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          {t("title")}
        </motion.h2>

        <div className="grid items-center justify-center gap-8 lg:grid-cols-5">
          {/* Featured Mentor Details */}
          <motion.div
            className="flex flex-col items-center justify-center gap-6 lg:col-span-2 lg:items-stretch"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isPending ? (
              <div className="space-y-4">
                <Skeleton className="mx-auto size-60 rounded-full" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : curMentor ? (
              <Card className="w-full">
                <CardHeader className="text-center">
                  <Avatar className="border-primary/20 mx-auto size-32 border-4">
                    <AvatarImage
                      src={curMentor.image}
                      alt={curMentor.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl font-bold">
                      {curMentor.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{curMentor.name}</h3>
                    <p className="text-primary font-semibold">
                      {curMentor.jobTitle}
                    </p>
                    <Badge variant="secondary" className="text-sm">
                      {curMentor.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Rating */}
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {curMentor.averageRating ?? "5.0"}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      ({t("reviews")})
                    </span>
                  </div>

                  {/* Location */}
                  {curMentor.location && (
                    <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{curMentor.location}</span>
                    </div>
                  )}

                  {/* Spots Left */}
                  {curMentor.spotleft && curMentor.spotleft > 0 && (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-600">
                        {t("spotsLeft", { count: curMentor.spotleft })}
                      </span>
                    </div>
                  )}

                  {/* About preview */}
                  {curMentor.about && (
                    <p className="text-muted-foreground line-clamp-3 text-center text-sm">
                      {curMentor.about}
                    </p>
                  )}

                  {/* Social Links */}
                  <div className="flex items-center justify-center gap-3">
                    {curMentor.github && (
                      <Link
                        href={`https://${curMentor.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:bg-accent rounded-full border p-2 transition-colors"
                      >
                        <Github className="h-4 w-4" />
                      </Link>
                    )}
                    {curMentor.linkedin && (
                      <Link
                        href={`https://${curMentor.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:bg-accent rounded-full border p-2 transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <Link
              href="/mentors"
              className={cn(
                buttonVariants({
                  variant: "default",
                  size: "lg",
                }),
                "rounded-xl text-lg font-bold",
              )}
            >
              {t("action")}
            </Link>
          </motion.div>

          {/* Mentor Cards Carousel */}
          <motion.div
            ref={ref}
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Carousel className="w-full">
              <CarouselContent className="-ml-1 py-4">
                {isPending ? (
                  <div className="flex w-full items-center justify-center">
                    <Spinner />
                  </div>
                ) : (
                  mentors?.data.map((mentor, _index) => (
                    <CarouselItem
                      key={mentor.id}
                      className={cn(
                        "group basis-1/3 pl-1 transition-all duration-300 hover:-translate-y-2",
                      )}
                      onMouseEnter={() => setCurMentor(mentor)}
                    >
                      <div className="p-1">
                        <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-lg">
                          <CardContent className="p-0">
                            <div className="relative aspect-square overflow-hidden">
                              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              <Image
                                src={mentor.image}
                                alt={t("mentorImageAlt", { name: mentor.name })}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />

                              {/* Category Badge */}
                              <Badge
                                variant="secondary"
                                className="absolute top-3 right-3 z-20 bg-white/90 text-black"
                              >
                                {mentor.category}
                              </Badge>

                              {/* Spots Left Indicator */}
                              {mentor.spotleft && mentor.spotleft > 0 && (
                                <Badge
                                  variant="default"
                                  className="absolute top-3 left-3 z-20 bg-green-600"
                                >
                                  {mentor.spotleft} {t("available")}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="space-y-2 p-4">
                            <div className="w-full space-y-1">
                              <h3 className="line-clamp-1 text-lg font-bold">
                                {mentor.name}
                              </h3>
                              <p className="text-primary line-clamp-1 text-sm font-medium">
                                {mentor.jobTitle}
                              </p>
                              {mentor.location && (
                                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                                  <MapPin className="h-3 w-3" />
                                  <span className="line-clamp-1">
                                    {mentor.location}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-xs">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{mentor.averageRating ?? "5.0"}</span>
                              </div>
                            </div>
                          </CardFooter>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
            </Carousel>
          </motion.div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
