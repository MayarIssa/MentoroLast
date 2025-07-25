"use client";

import { API } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Star,
  Trophy,
  User,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";

interface StudentTask {
  finalScore: number;
  id: number;
  mentorId: number;
  mentorName: string;
  submittedOn: string;
  taskTitle: string;
  tasksId: number;
}

function TaskCard({ task }: { task: StudentTask }) {
  const t = useTranslations("StudentTasksList");
  const submittedDate = new Date(task.submittedOn);
  const timeAgo = formatDistanceToNow(submittedDate, { addSuffix: true });

  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="h-5 w-5 text-blue-600" />
              {task.taskTitle}
            </CardTitle>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>{t("mentor_label", { name: task.mentorName })}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{t("submitted_label", { timeAgo })}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto h-[2rem] border-t">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/student-dashboard/student-task/${task.tasksId}`}>
            <FileText className="mr-2 h-4 w-4" />
            {t("view_details_button")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function EmptyState() {
  const t = useTranslations("StudentTasksList");

  return (
    <Card className="py-12 text-center">
      <CardContent className="space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <BookOpen className="h-8 w-8 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("no_tasks")}
          </h3>
          <p className="mx-auto max-w-md text-gray-600">
            {t("no_tasks_description")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function TasksStats({ tasks }: { tasks: StudentTask[] }) {
  const t = useTranslations("StudentTasksList");
  const totalTasks = tasks.length;
  const averageScore =
    totalTasks > 0
      ? Math.round(
          tasks.reduce((sum, task) => sum + task.finalScore, 0) / totalTasks,
        )
      : 0;
  const excellentTasks = tasks.filter((task) => task.finalScore >= 80).length;

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                {t("total_tasks_label")}
              </p>
              <p className="text-2xl font-bold">{totalTasks}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                {t("average_score_label")}
              </p>
              <p className="text-2xl font-bold">
                {t("average_score_value", { score: averageScore })}
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                {t("excellent_tasks_label")}
              </p>
              <p className="text-2xl font-bold">{excellentTasks}</p>
            </div>
            <Trophy className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function StudentTaskPage() {
  const t = useTranslations("StudentTasksList");

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["student-tasks"],
    queryFn: () => API.queries.tasks.getStudentTasks(),
  });

  if (isLoading) {
    return <div>{t("Loading")}</div>;
  }

  return (
    <MaxWidthWrapper>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("heading")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        {tasks.length > 0 && <TasksStats tasks={tasks} />}

        <div className="space-y-6">
          {tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {t("completed_tasks_heading")}
                </h2>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>
                    {t("tasks_count", {
                      count: tasks.length,
                    })}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map((task) => (
                  <TaskCard key={task.tasksId} task={task} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
