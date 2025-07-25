import { API } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useAcceptMentorRequestMutation() {
  return useMutation({
    mutationFn: (requestId: string) => {
      return API.mutations.admin.acceptMentorRequest(requestId);
    },
    meta: {
      successMessage: "Mentor request accepted successfully",
      errorMessage: "Failed to accept mentor request",
    },
  });
}

export function useRejectMentorRequestMutation() {
  return useMutation({
    mutationFn: (requestId: string) => {
      return API.mutations.admin.rejectMentorRequest(requestId);
    },
    meta: {
      successMessage: "Mentor request rejected",
      errorMessage: "Failed to reject mentor request",
    },
  });
}
