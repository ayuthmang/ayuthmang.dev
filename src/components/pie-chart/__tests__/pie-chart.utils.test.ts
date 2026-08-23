import { describe, test, expect } from 'vitest'
import {
  donutSlicePath,
  foldToOther,
  polarToCartesian,
  toPercents,
} from '../pie-chart.utils'

const TAU = Math.PI * 2

const countArcs = (path: string) => (path.match(/A /g) ?? []).length

describe('toPercents', () => {
  test('keeps exact percents untouched', () => {
    expect(toPercents([60, 20, 10, 10])).toEqual([60, 20, 10, 10])
  })

  test('breaks an even split with the largest-remainder method', () => {
    expect(toPercents([1, 1, 1])).toEqual([34, 33, 33])
  })

  test('gives leftover points to the largest remainders first', () => {
    // exact: 14.285…, 28.571…, 57.142… -> floors 14/28/57 leave 1 point,
    // and the largest remainder is the middle slot.
    expect(toPercents([1, 2, 4])).toEqual([14, 29, 57])
  })

  test.each([
    [[1, 1, 1]],
    [[1, 1, 1, 1, 1, 1, 1]],
    [[0.1, 0.2, 0.3]],
    [[3, 3, 3, 1]],
    [[999999, 1]],
    [[7]],
  ])('sums to exactly 100 for %j', (values) => {
    const percents = toPercents(values)
    expect(percents.reduce((sum, value) => sum + value, 0)).toBe(100)
  })

  test('returns zeros when there is nothing to divide', () => {
    expect(toPercents([0, 0])).toEqual([0, 0])
    expect(toPercents([])).toEqual([])
  })

  test('ignores negative values', () => {
    expect(toPercents([50, -10, 50])).toEqual([50, 0, 50])
  })
})

describe('foldToOther', () => {
  const datum = (label: string, value: number) => ({ label, value })

  test('passes data through unchanged under the cap', () => {
    const data = [datum('a', 1), datum('b', 2), datum('c', 3)]
    expect(foldToOther(data)).toEqual(data)
  })

  test('passes through exactly at the cap', () => {
    const data = Array.from({ length: 8 }, (_, i) => datum(`s${i}`, i + 1))
    expect(foldToOther(data)).toHaveLength(8)
    expect(foldToOther(data).at(-1)).toEqual(datum('s7', 8))
  })

  test('keeps the first max - 1 items and folds the rest into Other', () => {
    const data = Array.from({ length: 11 }, (_, i) => datum(`s${i}`, i + 1))
    const folded = foldToOther(data)

    expect(folded).toHaveLength(8)
    expect(folded.slice(0, 7)).toEqual(data.slice(0, 7))
    // values 8 + 9 + 10 + 11
    expect(folded.at(-1)).toEqual(datum('Other', 38))
  })

  test('honours a custom max', () => {
    const data = [datum('a', 1), datum('b', 2), datum('c', 3), datum('d', 4)]
    expect(foldToOther(data, 3)).toEqual([
      datum('a', 1),
      datum('b', 2),
      datum('Other', 7),
    ])
  })

  test('drops non-positive values before folding', () => {
    const data = [datum('a', 1), datum('zero', 0), datum('neg', -5)]
    expect(foldToOther(data)).toEqual([datum('a', 1)])
  })

  test('drops non-positive values before applying the cap', () => {
    const data = [
      ...Array.from({ length: 8 }, (_, i) => datum(`s${i}`, i + 1)),
      datum('zero', 0),
    ]
    // the zero is removed first, so 8 real slices still fit under the cap
    expect(foldToOther(data)).toHaveLength(8)
    expect(foldToOther(data).some((d) => d.label === 'Other')).toBe(false)
  })
})

describe('polarToCartesian', () => {
  test('starts at 12 o’clock and runs clockwise', () => {
    const top = polarToCartesian(10, 0)
    expect(top.x).toBeCloseTo(0)
    expect(top.y).toBeCloseTo(-10)

    const right = polarToCartesian(10, TAU / 4)
    expect(right.x).toBeCloseTo(10)
    expect(right.y).toBeCloseTo(0)

    const bottom = polarToCartesian(10, TAU / 2)
    expect(bottom.x).toBeCloseTo(0)
    expect(bottom.y).toBeCloseTo(10)
  })
})

describe('donutSlicePath', () => {
  test('draws an annular sector with two arcs and a close', () => {
    const path = donutSlicePath(0, TAU / 4, 80, 48)

    expect(path.startsWith('M ')).toBe(true)
    expect(countArcs(path)).toBe(2)
    expect(path.endsWith('Z')).toBe(true)
    expect(path).toContain('L ')
  })

  test('uses large-arc-flag 0 for a slice under half the circle', () => {
    const path = donutSlicePath(0, TAU * 0.25, 80, 48)
    expect(path).toContain('A 80 80 0 0 1')
    expect(path).toContain('A 48 48 0 0 0')
  })

  test('uses large-arc-flag 1 for a slice over half the circle', () => {
    const path = donutSlicePath(0, TAU * 0.6, 80, 48)
    expect(path).toContain('A 80 80 0 1 1')
    expect(path).toContain('A 48 48 0 1 0')
  })

  test('renders a full circle as a non-collapsed ring', () => {
    const path = donutSlicePath(0, TAU, 80, 48)

    expect(path).not.toBe('')
    expect(path.startsWith('M ')).toBe(true)
    // two half arcs per ring, outer + inner
    expect(countArcs(path)).toBe(4)
    expect(path).toContain('A 80 80')
    expect(path).toContain('A 48 48')
    expect(path).not.toContain('NaN')
  })

  test('returns an empty path for a zero or negative sweep', () => {
    expect(donutSlicePath(0, 0, 80, 48)).toBe('')
    expect(donutSlicePath(1, 0.5, 80, 48)).toBe('')
  })

  test('never emits NaN for arbitrary angles', () => {
    for (let i = 1; i < 12; i += 1) {
      expect(donutSlicePath(0, (TAU * i) / 12, 80, 48)).not.toContain('NaN')
    }
  })
})
