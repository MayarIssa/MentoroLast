"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface CTAProps {
  body: string;
  link: string;
}

export function CTA({ body, link }: CTAProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });

  return (
    <section className="py-16">
      <MaxWidthWrapper>
        <motion.div
          ref={ref}
          className="bg-primary flex flex-col items-center justify-center space-y-8 rounded-lg p-8 shadow"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2
            className="max-w-screen-sm text-center text-2xl font-bold text-white lg:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {body}
          </motion.h2>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={isInView ? { scale: 1 } : { scale: 0.8 }}
            transition={{
              duration: 0.5,
              delay: 0.4,
              type: "spring",
              stiffness: 200,
            }}
          >
            <Link
              href="/auth"
              className={cn(
                "text-md rounded-lg bg-white px-4 py-2 font-bold text-black lg:text-xl",
              )}
            >
              {link}
            </Link>
          </motion.div>
        </motion.div>
      </MaxWidthWrapper>
    </section>
  );
}
