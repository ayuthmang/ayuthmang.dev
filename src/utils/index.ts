export const range = (start: number, end: number, step = 1) => {
  let output = []
  if (typeof end === 'undefined') {
    end = start
    start = 0
  }
  for (let i = start; i < end; i += step) {
    output.push(i)
  }
  return output
}

export const random = (
  min: number,
  max: number,
  { rounded } = { rounded: true },
) => {
  const partialVal = Math.random() * (max - min)

  if (rounded) {
    return Math.floor(partialVal) + min
  } else {
    return partialVal + min
  }
}

export * from './classnames.utils'

/**
 * Converts any string into a deterministic HSL hue value (0–360).
 * Same input always produces the same hue, so cards get a consistent
 * accent color across renders.
 */
export function stringToHue(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}
