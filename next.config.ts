import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING,
  },
  images: {
    domains: ["musiclibraryfiles.blob.core.windows.net"], 
  },
};

export default nextConfig;
