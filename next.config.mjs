/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PREVIEW_MODE: process.env.PREVIEW_MODE || process.env.NEXT_PUBLIC_PREVIEW_MODE || '',
  },
  /* config options here */
};

export default nextConfig;
