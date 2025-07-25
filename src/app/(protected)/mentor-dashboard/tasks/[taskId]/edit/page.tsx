import { notFound } from "next/navigation";
import { EditTaskForm } from "./_components/edit-task-form";
import { API } from "@/lib/api";
import { getTranslations } from "next-intl/server";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default async function EditTask({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const t = await getTranslations("Tasks");
  const { taskId } = await params;

  if (isNaN(+taskId)) {
    return notFound();
  }

  const taskPromise = API.queries.tasks.getTaskById(+taskId);
  const questionsPromise = API.queries.tasks.getTaskQuestions(+taskId);
  const [task, questions] = await Promise.all([taskPromise, questionsPromise]);

  if (!task || !questions) {
    return notFound();
  }

  const parsedQuestions = questions.map((question) => ({
    id: question.id,
    taskId: question.taskId,
    question: question.question,
    options:
      question.options?.map((option) => ({
        value: option,
      })) ?? [],
    answer: question.correctAnswer,
    score: question.score,
  }));

  return (
    <MaxWidthWrapper>
      <section className="space-y-4">
        <h3 className="text-3xl font-semibold">{t("EditTask.heading")}</h3>
        <EditTaskForm task={task} questions={parsedQuestions} />
      </section>
    </MaxWidthWrapper>
  );
}
