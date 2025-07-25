"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { changeLanguage } from "@/server/actions/change-language";
import { tryCatch } from "@/lib/utils/try-catch";

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  className?: string;
};

export function LocaleSwitcherSelect({
  defaultValue,
  items,
  className,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  function onChange(value: "en" | "ar") {
    startTransition(async () => {
      const { error: langError } = await tryCatch(changeLanguage(value));

      if (langError) {
        toast.error("Couldn't change your locale");
        return;
      }

      setIsOpen(false);
      router.refresh();
    });
  }

  const currentItem = items.find((item) => item.value === defaultValue);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={cn(
          "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 flex items-center gap-2 rounded-full border px-4 py-2 text-base font-semibold shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300 hover:scale-105",
          isPending && "cursor-not-allowed opacity-50",
          isOpen && "bg-primary/20",
          className,
        )}
        aria-label="Toggle language switcher"
      >
        <Languages className="h-6 w-6" />
        <span className="hidden sm:inline">{currentItem?.label}</span>
      </button>
      {isOpen && (
        <div className="border-primary/20 absolute top-full z-10 mt-2 w-40 rounded-lg border bg-white shadow-[0_4px_16px_rgba(59,130,246,0.2)] dark:bg-gray-800">
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => onChange(item.value as "en" | "ar")}
              disabled={isPending}
              className={cn(
                "hover:bg-primary/10 flex w-full items-center gap-2 px-4 py-2 text-left text-base transition-colors",
                item.value === defaultValue && "bg-primary/5 font-semibold",
              )}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
