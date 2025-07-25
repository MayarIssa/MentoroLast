"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import firstNodeImg from "@/assets/community/1.jpg";
import secNodeImg from "@/assets/community/2.jpg";
import thirdNodeImg from "@/assets/community/3.jpg";
import fourthNodeImg from "@/assets/community/4.png";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";

interface Node {
  id: string;
  label?: string;
  img?: StaticImageData;
  width?: string;
  left: string;
  top: string;
}

const EDGES = [
  { from: "share-knowledge", to: "person-1" },
  { from: "share-knowledge", to: "latest-tech" },
  { from: "share-knowledge", to: "person-2" },
  { from: "person-1", to: "latest-tech" },
  { from: "person-1", to: "person-3" },
  { from: "person-2", to: "latest-tech" },
  { from: "person-2", to: "pro-mentors" },
  { from: "person-2", to: "person-4" },
  { from: "latest-tech", to: "person-4" },
  { from: "pro-mentors", to: "person-4" },
  { from: "person-4", to: "person-3" },
];

export function Community() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const t = useTranslations("Home.Community");

  const NODES: Node[] = [
    {
      id: "share-knowledge",
      label: t("nodes.shareKnowledge"),
      left: "35%",
      top: "10%",
    },
    {
      id: "person-1",
      img: firstNodeImg,
      left: "85%",
      top: "10%",
    },
    {
      id: "person-2",
      img: secNodeImg,
      left: "15%",
      top: "50%",
    },
    {
      id: "latest-tech",
      label: t("nodes.latestTech"),
      left: "50%",
      top: "40%",
    },
    {
      id: "pro-mentors",
      label: t("nodes.profMentors"),
      left: "2%",
      top: "90%",
    },
    {
      id: "person-4",
      img: fourthNodeImg,
      left: "40%",
      top: "100%",
    },
    {
      id: "person-3",
      img: thirdNodeImg,
      left: "75%",
      top: "80%",
    },
  ];

  return (
    <section className="py-16">
      <MaxWidthWrapper className="grid gap-16 lg:grid-cols-2">
        <motion.div
          className="flex flex-col items-center justify-center gap-4 lg:items-center"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-primary text-center text-4xl font-bold lg:text-start lg:text-6xl">
            {t("title")}{" "}
            <span className="text-foreground">{t("titleHighlight")}.</span>
          </h2>
          <p className="text-center lg:text-start">{t("description")}</p>
          <Link
            href="/auth"
            className={cn(
              buttonVariants({
                variant: "secondary",
                size: "lg",
              }),
              "w-8/12 rounded-2xl font-bold shadow-black/30",
            )}
          >
            {t("action")}
          </Link>
        </motion.div>
        <motion.div
          ref={ref}
          className="relative mx-8 min-h-[32rem]"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative mx-auto aspect-video h-full w-full max-w-2xl">
            <svg className="absolute inset-0 size-full">
              {EDGES.map((edge, index) => {
                const from = NODES.find((node) => node.id === edge.from) ?? {
                  left: "0%",
                  top: "0%",
                };
                const to = NODES.find((node) => node.id === edge.to) ?? {
                  left: "0%",
                  top: "0%",
                };
                return (
                  <motion.line
                    key={index}
                    x1={from.left}
                    y1={from.top}
                    x2={to.left}
                    y2={to.top}
                    className="stroke-foreground"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                );
              })}
            </svg>
            <div className="relative size-full">
              {NODES.map((node, index) => (
                <motion.div
                  key={node.id}
                  className={cn(
                    "bg-foreground absolute flex size-20 items-center justify-center overflow-hidden rounded-full text-xs lg:size-28",
                    node.img && "size-28 lg:size-36",
                    node.id === "pro-mentors" && "size-28 lg:size-36",
                  )}
                  style={{
                    top: `calc(${node.top} - ${node.img || node.id === "pro-mentors" ? "18%" : "12%"})`,
                    left: `calc(${node.left} - ${node.img ? "12%" : "10%"})`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {node.label && (
                    <span
                      className={cn(
                        "text-primary-foreground relative inset-0 flex size-32 items-center justify-center rounded-full p-2 text-center text-sm leading-tight font-bold text-pretty",
                        node.id === "pro-mentors" && "text-md p-4",
                      )}
                    >
                      {node.label}
                    </span>
                  )}
                  {node.img && (
                    <Image
                      src={node.img}
                      alt="Node Image"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="size-full object-cover"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </MaxWidthWrapper>
    </section>
  );
}
