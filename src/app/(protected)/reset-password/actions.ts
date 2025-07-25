"use server";

import { API_URL } from "@/lib/constants";

export async function resetPassword(
  email: string,
  token: string,
  newPassword: string,
) {
  const res = await fetch(`${API_URL}/api/Account/ResetPassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Email: email,
      Token: token,
      Password: newPassword,
    }),
  });

  const data = (await res.json()) as {
    success: boolean;
    message: string;
  };

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
}
