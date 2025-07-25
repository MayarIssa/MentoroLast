import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { API } from "@/lib/api";
import { FileText, ClipboardList } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function TaskCards() {
  const t = await getTranslations("Tasks");
  const tasks = await API.queries.tasks.getMentorTasks();

  if (tasks.length === 0) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center rounded-lg border-2 border-dashed">
        <ClipboardList className="mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-xl font-semibold">{t("TaskCards.noTasks")}</h3>
        <p className="text-muted-foreground">
          {t("TaskCards.noTasksDescription")}
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <Link
            key={task.id}
            href={`/mentor-dashboard/tasks/${task.id}`}
            passHref
          >
            <Card className="flex h-full transform flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <CardHeader className="bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <FileText className="text-primary h-5 w-5" />
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CardTitle className="line-clamp-1 text-lg font-semibold">
                        {task.title}
                      </CardTitle>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{task.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{t("TaskCards.taskType")}</span>
                  <span className="text-muted-foreground">{task.taskType}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </TooltipProvider>
  );
}

export function TaskCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <Card
          key={idx}
          className="flex h-full transform flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300"
        >
          <CardHeader className="bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-4">
            <div className="flex justify-between text-sm">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
