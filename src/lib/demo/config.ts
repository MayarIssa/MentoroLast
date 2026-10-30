/**
 * Demo mode serves realistic sample data in place of the live backend so the
 * whole platform can be explored from the deployed site.
 *
 * It is on by default. Set NEXT_PUBLIC_DEMO_MODE=false to talk to the real API.
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export const BACKEND_URL = "http://mentorohelp.runasp.net";

/** Hosts whose requests are answered by the demo layer. */
export const BACKEND_HOSTS = ["mentorohelp.runasp.net"];

/** Demo accounts shown on the login screen. */
export const DEMO_ACCOUNTS = {
  student: { email: "student@mentoro.demo", password: "Mentoro123!" },
  mentor: { email: "mentor@mentoro.demo", password: "Mentoro123!" },
  admin: { email: "admin@mentoro.demo", password: "Mentoro123!" },
} as const;

/**
 * Builds a URL for an image or file returned by the API.
 * Demo assets live in /public/demo and are served locally; anything else is
 * resolved against the backend.
 */
export function apiAsset(path: string | null | undefined): string {
  if (!path || typeof path !== "string") {
    return DEMO_MODE
      ? "/demo/avatars/default.svg"
      : `${BACKEND_URL}/ImagesFiles/default.png`;
  }

  const normalized = path.replace(/\\/g, "/");
  const demoIndex = normalized.indexOf("/demo/");
  if (demoIndex !== -1) {
    return normalized.slice(demoIndex);
  }

  if (/^https?:\/\//.test(normalized)) {
    return normalized;
  }

  return `${BACKEND_URL}${normalized.startsWith("/") ? "" : "/"}${normalized}`;
}
