"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronUp, X } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { TCreateTaskFormSchema } from "./create-task-form";
import { OptionFields } from "./option-fields";
import { useTranslations } from "next-intl";

export function QuestionField({
  questionIdx,
  remove,
}: {
  questionIdx: number;
  remove: (idx: number) => void;
}) {
  const t = useTranslations("Tasks.QuestionField");
  const { control, watch } = useFormContext<TCreateTaskFormSchema>();
  const taskType = watch("type");
  const [showOptions, setShowOptions] = useState(true);
  function toggleOptions() {
    setShowOptions((prev) => !prev);
  }

  return (
    <Card key={`question-${questionIdx}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleOptions}
                type="button"
                variant="ghost"
                size="icon"
              >
                <ChevronUp
                  className={cn("rotate-180", showOptions && "rotate-0")}
                />
              </Button>
              <p>{t("question", { number: questionIdx + 1 })}</p>
            </div>
          </CardTitle>

          <div className="flex items-center gap-2">
            <FormField
              key={`score-${questionIdx}`}
              control={control}
              name={`questions.${questionIdx}.score`}
              render={({ field }) => (
                <FormItem className="w-fit">
                  <FormControl>
                    <Input
                      className="mt-0"
                      type="number"
                      placeholder={t("scorePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => remove(questionIdx)}
            >
              <X className="stroke-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className={cn(
          "grid gap-8 transition-all duration-300",
          showOptions ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="space-y-4 overflow-hidden">
          <FormField
            key={`question-${questionIdx}`}
            control={control}
            name={`questions.${questionIdx}.question`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder={t("questionPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {taskType === "Mcq" && <OptionFields questionIdx={questionIdx} />}
        </div>
      </CardContent>
    </Card>
  );
}


