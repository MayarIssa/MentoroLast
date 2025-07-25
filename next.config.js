// next.config.js
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        hostname: "mentorohelp.runasp.net",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "23mb",
    },
  },
  env: {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  },
  transpilePackages: ['ai', 'openai'],
};

export default withNextIntl(config);
