/**
 * Kala the frog is drawn as pixel art: every pose is a list of equal-length
 * rows, one character per pixel. `.` is transparent; any other character is a
 * key into the palette below.
 */
export const MASCOT_PALETTE = {
  G: '#2aaf3d', // body
  M: '#cdeb9a', // belly
  K: '#0a0a0a', // pupils and mouth
  W: '#ffffff', // eyes
  P: '#f97f95', // tongue
  N: '#634632', // coconut shell
  H: '#9e7853', // coconut shell highlight
  T: '#6cc4f5', // tear
} as const

export type MascotColorKey = keyof typeof MASCOT_PALETTE

const BODY = [
  '.GGGGMMMMMMGGGG.',
  '.GGGMMMMMMMMGGG.',
  'GGGGMMMMMMMMGGGG',
  'GGG.GGG..GGG.GGG',
]

export const MASCOT_POSES = {
  idle: [
    '..GGGG....GGGG..',
    '.GWWWWG..GWWWWG.',
    '.GWKKWGGGGWKKWG.',
    '.GWKKWGGGGWKKWG.',
    '.GGGGGGGGGGGGGG.',
    'GGGGGGGGGGGGGGGG',
    'GGKGGGGGGGGGGKGG',
    'GGGKKKKKKKKKKGGG',
    'GGGGGGGGGGGGGGGG',
    ...BODY,
  ],
  happy: [
    '..GGGG....GGGG..',
    '.GGGGGG..GGGGGG.',
    '.GGKKGGGGGGKKGG.',
    '.GKGGKGGGGKGGKG.',
    '.GGGGGGGGGGGGGG.',
    'GGGGGGGGGGGGGGGG',
    'GGKKKKKKKKKKKKGG',
    'GGGKPPPPPPPPKGGG',
    'GGGGKKKKKKKKGGGG',
    ...BODY,
  ],
  // Idle with empty eyes: the pupils are drawn separately so they can move.
  gaze: [
    '..GGGG....GGGG..',
    '.GWWWWG..GWWWWG.',
    '.GWWWWGGGGWWWWG.',
    '.GWWWWGGGGWWWWG.',
    '.GGGGGGGGGGGGGG.',
    'GGGGGGGGGGGGGGGG',
    'GGKGGGGGGGGGGKGG',
    'GGGKKKKKKKKKKGGG',
    'GGGGGGGGGGGGGGGG',
    ...BODY,
  ],
  // Heavy eyelids, a tear and a frown, for when something breaks.
  sad: [
    '..GGGG....GGGG..',
    '.GGGGGG..GGGGGG.',
    '.GWKKWGGGGWKKWG.',
    '.GWKKWGGGGWKKWG.',
    '.GGTGGGGGGGGGGG.',
    'GGGTGGGGGGGGGGGG',
    'GGGKKKKKKKKKKGGG',
    'GGKGGGGGGGGGGKGG',
    'GGGGGGGGGGGGGGGG',
    ...BODY,
  ],
  // Only the eyes, for peeking over the edge of something.
  peek: [
    '..GGGG....GGGG..',
    '.GWWWWG..GWWWWG.',
    '.GWKKWGGGGWKKWG.',
    '.GWKKWGGGGWKKWG.',
  ],
  // กบในกะลา: back under the coconut shell. Used when a page is missing.
  shell: [
    '.....NNNNNN.....',
    '...NNHHNNNNNN...',
    '..NNHNNNNNNNNN..',
    '.NNHNNNNNNNNNNN.',
    'NNNNNNNNNNNNNNNN',
    '.GWWWWGGGGWWWWG.',
    '.GWKKWGGGGWKKWG.',
    'GGGGGGGGGGGGGGGG',
    'GGG.GGG..GGG.GGG',
  ],
} as const satisfies Record<string, readonly string[]>

export type MascotPose = keyof typeof MASCOT_POSES

export type SpritePath = { key: string; d: string }

/**
 * Turns pixel rows into one SVG path per color. Horizontal runs of the same
 * color are merged into a single rectangle so the markup stays small.
 */
export function spriteToPaths(rows: readonly string[]): SpritePath[] {
  const byKey = new Map<string, string[]>()

  rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const key = row[x]
      if (key === '.') {
        x += 1
        continue
      }
      let end = x
      while (end < row.length && row[end] === key) end += 1
      const width = end - x
      const segments = byKey.get(key) ?? []
      segments.push(`M${x} ${y}h${width}v1h-${width}z`)
      byKey.set(key, segments)
      x = end
    }
  })

  return Array.from(byKey, ([key, segments]) => ({ key, d: segments.join('') }))
}

export function spriteSize(rows: readonly string[]) {
  return { width: rows[0]?.length ?? 0, height: rows.length }
}

/**
 * Where the pupils sit in the `gaze` pose, in sprite pixels. Each pupil is a
 * 2x2 block that rests at the bottom middle of a 4x3 white eye.
 */
export const MASCOT_PUPILS = [
  { x: 3, y: 2 },
  { x: 11, y: 2 },
] as const

export const MASCOT_PUPIL_SIZE = 2

export type GazeOffset = { x: -1 | 0 | 1; y: -1 | 0 }

export const GAZE_REST: GazeOffset = { x: 0, y: 0 }

/**
 * How far to shift the pupils, in sprite pixels, to look along the vector
 * (`dx`, `dy`) that runs from the eyes to the pointer in screen pixels.
 *
 * The pupils have one pixel of room to each side and one pixel above, so they
 * snap between six positions. Inside `deadZone` the pointer is on top of the
 * mascot and he looks straight ahead.
 */
export function gazeOffset(dx: number, dy: number, deadZone = 0): GazeOffset {
  const distance = Math.hypot(dx, dy)
  if (distance <= deadZone) return GAZE_REST

  const horizontal = dx / distance
  const vertical = dy / distance

  return {
    x: horizontal > 0.5 ? 1 : horizontal < -0.5 ? -1 : 0,
    y: vertical < -0.5 ? -1 : 0,
  }
}

export const MASCOT_GREETINGS = [
  'Hi!',
  'สวัสดี!',
  'Ribbit!',
  'อ๊บ อ๊บ!',
  'Hello, friend!',
  'Still here.',
] as const
