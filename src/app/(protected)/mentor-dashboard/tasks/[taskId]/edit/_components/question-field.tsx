"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { TEditTaskFormSchema } from "./edit-task-form";
import { useFormContext } from "react-hook-form";
import { OptionsField } from "./options-field";
import { useTranslations } from "next-intl";

export function QuestionField({ questionIdx }: { questionIdx: number }) {
  const t = useTranslations("Tasks");
  const { control, getValues } = useFormContext<TEditTaskFormSchema>();

  return (
    <Card>
      <CardHeader className="gap-4">
        <CardTitle className="text-lg font-semibold">
          {t("QuestionField.question", { number: questionIdx + 1 })}
        </CardTitle>

        <div className="flex justify-between gap-4">
          <FormField
            control={control}
            name={`questions.${questionIdx}.question`}
            render={({ field }) => (
              <FormItem className="max-w-lg flex-1">
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("QuestionField.questionPlaceholder")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`questions.${questionIdx}.score`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("QuestionField.scorePlaceholder")}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </CardHeader>

      <CardContent>
        <OptionsField
          correctAnswer={getValues(`questions.${questionIdx}.answer`)}
          questionIdx={questionIdx}
        />
      </CardContent>
    </Card>
  );
}
