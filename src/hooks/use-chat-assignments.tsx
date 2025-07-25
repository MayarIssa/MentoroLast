import { API } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useAssignedMentorsQuery() {
  return useQuery({
    queryKey: ["assigned-mentors"],
    queryFn: () => API.queries.chat.getAssigned(),
  });
}
