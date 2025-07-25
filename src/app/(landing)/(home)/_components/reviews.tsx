"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import userImg from "@/assets/user-mock-img.jpg";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export function Reviews() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const t = useTranslations("Home.Reviews");

  // TODO: Add reviews from the API
  const REVIEWS = [
    {
      username: "John Doe",
      content: t("mock.content"),
      role: t("mock.student"),
    },
    {
      username: "Jane Doe",
      content: t("mock.content"),
      role: t("mock.mentor"),
    },
    {
      username: "John Doe",
      content: t("mock.content"),
      role: t("mock.student"),
    },

    {
      username: "John Doe",
      content: t("mock.content"),
      role: t("mock.student"),
    },
    {
      username: "Jane Doe",
      content: t("mock.content"),
      role: t("mock.mentor"),
    },
    {
      username: "John Doe",
      content: t("mock.content"),
      role: t("mock.student"),
    },
  ];

  return (
    <section className="py-16">
      <MaxWidthWrapper className="grid items-center gap-8 lg:grid-cols-2">
        <motion.div
          ref={ref}
          className="relative overflow-hidden rounded-xl bg-slate-100"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          <Carousel
            opts={{
              loop: true,
              align: "start",
              dragFree: true,
            }}
            orientation="vertical"
            plugins={[AutoScroll({ playOnInit: true })]}
            className="scroll-shadow"
          >
            <CarouselContent className="-mt-1 max-h-[32rem]">
              {REVIEWS.map((review, index) => (
                <CarouselItem key={`review-${index}`} className="pt-1">
                  <div className="p-1">
                    <Card className="cursor-grab select-none active:cursor-grabbing">
                      <CardContent className="flex items-center gap-4">
                        <div className="size-20 shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={userImg}
                            alt="User Image"
                            className="size-full object-cover"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">
                              {review.username}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {review.role}
                            </p>
                          </div>
                          <p className="text-sm">{review.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </motion.div>
        <motion.div
          className="text-center lg:text-start"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-primary text-4xl font-extrabold uppercase">
            {t("title")}
          </h3>
          <p className="text-base lg:text-lg">{t("description")}</p>
        </motion.div>
      </MaxWidthWrapper>
    </section>
  );
}
