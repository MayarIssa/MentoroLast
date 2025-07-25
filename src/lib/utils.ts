import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDuration(duration: string) {
  if (!duration) return null;

  const parts = duration.split(".");
  const daysString = parts[0];
  const timeString = parts[1];

  if (!daysString || !timeString) return null;

  const days = parseInt(daysString, 10);
  const timeParts = timeString.split(":");
  const hours = parseInt(timeParts[0] ?? "0", 10);
  const minutes = parseInt(timeParts[1] ?? "0", 10);
  const seconds = parseInt(timeParts[2] ?? "0", 10);

  const result = [];
  if (days > 0) result.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) result.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  if (seconds > 0) result.push(`${seconds} second${seconds > 1 ? "s" : ""}`);

  return result.join(", ");
}
