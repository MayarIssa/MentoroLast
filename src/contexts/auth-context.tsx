"use client";

import { logout } from "@/server/actions/auth";
import { useUser } from "@/hooks/use-user";
import { API_URL } from "@/lib/constants";
import type { User } from "@/lib/types";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

interface AuthContextValues {
  user: User | null;
  logout: () => Promise<void>;
  parseImageUrl: (image: string | undefined | null) => string;
}

export interface LoginInfo {
  email: string;
  password: string;
}

export type RegisterType = "Student" | "Mentor";

export const AuthContext = createContext<AuthContextValues | null>(null);

export const AuthContextProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const { data: userData, isPending: isUserPending } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isUserPending) return;

    if (!userData) {
      setUser(null);
      return;
    }

    setUser({
      ...userData,
      image: parseImageUrl(userData.image),
    });
  }, [userData, isUserPending]);

  const parseImageUrl = (image: string | undefined | null): string => {
    if (!image || typeof image !== "string") {
      return `${API_URL}/ImagesFiles/default.png`;
    }

    // Normalize path separators (handle both \ and /)
    const normalizedPath = image.replace(/\\/g, "/");
    const fileName = normalizedPath.split("/").pop();

    return `${API_URL}/ImagesFiles/${fileName}`;
  };

  const clientLogout = async () => {
    setUser(null);
    await logout();

    router.replace("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user: user,
        logout: clientLogout,
        parseImageUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
