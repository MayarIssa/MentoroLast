"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { API } from "@/lib/api";
import { useTranslations } from "next-intl";
import { Users, BookOpen, ClipboardCheck, Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { AssignResourcesDialog } from "./_components/assign-resources-dialog";
import { AssignedResourcesDialog } from "./_components/assigned-resources-dialog";
import { AssignTaskDialog } from "./_components/assign-task-dialog";
import { AssignedTasksDialog } from "./_components/assigned-tasks-dialog";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function AllStudents() {
  const t = useTranslations("AllStudents");

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: () => API.queries.mentors.getStudentAssignedToMentor(),
  });

  console.log(students);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("heading")}</h1>
        <p className="text-muted-foreground">{t("manage_connect")}</p>
      </div>

      {students.length === 0 ? (
        <Card className="flex h-[50vh] flex-col items-center justify-center border-dashed">
          <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
            <Users className="h-8 w-8 text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold">{t("no_students_title")}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("no_students_description")}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((student, index) => (
            <Card
              key={`${student.stundetId}-${index}`}
              className="flex flex-col"
            >
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {student.studentName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {student.studentName}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {student.planTitle}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {t("start_date")}: {format(student.startDate, "PP")}
                  </span>
                </div>
                <Separator />
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    <AssignedResourcesDialog
                      studentId={student.stundetId}
                      trigger={
                        <span className="cursor-pointer hover:underline">
                          {t("AssignedResourcesDialog.trigger")}
                        </span>
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-green-500" />
                    <AssignedTasksDialog
                      studentId={student.stundetId}
                      trigger={
                        <span className="cursor-pointer hover:underline">
                          {t("AssignedTasksDialog.trigger")}
                        </span>
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch gap-2">
                <AssignResourcesDialog studentId={student.stundetId} />
                <AssignTaskDialog studentId={student.stundetId} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
