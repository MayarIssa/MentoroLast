"use client";

import { API } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useTasks() {
  const query = useQuery({
    queryKey: ["mentor-tasks"],
    queryFn: () => API.queries.tasks.getMentorTasks(),
  });

  return query;
}

export function useAssignedTasks(studentId: number) {
  const query = useQuery({
    queryKey: ["assigned-tasks", studentId],
    queryFn: () => API.queries.tasks.getAssignedTasksToStudent(studentId),
  });

  return query;
}
