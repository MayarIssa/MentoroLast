"use client";

import { API } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAdminComplaints() {
  return useQuery({
    queryKey: ["admin-complaints"],
    queryFn: () => API.queries.admin.getAllComplaints(),
  });
}

export function useAcceptComplaintMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => API.mutations.admin.acceptComplaint(id),
    meta: {
      successMessage: "Complaint accepted successfully",
      errorMessage: "Failed to accept complaint",
      invalidateQuery: ["admin-complaints"],
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["admin-complaints"],
      });
    },
  });
}

export function useRejectComplaintMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes: string }) =>
      API.mutations.admin.rejectComplaint(id, notes),
    meta: {
      successMessage: "Complaint rejected successfully",
      errorMessage: "Failed to reject complaint",
      invalidateQuery: ["admin-complaints"],
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["admin-complaints"],
      });
    },
  });
}

export function useDeleteComplaintMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => API.mutations.admin.deleteComplaint(id),
    meta: {
      successMessage: "Complaint deleted successfully",
      errorMessage: "Failed to delete complaint",
      invalidateQuery: ["admin-complaints"],
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["admin-complaints"],
      });
    },
  });
}

export function useArchivedComplaints() {
  return useQuery({
    queryKey: ["admin-complaints", "archived"],
    queryFn: () => API.queries.admin.getArchivedComplaints(),
  });
}
