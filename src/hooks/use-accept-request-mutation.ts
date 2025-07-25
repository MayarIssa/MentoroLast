import { API } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAcceptRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => {
      return API.mutations.requests.acceptRequest(requestId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["student-requests"],
      });
    },
    meta: {
      successMessage: "Request accepted",
      errorMessage: "Failed to accept request",
    },
  });
}

export function useRejectRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => {
      return API.mutations.requests.rejectRequest(requestId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["student-requests"],
      });
    },
    meta: {
      successMessage: "Request declined",
      errorMessage: "Failed to decline request",
    },
  });
}
