"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (resolvedTheme) {
      setIsDark(resolvedTheme === "dark");
    }
  }, [resolvedTheme]);

  const handleToggle = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    setIsDark(!isDark);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleToggle}
        className="relative flex h-10 w-20 items-center justify-between rounded-full p-1 transition-colors duration-300 focus:outline-none"
        style={{
          backgroundColor: isDark ? "#374151" : "#e5e7eb",
        }}
        whileTap={{ scale: 0.95 }}
      >
        <LayoutGroup>
          <motion.div
            layout
            className="absolute inset-y-1 flex h-8 w-8 items-center justify-center rounded-full shadow-lg"
            style={{
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              left: isDark ? "calc(100% - 2.25rem)" : "0.25rem",
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="moon"
                  initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
                  layoutId="switch-icon"
                  transition={{ duration: 0.2 }}
                >
                  <Moon size={18} className="text-blue-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
                  layoutId="switch-icon"
                  transition={{ duration: 0.2 }}
                >
                  <Sun size={18} className="text-yellow-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </motion.button>
    </div>
  );
}
