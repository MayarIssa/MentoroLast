import { getCurrentUser } from "@/server/actions/auth";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    staleTime: Infinity,
    retry: 2,
  });

  return query;
}
