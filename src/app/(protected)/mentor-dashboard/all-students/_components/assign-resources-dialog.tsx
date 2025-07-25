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
import {
  AssignResourceForm,
  type AssignResourceFormSchema,
} from "./assign-resources-form";
import { API } from "@/lib/api";
import { toast } from "sonner";
import { Book } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function AssignResourcesDialog({
  studentId,
  className,
}: {
  studentId: number;
  className?: string;
}) {
  const t = useTranslations("AllStudents.AssignResourcesDialog");
  const queryClient = useQueryClient();

  async function onSubmit(data: AssignResourceFormSchema) {
    const res = await API.mutations.resources.assignResource(
      data.resourceId,
      studentId,
    );

    if (res) {
      toast.success(t("success_toast"));
      void queryClient.invalidateQueries({
        queryKey: ["mentor-assigned-resources"],
      });
    } else {
      toast.warning(t("error_toast"));
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className={cn("w-full", className)}>
          <Book className="mr-2 h-4 w-4" />
          {t("button")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <AssignResourceForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
