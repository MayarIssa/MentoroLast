"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { API } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  Star,
  Trophy,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import TaskForm from "./task-form";

interface TaskQuestion {
  id: number;
  question: string;
  options?: string[];
  score: number;
  correctAnswer: string;
  taskId: number;
}

type TaskDetails = Awaited<ReturnType<typeof API.queries.tasks.getTaskDetails>>;

export default function StudentTaskPage() {
  const t = useTranslations("StudentTaskPage");
  const params = useParams();
  const taskId = params.taskId as string;

  const { data: task, isLoading } = useQuery<TaskDetails>({
    queryKey: ["task", taskId],
    queryFn: () => API.queries.tasks.getTaskDetails(Number(taskId)),
  });

  if (!taskId || isNaN(+taskId)) {
    return <div>{t("task_not_found")}</div>;
  }

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  if (!task) {
    return <div>{t("task_not_found")}</div>;
  }

  const hasActiveQuestions = task.mcqQuestions && task.mcqQuestions.length > 0;
  const hasSubmittedMcq = Array.isArray(task.mcqAnswers);

  const taskType: "Mcq" | "Submission" =
    hasActiveQuestions || hasSubmittedMcq ? "Mcq" : "Submission";

  const questions =
    (taskType === "Mcq" ? task.mcqQuestions : task.submissionQuestions) ?? [];
  const totalScore = questions?.reduce((sum, q) => sum + q.score, 0) ?? 0;
  const completionPercentage = task.isCompleted ? 100 : 0;

  const getSavedAnswersForForm = (): string | null => {
    if (taskType === "Mcq") {
      const mcqAnswers = task.mcqAnswers;
      if (Array.isArray(mcqAnswers)) {
        const answersMap: Record<number, string> = {};
        mcqAnswers.forEach((answer) => {
          answersMap[answer.mcqId] = answer.selectedAnswer;
        });
        return JSON.stringify(answersMap);
      }
      return typeof mcqAnswers === "string" ? mcqAnswers : null;
    } else {
      const submissionAnswers = task.submissionAnswers;
      if (Array.isArray(submissionAnswers)) {
        const answersMap: Record<number, string> = {};
        submissionAnswers.forEach((answer) => {
          answersMap[answer.submissionId] = answer.text;
        });
        return JSON.stringify(answersMap);
      }
      return typeof submissionAnswers === "string" ? submissionAnswers : null;
    }
  };

  return (
    <section className="space-y-4">
      <Card className="bg-card border">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                  {taskType === "Mcq" ? (
                    <HelpCircle className="text-primary size-5" />
                  ) : (
                    <FileText className="text-primary size-5" />
                  )}
                </div>
                <div>
                  <h1 className="text-foreground text-2xl font-bold">
                    {task.taskTitle}
                  </h1>
                  <p className="text-muted-foreground">
                    {t("task_label", { taskId: task.tasksId })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge
                variant={taskType === "Mcq" ? "default" : "secondary"}
                className="text-sm"
              >
                {t(taskType === "Mcq" ? "multiple_choice" : "submission")}
              </Badge>

              {task.isCompleted ? (
                <Badge
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="mr-1 size-3" />
                  {t("completed")}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <Clock className="mr-1 size-3" />
                  {t("in_progress")}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="w-full">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t("progress_label")}
              </span>
              <span className="font-medium">
                {t("progress_value", { percentage: completionPercentage })}
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">
                  {t("questions_label")}
                </p>
                <p className="text-2xl font-bold">{questions?.length ?? 0}</p>
              </div>
              <BookOpen className="text-primary size-8" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">
                  {t("total_score_label")}
                </p>
                <p className="text-2xl font-bold">{totalScore}</p>
              </div>
              <Star className="size-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">
                  {t("status_label")}
                </p>
                <p className="text-2xl font-bold">
                  {t(task.isCompleted ? "status_done" : "status_pending")}
                </p>
              </div>
              {task.isCompleted ? (
                <Trophy className="size-8 text-green-500" />
              ) : (
                <AlertCircle className="size-8 text-orange-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t("questions_heading")}</h2>
        </div>

        {!questions || questions.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="text-muted-foreground mb-4 size-12" />
              <h3 className="mb-2 text-lg font-medium">{t("no_questions")}</h3>
              <p className="text-muted-foreground text-center">
                {t("no_questions_description")}
              </p>
            </CardContent>
          </Card>
        ) : task.isCompleted ? (
          <div className="space-y-6">
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index + 1}
                taskType={taskType}
                isComplete={task.isCompleted}
                savedAnswers={getSavedAnswersForForm()}
              />
            ))}
          </div>
        ) : (
          <TaskForm
            questions={questions}
            taskType={taskType}
            isCompleted={task.isCompleted}
            savedAnswers={getSavedAnswersForForm()}
          />
        )}
      </div>
    </section>
  );
}

