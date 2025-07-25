"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import type { TPlanFormSchema } from "./plan-form";
import { useTranslations } from "next-intl";

export function PlanTypeField() {
  const t = useTranslations("Plans.PlanTypeField");
  const { control } = useFormContext<TPlanFormSchema>();

  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{t("label")}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("placeholder")} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="Customized">{t("customized")}</SelectItem>
              <SelectItem value="Roadmap">{t("roadmap")}</SelectItem>
              <SelectItem value="Guidance">{t("guidance")}</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
