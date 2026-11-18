import GithubSlugger, { slug } from 'github-slugger'

export type Heading = {
  depth: 2 | 3
  text: string
  id: string
}

/**
 * Must produce exactly the ids `rehype-slug` puts on rendered headings, or
 * table-of-contents links point nowhere. Both use github-slugger, which keeps
 * Unicode letters (e.g. Thai) and leaves a trailing hyphen where an emoji was
 * stripped ("Hello 🔥" → "hello-").
 */
export function slugify(text: string): string {
  return slug(text)
}

export function extractHeadings(content: string): Heading[] {
  // Strip frontmatter
  let cleanContent = content.replace(/^---[\s\S]*?---\n?/, '')
  
  // Remove fenced code blocks
  cleanContent = cleanContent.replace(/```[\s\S]*?```/g, '')

  const headings: Heading[] = []
  // One slugger per document so duplicate headings get "-1", "-2" suffixes,
  // matching rehype-slug.
  const slugger = new GithubSlugger()
  const regex = /^(#{2,3})\s+(.+)$/gm
  let match

  while ((match = regex.exec(cleanContent)) !== null) {
    const depth = match[1].length as 2 | 3
    let text = match[2]

    // clean the text: strip inline code backticks, strip markdown links, trim
    text = text.replace(/`([^`]+)`/g, '$1')
    text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    text = text.trim()

    headings.push({
      depth,
      text,
      id: slugger.slug(text)
    })
  }

  return headings
}
