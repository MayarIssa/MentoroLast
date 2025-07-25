"use server";

import { cookies } from "next/headers";
import { z } from "zod";

export async function changeLanguage(locale: "en" | "ar") {
  const localeSchema = z.enum(["en", "ar"]);
  const parsedLocale = await localeSchema.parseAsync(locale);

  const cookieStore = await cookies();
  cookieStore.set("locale", parsedLocale);

  return { ok: true };
}
