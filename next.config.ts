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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,PUT,POST,DELETE,HEAD",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
