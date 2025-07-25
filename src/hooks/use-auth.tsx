"use client";

import { AuthContext } from "@/contexts/auth-context";
import { useContext } from "react";

const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("Component must be used within a AuthContextProvider");
  }

  return ctx;
};

export default useAuth;
