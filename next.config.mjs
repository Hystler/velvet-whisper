import { fileURLToPath } from "url";

const root = fileURLToPath(new URL(".", import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root
  }
};

export default nextConfig;
