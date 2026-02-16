import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel 部署不需要 standalone 模式
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // 允许跨域请求
  allowedDevOrigins: [
    'localhost',
    '.space.z.ai',
    '.z.ai',
    '.vercel.app',
  ],
};

export default nextConfig;
