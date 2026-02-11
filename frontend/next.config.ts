import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors:true,
  },
  async rewrites(){
    return[
      {
      source:"/api/:path*",
      destination: "http://localhost:8000/:path*"
      },
    ]
  }
};

export default nextConfig;
