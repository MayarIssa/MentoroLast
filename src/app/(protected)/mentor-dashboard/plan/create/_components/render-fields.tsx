"use client";

import { motion } from "motion/react";
import { useFormControlsContext } from "./plan-form-controls-provider";
import type { Steps } from "./plan-form";

export function RenderFields({ steps }: { steps: Steps }) {
  const { currentPageIndex, delta } = useFormControlsContext();

  const step = steps[currentPageIndex];
  const Comp = step?.component;

  if (!Comp) {
    return;
  }

  return (
    <motion.div
      key={currentPageIndex}
      initial={{ opacity: 0, x: delta > 0 ? "10%" : "-10%" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut", type: "tween" }}
      className="flex flex-1 flex-col gap-y-4"
    >
      <Comp />
    </motion.div>
  );
}
