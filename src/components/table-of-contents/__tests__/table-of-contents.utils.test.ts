import { describe, test, expect } from 'vitest'
import {
  computeReadingLine,
  computeReadingProgress,
  locateSection,
  minutesLeft,
  railOffset,
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

describe('computeReadingLine', () => {
  const base = { viewportHeight: 800, contentTop: 200, contentHeight: 2800, offset: 120 }

  test('sits `offset` below the viewport top early on', () => {
    expect(computeReadingLine({ ...base, scrollY: 300 })).toBe(420)
  })

  test('reaches the end of the article at 100%', () => {
    expect(computeReadingLine({ ...base, scrollY: 2200 })).toBe(3000)
  })

  test('never moves backwards as the reader scrolls down', () => {
    let previous = -Infinity
    for (let scrollY = 0; scrollY <= 2400; scrollY += 50) {
      const line = computeReadingLine({ ...base, scrollY })
      expect(line).toBeGreaterThanOrEqual(previous)
      previous = line
    }
  })
})

describe('locateSection', () => {
  // Article spans 0..1000 with headings at 100, 400, 900.
  const tops = [100, 400, 900]

  test('no headings', () => {
    expect(locateSection([], 0, 1000, 500)).toEqual({ index: -1, fraction: 0 })
  })

  test('intro, before the first heading', () => {
    expect(locateSection(tops, 0, 1000, 50)).toEqual({ index: -1, fraction: 0.5 })
  })

  test('on a heading', () => {
    expect(locateSection(tops, 0, 1000, 400)).toEqual({ index: 1, fraction: 0 })
  })

  test('partway through a section', () => {
    expect(locateSection(tops, 0, 1000, 250)).toEqual({ index: 0, fraction: 0.5 })
  })

  test('last section runs to the end of the article', () => {
    expect(locateSection(tops, 0, 1000, 950)).toEqual({ index: 2, fraction: 0.5 })
  })

  test('past the end clamps to 1', () => {
    expect(locateSection(tops, 0, 1000, 5000)).toEqual({ index: 2, fraction: 1 })
  })
})

describe('railOffset', () => {
  const nodes = [10, 40, 100]
  const railEnd = 130

  test('no nodes', () => {
    expect(railOffset([], 0, { index: 0, fraction: 0.5 })).toBe(0)
  })

  test('intro parks on the first node', () => {
    expect(railOffset(nodes, railEnd, { index: -1, fraction: 0.9 })).toBe(10)
  })

  test('interpolates between nodes', () => {
    expect(railOffset(nodes, railEnd, { index: 1, fraction: 0.5 })).toBe(70)
  })

  test('last section travels to the end of the rail', () => {
    expect(railOffset(nodes, railEnd, { index: 2, fraction: 1 })).toBe(130)
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
