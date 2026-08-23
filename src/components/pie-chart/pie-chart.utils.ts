export type PieChartDatum = { label: string; value: number }

export type Point = { x: number; y: number }

const TAU = Math.PI * 2
const EPSILON = 1e-9

/** Trims float noise so path strings stay short and deterministic. */
const fmt = (n: number) => {
  const rounded = Math.round(n * 1000) / 1000
  return Object.is(rounded, -0) ? '0' : String(rounded)
}

const point = ({ x, y }: Point) => `${fmt(x)} ${fmt(y)}`

const arcTo = (radius: number, largeArc: 0 | 1, sweep: 0 | 1, to: Point) =>
  `A ${fmt(radius)} ${fmt(radius)} 0 ${largeArc} ${sweep} ${point(to)}`

/** A closed circle drawn as two half arcs, so the path never collapses. */
const fullRing = (radius: number, sweep: 0 | 1) =>
  [
    `M ${point({ x: 0, y: -radius })}`,
    arcTo(radius, 1, sweep, { x: 0, y: radius }),
    arcTo(radius, 1, sweep, { x: 0, y: -radius }),
    'Z',
  ].join(' ')

/**
 * Converts a polar coordinate to SVG user space, with the circle centred on
 * `0,0`. Angles are in **radians**, `0` points at 12 o'clock and increases
 * clockwise (matching how the slices are laid out).
 */
export function polarToCartesian(radius: number, angle: number): Point {
  return {
    x: radius * Math.sin(angle),
    y: -radius * Math.cos(angle),
  }
}

/**
 * Builds the `d` attribute of an annular sector (a donut slice): an outer arc
 * clockwise, a radial line inwards, an inner arc back, and a closing line.
 *
 * Angles are in **radians**, `0` at 12 o'clock, increasing clockwise.
 *
 * - A sweep covering the whole circle is drawn as two counter-wound rings, so
 *   the slice renders as a full donut instead of collapsing to nothing.
 * - A non-positive sweep produces an empty string (nothing to draw).
 */
export function donutSlicePath(
  startAngle: number,
  endAngle: number,
  rOuter: number,
  rInner: number,
): string {
  const sweep = endAngle - startAngle
  if (sweep <= EPSILON) return ''

  if (sweep >= TAU - EPSILON) {
    // Opposite winding on the inner ring punches the hole under `nonzero`.
    return `${fullRing(rOuter, 1)} ${fullRing(rInner, 0)}`
  }

  const largeArc = sweep > Math.PI ? 1 : 0

  return [
    `M ${point(polarToCartesian(rOuter, startAngle))}`,
    arcTo(rOuter, largeArc, 1, polarToCartesian(rOuter, endAngle)),
    `L ${point(polarToCartesian(rInner, endAngle))}`,
    arcTo(rInner, largeArc, 0, polarToCartesian(rInner, startAngle)),
    'Z',
  ].join(' ')
}

/**
 * Turns raw values into integer percents that sum to exactly 100, using the
 * largest-remainder (Hamilton) method — every value is floored, then the
 * leftover points go to the largest fractional parts first, ties by position.
 *
 * e.g. `[1, 1, 1]` -> `[34, 33, 33]`.
 */
export function toPercents(values: number[]): number[] {
  const positive = values.map((value) => (value > 0 ? value : 0))
  const total = positive.reduce((sum, value) => sum + value, 0)
  if (total <= 0) return values.map(() => 0)

  const exact = positive.map((value) => (value / total) * 100)
  const percents = exact.map(Math.floor)
  const byRemainder = exact
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index)

  let leftover = 100 - percents.reduce((sum, value) => sum + value, 0)
  for (const { index } of byRemainder) {
    if (leftover <= 0) break
    percents[index] += 1
    leftover -= 1
  }

  return percents
}

/** Restricts `value` to `[min, max]`. */
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

/**
 * Places a tooltip card near an anchor (a pointer position, or a point on the
 * ring for keyboard focus) and returns its **top-left corner**, in pixels
 * relative to the top-left of the box it must stay inside.
 *
 * The preferred spot is `offset` px right of the anchor and `offset` px above
 * it. When the card would spill past the right edge it mirrors to the anchor's
 * left; when it would spill past the top it drops below. A final clamp keeps
 * it fully inside the box for the corner case, and pins it to the top-left
 * when the card is larger than the box itself.
 */
export function clampTooltip(
  x: number,
  y: number,
  tooltipW: number,
  tooltipH: number,
  boundsW: number,
  boundsH: number,
  offset = 12,
): Point {
  let left = x + offset
  if (left + tooltipW > boundsW) left = x - offset - tooltipW

  let top = y - offset - tooltipH
  if (top < 0) top = y + offset

  return {
    x: clamp(left, 0, Math.max(0, boundsW - tooltipW)),
    y: clamp(top, 0, Math.max(0, boundsH - tooltipH)),
  }
}

/**
 * Converts a centre-origin viewBox coordinate — the space the slices are drawn
 * in — into pixels measured from the top-left of the rendered square, so an
 * HTML overlay can be anchored to a point inside the SVG.
 */
export function viewBoxToPixel(
  at: Point,
  viewBoxSize: number,
  renderedSize: number,
): Point {
  const scale = renderedSize / viewBoxSize
  const half = viewBoxSize / 2

  return { x: (at.x + half) * scale, y: (at.y + half) * scale }
}

/**
 * Drops non-positive values, then caps the series at `max` slices: the first
 * `max - 1` entries keep their order and everything after them is merged into a
 * trailing `Other` slice. Categorical colours are assigned per slot, so the
 * palette is never cycled.
 */
export function foldToOther(data: PieChartDatum[], max = 8): PieChartDatum[] {
  const positive = data.filter((datum) => datum.value > 0)
  if (positive.length <= max) return positive

  const kept = positive.slice(0, max - 1)
  const other = positive
    .slice(max - 1)
    .reduce((sum, datum) => sum + datum.value, 0)

  return [...kept, { label: 'Other', value: other }]
}
