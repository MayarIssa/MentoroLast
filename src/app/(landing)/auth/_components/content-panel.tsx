"use client";

import robot from "@/assets/robot.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";

interface ContentPanelProps {
  isRightPanel: boolean;
  onSwitchPanels: () => void;
}

const ContentPanel = ({ isRightPanel, onSwitchPanels }: ContentPanelProps) => {
  const t = useTranslations("Auth");

  return (
    <div
      className={cn(
        "absolute transition-all duration-500 ease-in-out",
        // Mobile (vertical positioning)
        "inset-x-0 h-1/2",
        isRightPanel ? "top-0" : "top-1/2",
        // Desktop (horizontal positioning)
        "lg:inset-x-auto lg:inset-y-0 lg:h-full lg:w-1/2",
        isRightPanel ? "lg:left-0" : "lg:left-1/2",
      )}
    >
      <div className="flex h-full flex-col items-center justify-center gap-4 py-8 lg:gap-8 lg:py-16">
        <h2 className="text-primary-foreground max-w-72 text-center text-4xl font-extrabold text-shadow-sm lg:text-6xl">
          {isRightPanel
            ? t("login.content_title")
            : t("register.content_title")}
        </h2>

        <motion.div
          className="size-32 overflow-hidden lg:size-48"
          animate={{ y: [-8, 8, -8] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <Image
            src={robot}
            alt="Robot"
            className="size-full object-contain"
            priority={true}
          />
        </motion.div>

        <Button
          className="w-1/2 font-semibold"
          variant="secondary"
          onClick={onSwitchPanels}
        >
          {isRightPanel ? t("register.title") : t("login.title")}
        </Button>
      </div>
    </div>
  );
};

export default ContentPanel;
