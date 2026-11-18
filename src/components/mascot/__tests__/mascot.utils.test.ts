import { describe, test, expect } from 'vitest'
import {
  MASCOT_PALETTE,
  MASCOT_POSES,
  spriteSize,
  spriteToPaths,
} from '../mascot.utils'

describe('spriteToPaths', () => {
  test('merges a horizontal run of one color into a single rectangle', () => {
    expect(spriteToPaths(['.GGG.'])).toEqual([{ key: 'G', d: 'M1 0h3v1h-3z' }])
  })

  test('groups pixels by color across rows', () => {
    expect(spriteToPaths(['GK', 'KG'])).toEqual([
      { key: 'G', d: 'M0 0h1v1h-1zM1 1h1v1h-1z' },
      { key: 'K', d: 'M1 0h1v1h-1zM0 1h1v1h-1z' },
    ])
  })

  test('returns nothing for a fully transparent sprite', () => {
    expect(spriteToPaths(['...', '...'])).toEqual([])
  })
})

describe('spriteSize', () => {
  test('reads the width from the first row and the height from the row count', () => {
    expect(spriteSize(['....', '....', '....'])).toEqual({
      width: 4,
      height: 3,
    })
  })
})

describe.each(Object.entries(MASCOT_POSES))('%s pose', (_name, rows) => {
  test('is 16 pixels wide on every row', () => {
    expect(rows.every((row) => row.length === 16)).toBe(true)
  })

  test('only uses colors from the palette', () => {
    const keys = new Set(rows.join('').replaceAll('.', ''))
    expect([...keys].filter((key) => !(key in MASCOT_PALETTE))).toEqual([])
  })
})
