"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import Image from "next/image";
import robot from "@/assets/robot.png";
import { motion, useInView } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useRef } from "react";
import { useTranslations } from "next-intl";

export function Chatbot() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const t = useTranslations("Home.Chatbot");

  return (
    <section className="py-16">
      <MaxWidthWrapper>
        <motion.div
          className="animate-float mx-auto -my-10 size-40 overflow-hidden"
          initial={{ opacity: 0, rotate: -180 }}
          animate={
            isInView ? { opacity: 1, rotate: 0 } : { opacity: 0, rotate: -180 }
          }
          transition={{ duration: 0.5 }}
        >
          <Image
            src={robot}
            alt="Robot Image"
            className="size-full object-contain"
          />
        </motion.div>
        <motion.div
          ref={ref}
          className="bg-secondary rounded-3xl rounded-bl-none p-8 text-center shadow"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          <TypeAnimation
            sequence={[`${t("title")}\n${t("subtitle")}`, 1000]}
            wrapper="p"
            cursor={true}
            repeat={0}
            className="text-4xl font-extrabold tracking-wide"
          />
        </motion.div>
      </MaxWidthWrapper>
    </section>
  );
}
