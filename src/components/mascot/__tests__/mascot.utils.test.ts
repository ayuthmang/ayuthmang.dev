import { describe, test, expect } from 'vitest'
import {
  MASCOT_PALETTE,
  MASCOT_POSES,
  MASCOT_PUPILS,
  MASCOT_PUPIL_SIZE,
  gazeOffset,
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

describe('gazeOffset', () => {
  test.each([
    ['right', 100, 0, { x: 1, y: 0 }],
    ['left', -100, 0, { x: -1, y: 0 }],
    ['straight up', 0, -100, { x: 0, y: -1 }],
    ['up and to the right', 100, -100, { x: 1, y: -1 }],
    ['up and to the left', -100, -100, { x: -1, y: -1 }],
    ['straight down', 0, 100, { x: 0, y: 0 }],
    ['down and to the right', 100, 100, { x: 1, y: 0 }],
  ])('looks %s', (_direction, dx, dy, expected) => {
    expect(gazeOffset(dx, dy)).toEqual(expected)
  })

  test('looks straight ahead when the pointer is inside the dead zone', () => {
    expect(gazeOffset(10, -10, 48)).toEqual({ x: 0, y: 0 })
  })

  test('looks straight ahead when the pointer is exactly on the eyes', () => {
    expect(gazeOffset(0, 0)).toEqual({ x: 0, y: 0 })
  })
})

describe('gaze pose', () => {
  test('leaves the eyes empty where the pupils are drawn', () => {
    for (const pupil of MASCOT_PUPILS) {
      for (let dy = 0; dy < MASCOT_PUPIL_SIZE; dy += 1) {
        const row = MASCOT_POSES.gaze[pupil.y + dy]
        expect(row.slice(pupil.x, pupil.x + MASCOT_PUPIL_SIZE)).toBe('WW')
      }
    }
  })

  test('matches the idle pose once the pupils are at rest', () => {
    const withPupils = MASCOT_POSES.gaze.map((row, y) =>
      MASCOT_PUPILS.reduce(
        (current, pupil) =>
          y >= pupil.y && y < pupil.y + MASCOT_PUPIL_SIZE
            ? current.slice(0, pupil.x) +
              'K'.repeat(MASCOT_PUPIL_SIZE) +
              current.slice(pupil.x + MASCOT_PUPIL_SIZE)
            : current,
        row as string,
      ),
    )
    expect(withPupils).toEqual([...MASCOT_POSES.idle])
  })
})
