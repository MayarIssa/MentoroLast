"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { TPlanFormSchema } from "./plan-form";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";

export function PlanPriceField() {
  const { control } = useFormContext<TPlanFormSchema>();
  const t = useTranslations("Plans.PlanPriceField");

  return (
    <FormField
      control={control}
      name="price"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input type="number" placeholder={t("placeholder")} {...field} />
          </FormControl>
          <FormDescription>{t("description")}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}