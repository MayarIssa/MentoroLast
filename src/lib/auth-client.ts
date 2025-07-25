// src/lib/auth-client.ts
"use client";

import { getCurrentUser } from "@/server/actions/auth";

export async function getClientCurrentUser() {
  const user = await getCurrentUser();
  return user;
}