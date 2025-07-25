"use client";

import { Form } from "@/components/ui/form";
import type { Task } from "@/lib/types/tasks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { QuestionField } from "./question-field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { Save } from "lucide-react";
import { API } from "@/lib/api";
import { tryCatch } from "@/lib/utils/try-catch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const QuestionSchema = z.object({
  id: z.number(),
  taskId: z.number(),
  question: z.string(),
  options: z.array(z.object({ value: z.string() })),
  answer: z.string(),
  score: z.coerce.number().min(0).max(10),
});

const EditTaskFormSchema = z.object({
  questions: z.array(QuestionSchema),
});

export type TEditTaskFormSchema = z.infer<typeof EditTaskFormSchema>;

export function EditTaskForm({
  task,
  questions,
}: {
  task: Task;
  questions: TEditTaskFormSchema["questions"];
}) {
  const t = useTranslations("Tasks");
  const form = useForm<TEditTaskFormSchema>({
    resolver: zodResolver(EditTaskFormSchema),
    defaultValues: {
      questions,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const router = useRouter();

  async function onSubmit(values: TEditTaskFormSchema) {
    switch (task.taskType) {
      case "Mcq":
        const mcqQuestions = values.questions.map((question) => ({
          Id: question.id,
          TaskId: task.id,
          Question: question.question,
          Score: question.score,
          Options: question.options.map((option) => option.value),
          CorrectAnswer: question.answer,
        }));

        const { error: mcqQuestionsError } = await tryCatch(
          API.mutations.tasks.updateTask({
            Mcqs: mcqQuestions,
            submissionDTOs: [],
          }),
        );

        if (mcqQuestionsError) {
          toast.error(t("EditTaskForm.errors.mcqUpdateFailed"));
          return;
        }

        toast.success(t("EditTaskForm.success.mcqUpdate"));
        break;

      case "Submission":
        const submissionQuestions = values.questions.map((question) => ({
          Id: question.id,
          TaskId: task.id,
          Question: question.question,
          Score: question.score,
        }));

        const { error: submissionQuestionsError } = await tryCatch(
          API.mutations.tasks.updateTask({
            Mcqs: [],
            submissionDTOs: submissionQuestions,
          }),
        );

        if (submissionQuestionsError) {
          toast.error(t("EditTaskForm.errors.submissionUpdateFailed"));
          return;
        }

        toast.success(t("EditTaskForm.success.submissionUpdate"));
        break;

      default:
        toast.error(t("EditTaskForm.errors.invalidTaskType"));
        return;
    }

    router.push(`/mentor-dashboard/tasks/${task.id}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <QuestionField key={field.id} questionIdx={index} />
          ))}

          <Button type="submit" className="w-full">
            {form.formState.isSubmitting ? <Spinner /> : <Save />}
            {t("EditTaskForm.saveTask")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
