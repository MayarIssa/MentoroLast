import { BACKEND_HOSTS, DEMO_MODE } from "./config";
import { handleDemoRequest } from "./handler";

/**
 * In demo mode, requests to the backend are answered locally from the demo
 * dataset. This works the same in the browser, in server actions and in the
 * middleware, so every page sees consistent data.
 */
const FLAG = "__mentoroDemoFetch";

type PatchedGlobal = typeof globalThis & { [FLAG]?: boolean };

function toUrl(input: RequestInfo | URL): URL | null {
  try {
    if (typeof input === "string") return new URL(input);
    if (input instanceof URL) return input;
    return new URL(input.url);
  } catch {
    return null;
  }
}

if (
  DEMO_MODE &&
  typeof globalThis.fetch === "function" &&
  !(globalThis as PatchedGlobal)[FLAG]
) {
  const realFetch = globalThis.fetch.bind(globalThis);

  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = toUrl(input);
    if (url && BACKEND_HOSTS.includes(url.hostname)) {
      let requestInit = init;
      if (
        !requestInit &&
        typeof Request !== "undefined" &&
        input instanceof Request
      ) {
        requestInit = { method: input.method, headers: input.headers };
      }
      // Small delay so loading states are visible, like a real network call.
      await new Promise((r) => setTimeout(r, 120));
      return handleDemoRequest(url, requestInit);
    }
    return realFetch(input, init);
  };

  (globalThis as PatchedGlobal)[FLAG] = true;
}

export {};
