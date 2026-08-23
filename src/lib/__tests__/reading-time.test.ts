import { describe, test, expect } from 'vitest'
import { estimateReadingTime } from '../reading-time'

describe('estimateReadingTime', () => {
  test('Empty string -> 1', () => {
    expect(estimateReadingTime('')).toBe(1)
  })
  
  test('Short paragraph (< 200 words) -> 1', () => {
    const text = 'hello '.repeat(100)
    expect(estimateReadingTime(text)).toBe(1)
  })
  
  test('Exactly 200 words -> 1', () => {
    const text = 'word '.repeat(200)
    expect(estimateReadingTime(text)).toBe(1)
  })
  
  test('401 words -> 3 (rounds up)', () => {
    const text = 'word '.repeat(401)
    expect(estimateReadingTime(text)).toBe(3)
  })
  
  test('Strips YAML frontmatter', () => {
    const text = `---\ntitle: Hello\n---\n${'word '.repeat(200)}`
    expect(estimateReadingTime(text)).toBe(1)
  })
  
  test('Strips fenced code blocks', () => {
    const text = 'word\n```ts\nconst a = "hello"\n```\nword'
    expect(estimateReadingTime(text)).toBe(1)
  })
  
  test('Strips HTML/JSX tags', () => {
    const text = '<Callout>word</Callout>'
    expect(estimateReadingTime(text)).toBe(1)
  })
  
  test('Strips image markdown', () => {
    const text = '![alt text](https://example.com/image.png) word'
    expect(estimateReadingTime(text)).toBe(1)
  })
  
  test('Strips inline code backticks', () => {
    const text = 'Here is some `inline code`'
    expect(estimateReadingTime(text)).toBe(1)
  })
})
