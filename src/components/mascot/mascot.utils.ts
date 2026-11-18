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
