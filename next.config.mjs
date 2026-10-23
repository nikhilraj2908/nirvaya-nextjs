/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PREVIEW_MODE: process.env.PREVIEW_MODE || process.env.NEXT_PUBLIC_PREVIEW_MODE || '',
  },
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
