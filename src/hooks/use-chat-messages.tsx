import { API } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useChatMessages(assignmentId?: number) {
  return useQuery({
    queryKey: ["chat-messages", assignmentId],
    queryFn: () => API.queries.chat.getChatMessages(assignmentId!),
    enabled: !!assignmentId,
  });
}
