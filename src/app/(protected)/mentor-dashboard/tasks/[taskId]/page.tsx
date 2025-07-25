import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { API } from "@/lib/api";
import type { TaskQuestion } from "@/lib/types/tasks";
import { cn } from "@/lib/utils";
import { PenBox } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export default async function Task({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const t = await getTranslations("Tasks");
  const { taskId } = await params;
  if (!taskId || isNaN(+taskId)) {
    return notFound();
  }

  const taskQuestions = await API.queries.tasks.getTaskQuestions(+taskId);
  console.log(taskQuestions);

  if (!taskQuestions) {
    return notFound();
  }

  const totalScore = taskQuestions.reduce((accQuestion, curQuestion) => ({
    ...accQuestion,
    score: accQuestion.score + curQuestion.score,
  })).score;

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">{t("TaskDetails.heading")}</h2>
        <Button asChild>
          <Link href={`/mentor-dashboard/tasks/${taskId}/edit`}>
            <PenBox />
            {t("TaskDetails.editTask")}
          </Link>
        </Button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {t("TaskDetails.questions", { count: taskQuestions.length })}
          </h3>
          <p className="text-sm">
            {t("TaskDetails.totalScore", { score: totalScore })}
          </p>
        </div>
        <div className="space-y-4">
          {taskQuestions.map((question) => (
            <Question key={question.id} question={question} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Question({ question }: { question: TaskQuestion }) {
  const t = useTranslations("Tasks");
  const isArabic = useLocale().startsWith("ar");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h4 className="text-lg">{question.question}</h4>
          <p className="space-x-2 text-sm">
            <span>{t("TaskDetails.score")}</span>
            <span className="bg-muted-foreground text-muted rounded-sm px-2">
              {question.score}
            </span>
          </p>
        </CardTitle>
      </CardHeader>
      {question.options && (
        <CardContent>
          <RadioGroup defaultValue={question.correctAnswer}>
            {question.options.map((option, idx) => {
              const correctOption = option === question.correctAnswer;

              return (
                <div
                  key={`${option}-${idx}`}
                  dir={isArabic ? "rtl" : "ltr"}
                  className={cn(
                    "flex items-center gap-2 rounded-md p-2",
                    correctOption ? "bg-green-600/15" : "bg-red-600/15",
                  )}
                >
                  <RadioGroupItem
                    value={option}
                    disabled
                    className={cn(
                      correctOption &&
                        "border-green-600 [&_svg]:fill-green-600 [&_svg]:stroke-green-600",
                    )}
                  />
                  <Label className={cn(correctOption && "text-green-600")}>
                    {option}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      )}
    </Card>
  );
}
