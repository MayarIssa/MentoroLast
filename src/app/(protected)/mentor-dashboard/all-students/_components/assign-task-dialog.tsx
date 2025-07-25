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
import { AssignTaskForm, type AssignTaskFormSchema } from "./assign-task-form";
import { API } from "@/lib/api";
import { toast } from "sonner";
import { ClipboardList } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function AssignTaskDialog({
  studentId,
  className,
}: {
  studentId: number;
  className?: string;
}) {
  const t = useTranslations("AllStudents.AssignTaskDialog");
  const queryClient = useQueryClient();

  async function onSubmit(data: AssignTaskFormSchema) {
    try {
      const res = await API.mutations.tasks.assignTaskToStudent(
        studentId,
        data.taskId,
      );

      if (res) {
        toast.success(t("success_toast"));
        void queryClient.invalidateQueries({
          queryKey: ["assigned-tasks"],
        });
      }
    } catch {
      toast.warning(t("error_toast"));
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className={cn("w-full", className)}>
          <ClipboardList className="mr-2 h-4 w-4" />
          {t("button")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <AssignTaskForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
