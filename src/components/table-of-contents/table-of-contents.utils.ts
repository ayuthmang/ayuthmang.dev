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
 * hits the bottom of the viewport. Articles that fit on one screen count as
 * fully read once the reader scrolls to them.
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

/**
 * Document y-coordinate of the "reading line": the point the reader is
 * considered to be at.
 *
 * It sits `offset` px below the viewport top, but is pushed down as the
 * reader approaches the end so it reaches the article's last pixel exactly
 * at 100%. Without that push, short final sections never become current.
 */
export function computeReadingLine(input: ProgressInput & { offset: number }): number {
  const progress = computeReadingProgress(input)
  const sweep = input.contentTop + progress * input.contentHeight
  return Math.max(input.scrollY + input.offset, sweep)
}

export type SectionPosition = {
  /** Index of the current heading; -1 while still in the intro */
  index: number
  /** How far through that section the reading line is, 0..1 */
  fraction: number
}

/** Which section the reading line is in, and how far through it. */
export function locateSection(
  headingTops: number[],
  contentTop: number,
  contentBottom: number,
  line: number,
): SectionPosition {
  if (headingTops.length === 0) return { index: -1, fraction: 0 }

  let index = -1
  for (let i = 0; i < headingTops.length; i++) {
    if (headingTops[i] <= line) index = i
    else break
  }

  const start = index === -1 ? contentTop : headingTops[index]
  const end = index === -1 ? headingTops[0] : (headingTops[index + 1] ?? contentBottom)
  const fraction = end > start ? clamp((line - start) / (end - start), 0, 1) : 1
  return { index, fraction }
}

/**
 * Where the marker sits on the outline rail: on the current item's node,
 * eased toward the next node as the reader moves through the section.
 */
export function railOffset(
  nodes: number[],
  railEnd: number,
  { index, fraction }: SectionPosition,
): number {
  if (nodes.length === 0) return 0
  if (index < 0) return nodes[0]
  const start = nodes[index]
  const end = nodes[index + 1] ?? railEnd
  return start + (end - start) * fraction
}

/** Minutes left to read, rounded up, never negative. */
export function minutesLeft(totalMinutes: number, progress: number): number {
  return Math.max(0, Math.ceil(totalMinutes * (1 - clamp(progress, 0, 1))))
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
