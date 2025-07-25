"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useResources } from "@/hooks/use-resources";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Book, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export const assignResourceFormSchema = z.object({
  resourceId: z.coerce.number(),
});
export type AssignResourceFormSchema = z.infer<typeof assignResourceFormSchema>;

export function AssignResourceForm({
  onSubmit,
}: {
  onSubmit: (data: AssignResourceFormSchema) => void;
}) {
  const t = useTranslations("AllStudents.AssignResourceForm");
  const form = useForm<AssignResourceFormSchema>({
    resolver: zodResolver(assignResourceFormSchema),
    defaultValues: {
      resourceId: 0,
    },
  });
  const { data: resources, isPending: resourcesLoading } = useResources();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {resourcesLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="size-4 animate-spin" />
            <span className="ml-2">{t("loading")}</span>
          </div>
        ) : (
          <FormField
            control={form.control}
            name="resourceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("label")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {resources?.map((resource) => (
                        <SelectItem
                          key={resource.id}
                          value={resource.id.toString()}
                        >
                          {resource.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Book />
          )}
          {t("button")}
        </Button>
      </form>
    </Form>
  );
}
