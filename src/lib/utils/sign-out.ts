"use client";

export function SignOut() {
  localStorage.setItem("mentoro-session", "");
}
