"use server";

import { API_URL } from "@/lib/constants";

export async function checkEmailExists(email: string) {
  const res = await fetch(`${API_URL}/api/Account/EmailExist?Email=${email}`);

  const emailExists = (await res.json()) as boolean;
  return emailExists;
}
