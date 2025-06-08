/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: {
      ssr: true,
    },
  },
  images: {
    remotePatterns: [new URL('https://*.medium.com/**')],
  },
}

module.exports = nextConfig
