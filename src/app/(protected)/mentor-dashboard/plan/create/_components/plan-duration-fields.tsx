"use client";

import { useFormContext } from "react-hook-form";
import type { TPlanFormSchema } from "./plan-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export function PlanDurationFields() {
  const { control } = useFormContext<TPlanFormSchema>();
  const t = useTranslations("Plans.PlanDurationFields");

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="durationType"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>{t("durationTypeLabel")}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("durationTypePlaceholder")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Months">Months</SelectItem>
                <SelectItem value="Weeks">Weeks</SelectItem>
                <SelectItem value="Days">Days</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="number" placeholder={t("durationPlaceholder")} {...field} />
            </FormControl>
            <FormDescription>{t("durationDescription")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}