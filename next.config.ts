import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    AZURE_STORAGE_CONNECTION_STRING:
      process.env.AZURE_STORAGE_CONNECTION_STRING,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "musiclibraryfiles.blob.core.windows.net",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
    domains: ["example.com"],
  },
};

export default nextConfig;
