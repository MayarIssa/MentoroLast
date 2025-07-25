import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    OPENROUTER_API_KEY: z.string().optional(),
  },
  client: {
    // No client-side env vars needed for now
  },
  runtimeEnv: {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
