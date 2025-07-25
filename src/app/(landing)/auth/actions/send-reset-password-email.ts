"use server";

import { API_URL } from "@/lib/constants";

export async function SendResetPasswordEmail(email: string) {
  const res = await fetch(`${API_URL}/api/Account/SendEmail?Email=${email}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json() as Promise<{ success: boolean }>;
}
