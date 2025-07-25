"use client";

import { AuthContextProvider } from "@/contexts/auth-context";
import { getQueryClient } from "@/lib/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const client = getQueryClient();

  return (
    <QueryClientProvider client={client}>
      <AuthContextProvider>{children}</AuthContextProvider>
    </QueryClientProvider>
  );
};

export default QueryProvider;
