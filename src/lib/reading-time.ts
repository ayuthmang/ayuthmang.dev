export function estimateReadingTime(content: string): number {
  let text = content
  
  // 1. Strip frontmatter
  text = text.replace(/^---[\s\S]*?---/, '')
  
  // 2. Strip fenced code blocks
  text = text.replace(/```[\s\S]*?```/g, '')
  
  // 3. Strip HTML/JSX tags
  text = text.replace(/<[^>]*>/g, '')
  
  // 4. Strip markdown images
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  
  // 5. Strip inline code
  text = text.replace(/`[^`]+`/g, '')
  
  // 6. Split on whitespace, filter empty strings, count words
  const words = text.split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length
  
  // 7. Return Math.max(1, Math.ceil(wordCount / 200))
  return Math.max(1, Math.ceil(wordCount / 200))
}
