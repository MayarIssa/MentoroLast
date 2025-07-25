"use client";
import { API } from "@/lib/api";
import { useQueries, useQuery } from "@tanstack/react-query";

export function useFiles(filePaths: string[]) {
  const queries = useQueries({
    queries: filePaths.map((filePath) => ({
      queryKey: ["file", filePath],
      queryFn: async () => {
        const blob = await API.queries.resources.getBlobByPath(filePath);
        const file = new File([blob], filePath.split("_").pop() ?? "file", {
          type: blob.type,
        });

        return file;
      },
    })),
  });

  return queries;
}

export function useFile(filePath: string) {
  const query = useQuery({
    queryKey: ["file", filePath],
    queryFn: () => API.queries.resources.getBlobByPath(filePath),
  });

  return query;
}
