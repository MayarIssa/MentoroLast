"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import type { TEditTaskFormSchema } from "./edit-task-form";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLocale, useTranslations } from "next-intl";

export function OptionsField({
  correctAnswer,
  questionIdx,
}: {
  correctAnswer: string;
  questionIdx: number;
}) {
  const t = useTranslations("Tasks");
  const isArabic = useLocale().startsWith("ar");
  const { control, getValues, setValue } =
    useFormContext<TEditTaskFormSchema>();
  const { fields, remove } = useFieldArray({
    control,
    name: `questions.${questionIdx}.options`,
  });
  const options = getValues(`questions.${questionIdx}.options`);
  const correctAnswerIdx = options.findIndex(
    (option) => option.value === correctAnswer,
  );

  return (
    <div className="space-y-4">
      <RadioGroup
        defaultValue={`option-${correctAnswerIdx}-${correctAnswer}`}
        onValueChange={(value) => {
          setValue(
            `questions.${questionIdx}.answer`,
            value.split("-").pop() ?? "",
          );
        }}
      >
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-center gap-2"
            dir={isArabic ? "rtl" : "ltr"}
          >
            <RadioGroupItem value={`option-${index}-${field.value}`} />

            <FormField
              key={field.id}
              control={control}
              name={`questions.${questionIdx}.options.${index}.value`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder={t("OptionsField.optionPlaceholder", {
                        number: index + 1,
                      })}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button variant="ghost" size="icon" onClick={() => remove(index)}>
              <Trash2 className="stroke-destructive" />
            </Button>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
