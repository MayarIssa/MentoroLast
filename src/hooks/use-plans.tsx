import { API } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: () => API.queries.plans.getPlans(),
  });
}
