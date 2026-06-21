import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://*.medium.com/**'),
      new URL('https://media.tenor.com/**'),
    ],
  },
}

export default nextConfig;
