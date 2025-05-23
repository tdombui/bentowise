import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['wcwwdzlszowkdnaokntv.supabase.co'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
