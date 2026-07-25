import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  // Allow .md / .mdx files to be treated as importable modules / pages.
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    // Allow the optimizer to serve the local SVG cover art used by MDX posts.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      new URL('https://*.medium.com/**'),
      new URL('https://media.tenor.com/**'),
    ],
  },
}

const withMDX = createMDX({
  // Turbopack requires plugins to be passed as serializable [name, options]
  // tuples (bare strings) rather than imported functions, so the loader can
  // resolve them in its own worker context.
  options: {
    remarkPlugins: [
      ['remark-frontmatter'],
      ['remark-mdx-frontmatter', { name: 'frontmatter' }],
    ],
    rehypePlugins: [
      [
        'rehype-pretty-code',
        {
          theme: { light: 'github-light', dark: 'github-dark' },
          keepBackground: false,
        },
      ],
    ],
  },
})

export default withMDX(nextConfig)
