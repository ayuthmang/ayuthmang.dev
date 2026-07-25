import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

/**
 * Directory that holds locally-authored `.mdx` blog posts.
 * Files are named `<slug>.mdx`; the filename (sans extension) is the slug.
 */
export const POSTS_DIRECTORY = path.join(process.cwd(), 'content', 'blog')

export type PostFrontmatter = {
  title: string
  description?: string
  /** ISO date string, e.g. "2026-07-25" */
  date: string
  tags?: string[]
  draft?: boolean
  coverImage?: string
}

export type Post = {
  slug: string
  title: string
  description?: string
  date: string
  tags: string[]
  draft: boolean
  coverImage?: string
}

type GetPostsOptions = {
  /** Directory to read posts from. Overridable for tests. */
  directory?: string
  /**
   * Whether draft posts should be included. Defaults to `true` outside of
   * production so drafts are visible while authoring, and `false` in
   * production builds.
   */
  includeDrafts?: boolean
}

function defaultIncludeDrafts(): boolean {
  return process.env.NODE_ENV !== 'production'
}

/**
 * gray-matter parses unquoted YAML dates (e.g. `date: 2026-01-01`) into
 * `Date` objects. Normalise back to a stable ISO string so `Post.date` is
 * always a string regardless of how the author wrote it.
 */
function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }
  return String(value)
}

function toPost(slug: string, fileContents: string): Post {
  const { data } = matter(fileContents)
  const frontmatter = data as Partial<PostFrontmatter>

  if (!frontmatter.title) {
    throw new Error(`Post "${slug}" is missing a required "title" frontmatter field`)
  }
  if (!frontmatter.date) {
    throw new Error(`Post "${slug}" is missing a required "date" frontmatter field`)
  }

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: normalizeDate(frontmatter.date),
    tags: frontmatter.tags ?? [],
    draft: frontmatter.draft ?? false,
    coverImage: frontmatter.coverImage,
  }
}

function readPostFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory).filter((file) => file.endsWith('.mdx'))
}

/**
 * Returns all local posts sorted by date (newest first). Drafts are excluded
 * in production and included otherwise, unless overridden via options.
 */
export function getAllPosts(options: GetPostsOptions = {}): Post[] {
  const {
    directory = POSTS_DIRECTORY,
    includeDrafts = defaultIncludeDrafts(),
  } = options

  const posts = readPostFiles(directory).map((file) => {
    const slug = file.replace(/\.mdx$/, '')
    const fileContents = fs.readFileSync(path.join(directory, file), 'utf8')
    return toPost(slug, fileContents)
  })

  return posts
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/** Returns the slugs of all publishable local posts. */
export function getPostSlugs(options: GetPostsOptions = {}): string[] {
  return getAllPosts(options).map((post) => post.slug)
}

/**
 * Returns a single local post by slug, or `null` if it does not exist or is a
 * draft that is currently excluded.
 */
export function getPostBySlug(
  slug: string,
  options: GetPostsOptions = {},
): Post | null {
  return getAllPosts(options).find((post) => post.slug === slug) ?? null
}
