"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export function Steps({
  count = 0,
  stepsNum = 2,
  title,
  description,
}: {
  count?: number;
  stepsNum?: number;
  title: string;
  description?: string;
}) {
  return (
    <div className="w-full space-y-4">
      <StepsLine count={count} stepsNum={stepsNum} />

      <div className="space-y-2">
        <p className="text-primary font-semibold">
          Step {count + 1}/{stepsNum + 1}
        </p>
        <div>
          <h3 className="text-3xl font-semibold">{title}</h3>
          <p className="text-secondary-foreground text-sm-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function StepsLine({
  count,
  stepsNum,
}: {
  count: number;
  stepsNum: number;
}) {
  return (
    <div className="relative flex w-full justify-between">
      {/* Circles */}
      {new Array(stepsNum + 1).fill(0).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            "z-10 size-5 rounded-full bg-slate-200 transition-colors",
            count >= idx && "bg-primary",
          )}
        />
      ))}

      {/* Lines */}
      <motion.div className="absolute top-1/2 w-full -translate-y-1/2 px-1 md:px-2">
        <div className="h-2 w-full bg-slate-200" />

        <motion.div
          className="bg-primary absolute top-1/2 h-2 -translate-y-1/2 rounded-full"
          initial={{ width: `0%` }}
          animate={{
            width: `${(100 * count - 1) / stepsNum - 1}%`,
            padding: "4px",
          }}
        />
      </motion.div>
    </div>
  );
}
