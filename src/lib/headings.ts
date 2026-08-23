export type Heading = {
  depth: 2 | 3
  text: string
  id: string
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function extractHeadings(content: string): Heading[] {
  // Strip frontmatter
  let cleanContent = content.replace(/^---[\s\S]*?---\n?/, '')
  
  // Remove fenced code blocks
  cleanContent = cleanContent.replace(/```[\s\S]*?```/g, '')

  const headings: Heading[] = []
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
      id: slugify(text)
    })
  }

  return headings
}