function QuestionCard({
  question,
  index,
  taskType,
  isComplete,
  savedAnswers,
}: {
  question: TaskQuestion;
  index: number;
  taskType: "Mcq" | "Submission";
  isComplete: boolean;
  savedAnswers: string | null;
}) {
  const t = useTranslations("StudentTaskPage.QuestionCard");
  const parsedAnswers = savedAnswers
    ? (JSON.parse(savedAnswers) as Record<number, string>)
    : {};
  const selectedAnswer = parsedAnswers[question.id] ?? null;

  const isCorrect = selectedAnswer === question.correctAnswer;
  return (
    <Card
      key={question.id}
      className={cn(
        "overflow-hidden",
        isComplete &&
          (taskType === "Submission"
            ? "border-blue-500"
            : isCorrect
              ? "border-green-500"
              : "border-red-500"),
      )}
    >
      <CardHeader className="bg-muted/50 flex flex-row items-center justify-between p-4">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          {t("question_title", { index })}
          <span className="text-muted-foreground text-sm font-normal">
            ({t("score", { score: question.score })})
          </span>
        </CardTitle>
        {isComplete && taskType === "Mcq" && (
          <Badge
            variant={isCorrect ? "default" : "destructive"}
            className={cn(
              isCorrect && "bg-green-500",
              "flex items-center gap-1",
            )}
          >
            {isCorrect ? (
              <CheckCircle2 className="size-3" />
            ) : (
              <AlertCircle className="size-3" />
            )}
            {t(isCorrect ? "correct" : "incorrect")}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <p className="mb-4">{question.question}</p>
        {taskType === "Mcq" ? (
          <RadioGroup
            value={isComplete ? selectedAnswer : undefined}
            disabled={isComplete}
            className="space-y-2"
          >
            {question.options?.map((option, optionIndex) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = question.correctAnswer === option;

              return (
                <div
                  key={`${option}-${optionIndex}`}
                  className={cn(
                    "flex items-center space-x-3 rounded-md border p-3",
                    isComplete &&
                      isCorrectOption &&
                      "border-green-500 bg-green-500/10",
                    isComplete &&
                      isSelected &&
                      !isCorrectOption &&
                      "border-red-500 bg-red-500/10",
                  )}
                >
                  <RadioGroupItem
                    value={option}
                    id={`q${question.id}-option${optionIndex}`}
                  />
                  <Label
                    htmlFor={`q${question.id}-option${optionIndex}`}
                    className="flex-1 cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        ) : (
          <Textarea
            value={selectedAnswer ?? ""}
            readOnly={isComplete}
            className={cn(
              "min-h-[120px] resize-none",
              isComplete && "bg-muted/50",
            )}
            placeholder={t("submission_placeholder")}
          />
        )}
      </CardContent>

      {isComplete && taskType === "Mcq" && !isCorrect && (
        <CardFooter className="bg-muted/50 border-t p-4">
          <div className="text-sm">
            <p className="font-medium">{t("correct_answer_label")}</p>
            <p className="text-muted-foreground">{question.correctAnswer}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
