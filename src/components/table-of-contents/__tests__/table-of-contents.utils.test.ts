import { describe, test, expect } from 'vitest'
import {
  computeReadingProgress,
  findActiveHeadingId,
  minutesLeft,
} from '../table-of-contents.utils'

describe('computeReadingProgress', () => {
  const base = { viewportHeight: 800, contentTop: 200, contentHeight: 2800 }
  // start = 200, end = 200 + 2800 - 800 = 2200

  test('0 before the article starts', () => {
    expect(computeReadingProgress({ ...base, scrollY: 0 })).toBe(0)
  })

  test('0 exactly at the start', () => {
    expect(computeReadingProgress({ ...base, scrollY: 200 })).toBe(0)
  })

  test('halfway', () => {
    expect(computeReadingProgress({ ...base, scrollY: 1200 })).toBe(0.5)
  })

  test('1 at the end', () => {
    expect(computeReadingProgress({ ...base, scrollY: 2200 })).toBe(1)
  })

  test('clamped past the end (footer, overscroll)', () => {
    expect(computeReadingProgress({ ...base, scrollY: 9999 })).toBe(1)
  })

  test('article shorter than the viewport', () => {
    const short = { viewportHeight: 800, contentTop: 200, contentHeight: 300 }
    expect(computeReadingProgress({ ...short, scrollY: 0 })).toBe(0)
    expect(computeReadingProgress({ ...short, scrollY: 200 })).toBe(1)
  })
})

describe('findActiveHeadingId', () => {
  const positions = [
    { id: 'a', top: -500 },
    { id: 'b', top: 50 },
    { id: 'c', top: 400 },
  ]

  test('empty list', () => {
    expect(findActiveHeadingId([], 100)).toBeNull()
  })

  test('null before the first heading', () => {
    expect(findActiveHeadingId([{ id: 'a', top: 300 }], 100)).toBeNull()
  })

  test('last heading above the offset line wins', () => {
    expect(findActiveHeadingId(positions, 100)).toBe('b')
  })

  test('heading exactly on the line is active', () => {
    expect(findActiveHeadingId(positions, 50)).toBe('b')
  })

  test('smaller offset keeps the previous section active', () => {
    expect(findActiveHeadingId(positions, 10)).toBe('a')
  })

  test('reaching the end selects the last heading', () => {
    expect(findActiveHeadingId(positions, 100, true)).toBe('c')
  })
})

describe('minutesLeft', () => {
  test('full time at the start', () => {
    expect(minutesLeft(10, 0)).toBe(10)
  })

  test('rounds up', () => {
    expect(minutesLeft(10, 0.66)).toBe(4)
  })

  test('0 when done', () => {
    expect(minutesLeft(10, 1)).toBe(0)
  })

  test('clamps out-of-range progress', () => {
    expect(minutesLeft(5, -1)).toBe(5)
    expect(minutesLeft(5, 2)).toBe(0)
  })
})
