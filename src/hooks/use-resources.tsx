"use client";

import { API } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useResources() {
  const query = useQuery({
    queryKey: ["resources"],
    queryFn: () => API.queries.resources.getResources(),
  });

  return query;
}

export function useResource(id: number) {
  const query = useQuery({
    queryKey: ["resource", id],
    queryFn: () => API.queries.resources.getResourceById(id),
  });

  return query;
}
