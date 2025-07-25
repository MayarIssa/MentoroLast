"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import Image from "next/image";
import Link from "next/link";
import robot from "@/assets/robot.png";
import { motion, useInView } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const t = useTranslations("Home.Hero");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [locale, router]);

  return (
    <section className="flex min-h-screen items-center justify-center">
      <MaxWidthWrapper className="flex flex-col items-center justify-center gap-8">
        <motion.h1
          ref={ref}
          className="text-primary text-center text-4xl font-extrabold tracking-wide uppercase md:text-6xl lg:text-8xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <TypeAnimation
            sequence={[t("start"), 1000, t("middle"), 1000, t("end")]}
            wrapper="span"
            cursor={true}
            repeat={0}
            style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
          />
          <motion.span
            className="relative inline-block"
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <Image
              className="relative inline-block h-[1em] w-auto"
              src={robot}
              alt="robot"
            />
            <motion.div
              className={cn(
                "bg-primary absolute top-0 rounded-full px-4 py-2 text-xs text-white transition hover:text-black hover:opacity-85 md:top-2 md:text-xl lg:text-2xl",
                isArabic ? "md:-left-46" : "md:-right-32",
              )}
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Link href="/auth">{t("join")}</Link>
              <div
                className={cn(
                  "border-r-primary absolute -bottom-3 h-0 w-0 border-t-[10px] border-r-[20px] border-b-[10px] border-l-[20px] border-t-transparent border-b-transparent border-l-transparent",
                  isArabic
                    ? "-right-5 rotate-[225deg]"
                    : "-left-5 rotate-[-45deg]",
                )}
              ></div>
            </motion.div>
          </motion.span>
        </motion.h1>
      </MaxWidthWrapper>
    </section>
  );
}
