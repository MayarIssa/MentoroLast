import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { TCreateTaskFormSchema } from "./create-task-form";
import { Plus, Trash } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslations } from "next-intl";

export function OptionFields({ questionIdx }: { questionIdx: number }) {
  const t = useTranslations("Tasks");
  const { control, setValue, watch } = useFormContext<TCreateTaskFormSchema>();
  const options = watch(`questions.${questionIdx}.options`);

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: `questions.${questionIdx}.options`,
    rules: {
      minLength: 1,
      maxLength: 4,
    },
  });

  return (
    <div className="space-y-8">
      <RadioGroup
        onValueChange={(value) =>
          setValue(`questions.${questionIdx}.answer`, value)
        }
        className="gap-6"
      >
        {fields.map((field, optionIdx) => (
          <div className="flex items-end justify-between gap-4" key={field.id}>
            <RadioGroupItem
              value={options[optionIdx]?.id ?? ""}
              id={`option-${optionIdx}`}
              className="self-center"
            />

            <FormField
              control={control}
              key={`option-${optionIdx}`}
              name={`questions.${questionIdx}.options.${optionIdx}.value`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder={t("OptionsField.optionPlaceholder", {
                        number: optionIdx + 1,
                      })}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              onClick={() => remove(optionIdx)}
              variant={"ghost"}
            >
              <Trash className="stroke-destructive" />
            </Button>
          </div>
        ))}
      </RadioGroup>

      <Button
        onClick={() => append({ id: crypto.randomUUID(), value: "" })}
        type="button"
        className="w-full"
        disabled={fields.length >= 4}
      >
        <Plus />
        {t("OptionsField.addOption")}
      </Button>
    </div>
  );
}
