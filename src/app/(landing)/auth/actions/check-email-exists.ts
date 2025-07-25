"use server";

export async function checkEmailExists(email: string) {
  const API_URL = "http://mentorohelp.runasp.net";

  const res = await fetch(`${API_URL}/api/Account/EmailExist?Email=${email}`);

  const emailExists = (await res.json()) as boolean;
  return emailExists;
}
