export type ProgressInput = {
  /** Current window.scrollY */
  scrollY: number
  /** window.innerHeight */
  viewportHeight: number
  /** Absolute document offset of the article's top edge */
  contentTop: number
  /** Rendered height of the article */
  contentHeight: number
}

/**
 * Reading progress through the article, 0..1.
 *
 * 0 when the article's top hits the top of the viewport, 1 when its bottom
 * hits the bottom of the viewport. Short articles that fit on one screen are
 * treated as fully read once the reader scrolls to them.
 */
export function computeReadingProgress({
  scrollY,
  viewportHeight,
  contentTop,
  contentHeight,
}: ProgressInput): number {
  const start = contentTop
  const end = contentTop + contentHeight - viewportHeight
  if (end <= start) return scrollY >= start ? 1 : 0
  return clamp((scrollY - start) / (end - start), 0, 1)
}

export type HeadingPosition = {
  id: string
  /** getBoundingClientRect().top — distance from the viewport top */
  top: number
}

/**
 * The section the reader is in: the last heading that has scrolled past
 * `offset` px from the top of the viewport. Returns `null` before the first
 * heading. When the reader has reached the end of the article, the last
 * heading wins even if it never crossed the line (short final sections).
 */
export function findActiveHeadingId(
  positions: HeadingPosition[],
  offset: number,
  reachedEnd = false,
): string | null {
  if (positions.length === 0) return null
  if (reachedEnd) return positions[positions.length - 1].id

  let active: string | null = null
  for (const { id, top } of positions) {
    if (top - offset <= 0) active = id
    else break
  }
  return active
}

/** Minutes left to read, rounded up, never negative. */
export function minutesLeft(totalMinutes: number, progress: number): number {
  return Math.max(0, Math.ceil(totalMinutes * (1 - clamp(progress, 0, 1))))
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
