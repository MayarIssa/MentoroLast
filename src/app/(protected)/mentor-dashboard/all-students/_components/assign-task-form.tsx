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
import { useTasks } from "@/hooks/use-tasks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ClipboardList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export const assignTaskFormSchema = z.object({
  taskId: z.coerce.number().min(1, { message: "Task is required" }),
});
export type AssignTaskFormSchema = z.infer<typeof assignTaskFormSchema>;

export function AssignTaskForm({
  onSubmit,
}: {
  onSubmit: (data: AssignTaskFormSchema) => void;
}) {
  const t = useTranslations("AllStudents.AssignTaskForm");
  const form = useForm<AssignTaskFormSchema>({
    resolver: zodResolver(assignTaskFormSchema),
    defaultValues: {
      taskId: 0,
    },
  });
  const { data: tasks, isPending: tasksLoading } = useTasks();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {tasksLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="size-4 animate-spin" />
          </div>
        ) : (
          <FormField
            control={form.control}
            name="taskId"
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
                      {tasks?.map((task) => (
                        <SelectItem key={task.id} value={task.id.toString()}>
                          {task.title} ({task.taskType})
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
            <ClipboardList />
          )}
          {t("button")}
        </Button>
      </form>
    </Form>
  );
}
