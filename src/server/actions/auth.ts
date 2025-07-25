"use server";

import { API_URL } from "@/lib/constants";
import type { User } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/Account/Login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Email: email,
      Password: password,
    }),
  });

  const data = (await res.json()) as User;

  // set the cookie
  const cookieStore = await cookies();
  cookieStore.set("mentoro-token", data.token);

  return data;
}

export async function registerStudent(registerData: FormData) {
  const res = await fetch(`${API_URL}/api/Account/RegisterStudent`, {
    method: "POST",
    body: registerData,
  });

  const data = (await res.json()) as User;

  // set the cookie
  const cookieStore = await cookies();
  cookieStore.set("mentoro-token", data.token);

  return data;
}

export async function registerMentor(registerData: FormData) {
  const res = await fetch(`${API_URL}/api/Account/RegisterMentor`, {
    method: "POST",
    body: registerData,
  });

  const data = await res.text();
  return data;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("mentoro-token")?.value;

  if (!token) {
    return null;
  }

  const res = await fetch(`${API_URL}/api/Account/GetCurrentUser`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return null;
  }

  const userData = (await res.json()) as User;
  return userData;
}

export async function getUserToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("mentoro-token")?.value;

  if (!token) {
    return null;
  }

  return token;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("mentoro-token");

  redirect("/");
}
