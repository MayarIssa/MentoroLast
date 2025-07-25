"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { QuestionField } from "./question-field";
import { useRouter } from "next/navigation";
import { API } from "@/lib/api";
import { tryCatch } from "@/lib/utils/try-catch";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import type { useTranslations as useTranslationsType } from "next-intl";

function getCreateTaskFormSchema(
  t: ReturnType<typeof useTranslationsType<"Tasks.CreateTaskForm">>,
) {
  const McqQuestionSchema = z.object({
    question: z.string().min(2, { message: t("validation.questionRequired") }),
    score: z.coerce.number().min(1, { message: t("validation.scoreRequired") }),
    options: z.array(z.object({ id: z.string(), value: z.string() })),
    answer: z.string().min(2, { message: t("validation.answerRequired") }),
  });

  const SubmissionQuestionSchema = z.object({
    question: z.string().min(2, { message: t("validation.questionRequired") }),
    score: z.coerce.number().min(1, { message: t("validation.scoreRequired") }),
  });

  return z.discriminatedUnion("type", [
    z.object({
      title: z.string().min(2, { message: t("validation.titleRequired") }),
      type: z.literal("Mcq"),
      questions: z.array(McqQuestionSchema),
    }),

    z.object({
      title: z.string().min(2, { message: t("validation.titleRequired") }),
      type: z.literal("Submission"),
      questions: z.array(SubmissionQuestionSchema),
    }),
  ]);
}

export type TCreateTaskFormSchema = z.infer<
  ReturnType<typeof getCreateTaskFormSchema>
>;

export function CreateTaskForm({
  defaultValues,
}: {
  defaultValues?: TCreateTaskFormSchema;
}) {
  const t = useTranslations("Tasks.CreateTaskForm");
  const CreateTaskFormSchema = getCreateTaskFormSchema(t);

  const form = useForm<TCreateTaskFormSchema>({
    resolver: zodResolver(CreateTaskFormSchema),
    defaultValues: defaultValues ?? {
      title: "",
      type: "Mcq",
      questions: [],
    },
  });
  const router = useRouter();

  const {
    fields: questionsFields,
    append: addQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  async function onSubmit(values: TCreateTaskFormSchema) {
    const { data: task, error: createTaskError } = await tryCatch(
      API.mutations.tasks.createTask({
        Title: values.title,
        TaskType: values.type,
      }),
    );

    if (createTaskError) {
      toast.error(t("errors.createTaskFailed"));
      return;
    }

    let questionPromises: Promise<unknown>[] = [];

    switch (values.type) {
      case "Mcq": {
        questionPromises = values.questions.map((question) => {
          const mcqQuestion = {
            TaskId: task.id,
            Question: question.question,
            Score: question.score,
            Options: question.options.map((option) => option.value),
            CorrectAnswer: question.options.find(
              (option) => option.id === question.answer,
            )!.value,
          };

          return API.mutations.tasks.createMcqQuestion(mcqQuestion);
        });
        break;
      }

      case "Submission": {
        questionPromises = values.questions.map((question) => {
          const submissionQuestion = {
            TaskId: task.id,
            Question: question.question,
            Score: question.score,
          };

          return API.mutations.tasks.createSubmissionQuestion(
            submissionQuestion,
          );
        });
        break;
      }
    }

    const { error: createQuestionsError } = await tryCatch(
      Promise.all(questionPromises),
    );

    if (createQuestionsError) {
      toast.error(t("errors.createQuestionsFailed"));
      return;
    }

    const { error: confirmTaskError } = await tryCatch(
      API.mutations.tasks.confirmTask(task.id),
    );

    if (confirmTaskError) {
      toast.error("errors.confirmTaskFailed");
      return;
    }

    toast.success(t("success.taskCreated"));
    router.replace("/mentor-dashboard/tasks");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
        <h3 className="text-2xl font-semibold">{t("taskInfo")}</h3>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder={t("titlePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("taskType")}</FormLabel>

              <Select
                onValueChange={(value) => {
                  const questions = form.getValues("questions");

                  // remove every question when changing task type
                  removeQuestion(
                    new Array(questions.length).fill(0).map((_, idx) => idx),
                  );

                  field.onChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("selectTaskType")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Mcq">{t("mcq")}</SelectItem>
                  <SelectItem value="Submission">{t("submission")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <h3 className="text-2xl font-semibold">{t("questions")}</h3>

        <div className="space-y-4">
          {questionsFields.map((_, questionIdx) => (
            <QuestionField
              key={questionIdx}
              questionIdx={questionIdx}
              remove={removeQuestion}
            />
          ))}
        </div>

        <div
          className="flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed p-8 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          onClick={() =>
            addQuestion({
              question: "",
              score: 1,
            })
          }
        >
          <Plus size={16} />
          {t("addQuestion")}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <Spinner />}
          {t("submit")}
        </Button>
      </form>
    </Form>
  );
}
