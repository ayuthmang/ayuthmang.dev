import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  compiler: {
    styledComponents: {
      ssr: true,
    },
  },
  images: {
    remotePatterns: [
      new URL('https://*.medium.com/**'),
      new URL('https://media.tenor.com/**'),
    ],
  },
}

export default nextConfig;
