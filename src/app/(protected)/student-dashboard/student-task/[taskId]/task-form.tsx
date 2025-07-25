"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { API } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface TaskQuestion {
  id: number;
  question: string;
  options?: string[];
  score: number;
  correctAnswer: string;
  taskId: number;
}

interface TaskFormProps {
  questions: TaskQuestion[];
  taskType: "Mcq" | "Submission";
  isCompleted: boolean;
  savedAnswers: string | null;
}

const mcqAnswerSchema = z.object({
  McqId: z.number(),
  SelectedAnswer: z.string().min(1, { message: "mcq_answer_required" }),
  IsCorrect: z.boolean(),
});

const submissionAnswerSchema = z.object({
  SubmissionId: z.number(),
  Text: z.string().min(1, { message: "submission_answer_required" }),
});

const mcqFormSchema = z.object({
  answers: z.array(mcqAnswerSchema),
});

const submissionFormSchema = z.object({
  answers: z.array(submissionAnswerSchema),
});

type McqFormValues = z.infer<typeof mcqFormSchema>;
type SubmissionFormValues = z.infer<typeof submissionFormSchema>;

export default function TaskForm({
  questions,
  taskType,
  isCompleted,
  savedAnswers,
}: TaskFormProps) {
  const t = useTranslations("TaskForm");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const savedAnswersParsed: Record<number, string> = savedAnswers
    ? (JSON.parse(savedAnswers) as Record<number, string>)
    : {};

  const mcqForm = useForm<McqFormValues>({
    resolver: zodResolver(mcqFormSchema),
    defaultValues: {
      answers: questions.map((q) => ({
        McqId: q.id,
        SelectedAnswer: savedAnswersParsed[q.id] ?? "",
        IsCorrect: false,
      })),
    },
  });

  const submissionForm = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues: {
      answers: questions.map((q) => ({
        SubmissionId: q.id,
        Text: savedAnswersParsed[q.id] ?? "",
      })),
    },
  });

  const onSubmitMcq = async (data: McqFormValues) => {
    setIsSubmitting(true);
    try {
      const answersWithCorrectness = data.answers.map((answer) => {
        const question = questions.find((q) => q.id === answer.McqId);
        return {
          ...answer,
          IsCorrect: question?.correctAnswer === answer.SelectedAnswer,
        };
      });

      await API.mutations.tasks.submitMcqTask(answersWithCorrectness);

      toast.success(t("success_mcq_toast"));
      router.refresh();
    } catch (error) {
      toast.error(t("error_toast"));
      console.error("Failed to submit MCQ task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitSubmission = async (data: SubmissionFormValues) => {
    setIsSubmitting(true);
    try {
      await API.mutations.tasks.submitSubmissionTask(data.answers);

      toast.success(t("success_submission_toast"));
      router.refresh();
    } catch (error) {
      toast.error(t("error_toast"));
      console.error("Failed to submit submission task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted || questions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {taskType === "Mcq" ? (
        <Form {...mcqForm}>
          <form
            onSubmit={mcqForm.handleSubmit(onSubmitMcq)}
            className="space-y-6"
          >
            {questions.map((question, index) => (
              <FormField
                key={question.id}
                control={mcqForm.control}
                name={`answers.${index}.SelectedAnswer`}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-medium">
                      {t("question_label", {
                        index: index + 1,
                        question: question.question,
                      })}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2"
                      >
                        {question.options?.map((option, optionIndex) => (
                          <div
                            key={`${option}-${optionIndex}`}
                            className="hover:bg-muted/50 flex items-center space-x-3 rounded-lg border p-3"
                          >
                            <RadioGroupItem
                              value={option}
                              id={`q${question.id}-option${optionIndex}`}
                            />
                            <Label
                              htmlFor={`q${question.id}-option${optionIndex}`}
                              className="flex-1 cursor-pointer text-sm"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage>{t("mcq_answer_required")}</FormMessage>
                  </FormItem>
                )}
              />
            ))}

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              {isSubmitting ? t("submitting_button") : t("submit_mcq_button")}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...submissionForm}>
          <form
            onSubmit={submissionForm.handleSubmit(onSubmitSubmission)}
            className="space-y-6"
          >
            {questions.map((question, index) => (
              <FormField
                key={question.id}
                control={submissionForm.control}
                name={`answers.${index}.Text`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      {t("question_label", {
                        index: index + 1,
                        question: question.question,
                      })}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{t("submission_answer_required")}</FormMessage>
                  </FormItem>
                )}
              />
            ))}

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              {isSubmitting
                ? t("submitting_button")
                : t("submit_submission_button")}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
