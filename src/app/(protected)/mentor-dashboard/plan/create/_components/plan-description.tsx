"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { TPlanFormSchema } from "./plan-form";
import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";

export function PlanDescriptionField() {
  const { control } = useFormContext<TPlanFormSchema>();
  const t = useTranslations("Plans.PlanDescriptionField");

  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("label")}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={t("placeholder")}
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
