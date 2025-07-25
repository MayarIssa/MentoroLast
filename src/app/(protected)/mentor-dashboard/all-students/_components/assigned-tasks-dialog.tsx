"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAssignedTasks } from "@/hooks/use-tasks";
import { API } from "@/lib/api";
import { toast } from "sonner";
import { Check, ClipboardList, Loader2, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export function AssignedTasksDialog({
  studentId,
  trigger,
}: {
  studentId: number;
  trigger?: React.ReactNode;
}) {
  const t = useTranslations("AllStudents.AssignedTasksDialog");
  const queryClient = useQueryClient();
  const { data: assignedTasks, isPending: assignedTasksLoading } =
    useAssignedTasks(studentId);

  async function handleUnassignTask(taskId: number, taskTitle: string) {
    try {
      const res = await API.mutations.tasks.unassignTaskFromStudent(
        studentId,
        taskId,
      );

      if (res) {
        toast.success(t("unassign_success", { title: taskTitle }));
        void queryClient.invalidateQueries({
          queryKey: ["assigned-tasks", studentId],
        });
      }
    } catch {
      toast.warning(t("unassign_error"));
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant={"outline"}>
            <ClipboardList />
            {t("button")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {assignedTasksLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin" />
              <span className="ml-2">{t("loading")}</span>
            </div>
          ) : assignedTasks && assignedTasks.length > 0 ? (
            assignedTasks.map((task, index) => (
              <Card key={`${task.taskTitle}-${index}`} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {task.taskTitle}
                      </CardTitle>
                      <Badge variant="outline" className="w-fit">
                        {t("score", { score: task.finalScore })}
                      </Badge>
                    </div>
                    <Button
                      variant={task.finalScore > 0 ? "default" : "destructive"}
                      size="sm"
                      onClick={() =>
                        handleUnassignTask(task.tasksId, task.taskTitle)
                      }
                      disabled={task.finalScore > 0 || assignedTasksLoading}
                    >
                      {assignedTasksLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : task.finalScore > 0 ? (
                        <Check className="size-4" />
                      ) : (
                        <X className="size-4" />
                      )}
                      {task.finalScore > 0
                        ? t("completed_button")
                        : t("unassign_button")}
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))
          ) : (
            <div className="text-muted-foreground py-8 text-center">
              <ClipboardList className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>{t("no_tasks")}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
