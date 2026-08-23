'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/utils'
import {
  clampTooltip,
  donutSlicePath,
  foldToOther,
  polarToCartesian,
  toPercents,
  viewBoxToPixel,
  type PieChartDatum,
  type Point,
} from './pie-chart.utils'

export type { PieChartDatum }

export type PieChartProps = {
  data: PieChartDatum[]
  caption?: string
}

/**
 * Fixed categorical palette, assigned by slot (slot 1 to the first datum) and
 * never cycled or generated — a 9th series folds into `Other` instead. Each
 * slot carries a light/dark pair; the order is colourblind-validated, so don't
 * reorder or substitute entries.
 */
// prettier-ignore
const PALETTE = [
  { name: 'blue',    fill: 'fill-[#2a78d6] dark:fill-[#3987e5]', swatch: 'bg-[#2a78d6] dark:bg-[#3987e5]' },
  { name: 'orange',  fill: 'fill-[#eb6834] dark:fill-[#d95926]', swatch: 'bg-[#eb6834] dark:bg-[#d95926]' },
  { name: 'aqua',    fill: 'fill-[#1baf7a] dark:fill-[#199e70]', swatch: 'bg-[#1baf7a] dark:bg-[#199e70]' },
  { name: 'yellow',  fill: 'fill-[#eda100] dark:fill-[#c98500]', swatch: 'bg-[#eda100] dark:bg-[#c98500]' },
  { name: 'magenta', fill: 'fill-[#e87ba4] dark:fill-[#d55181]', swatch: 'bg-[#e87ba4] dark:bg-[#d55181]' },
  { name: 'green',   fill: 'fill-[#008300] dark:fill-[#008300]', swatch: 'bg-[#008300] dark:bg-[#008300]' },
  { name: 'violet',  fill: 'fill-[#4a3aa7] dark:fill-[#9085e9]', swatch: 'bg-[#4a3aa7] dark:bg-[#9085e9]' },
  { name: 'red',     fill: 'fill-[#e34948] dark:fill-[#e66767]', swatch: 'bg-[#e34948] dark:bg-[#e66767]' },
] as const

const MAX_SLICES = PALETTE.length
const SIZE = 240
const R_OUTER = 80
const R_INNER = 48
const R_LABEL = 96
/** Between the inner and outer edge — where a focused slice anchors its card. */
const R_ANCHOR = 64
const TOOLTIP_OFFSET = 12
const TAU = Math.PI * 2

/** Keeps float noise (and `-0`) out of the rendered coordinates. */
const round = (n: number) => Math.round(n * 1000) / 1000 + 0

/** Raw values are only worth repeating when they aren't percents already. */
const isPercentTotal = (total: number) => Math.abs(total - 100) < 0.5

const formatValue = (value: number) => value.toLocaleString('en-US')

/**
 * A dependency-free donut chart for `.mdx` posts, e.g.
 * `<PieChart caption="Portfolio split" data={[{ label: 'Stocks', value: 60 }]} />`.
 *
 * Idle, it renders as pure markup: slices, percent labels and a legend. Hover,
 * tap or keyboard focus on a slice (or hover on a legend row) emphasises it —
 * every other slice drops back — and raises a small tooltip beside the pointer.
 * The tooltip is decorative: the legend and the per-slice `aria-label`s already
 * carry the same numbers, so nothing is reachable only by hovering.
 */
export function PieChart({ data, caption }: PieChartProps) {
  const [active, setActive] = useState<number | null>(null)
  // Where the reader is pointing, in wrapper pixels; the tooltip's own size is
  // only known after it renders, so the clamped corner is resolved in a layout
  // effect (before paint) rather than during the event.
  const [anchor, setAnchor] = useState<Point | null>(null)
  const [position, setPosition] = useState<Point | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    const tooltip = tooltipRef.current

    if (active === null || anchor === null || !wrapper || !tooltip) {
      setPosition(null)
      return
    }

    const bounds = wrapper.getBoundingClientRect()
    setPosition(
      clampTooltip(
        anchor.x,
        anchor.y,
        tooltip.offsetWidth,
        tooltip.offsetHeight,
        bounds.width,
        bounds.height,
        TOOLTIP_OFFSET,
      ),
    )
  }, [active, anchor])

  const slices = foldToOther(data, MAX_SLICES)
  const percents = toPercents(slices.map((datum) => datum.value))
  const showRawValues = !isPercentTotal(
    slices.reduce((sum, datum) => sum + datum.value, 0),
  )

  // First slice starts at 12 o'clock; each following one starts where the
  // percents before it left off, so the ring always closes at exactly 100%.
  const arcs = slices.map((datum, index) => {
    const offset = percents
      .slice(0, index)
      .reduce((sum, percent) => sum + percent, 0)
    const percent = percents[index]
    const startAngle = (offset / 100) * TAU
    const endAngle = ((offset + percent) / 100) * TAU

    return {
      key: `${datum.label}-${index}`,
      label: datum.label,
      value: datum.value,
      percent,
      path: donutSlicePath(startAngle, endAngle, R_OUTER, R_INNER),
      labelAt: polarToCartesian(R_LABEL, (startAngle + endAngle) / 2),
      midAngle: (startAngle + endAngle) / 2,
      color: PALETTE[index],
    }
  })

  if (arcs.length === 0) return null

  const activeArc = active === null ? null : arcs[active]

  /** Emphasis only kicks in once something is active. */
  const dimmed = (index: number) => active !== null && active !== index

  const clear = () => {
    setActive(null)
    setAnchor(null)
  }

  const trackPointer = (index: number, clientX: number, clientY: number) => {
    setActive(index)

    const wrapper = wrapperRef.current
    if (!wrapper) return

    const bounds = wrapper.getBoundingClientRect()
    setAnchor({ x: clientX - bounds.left, y: clientY - bounds.top })
  }

  /** Keyboard focus has no coordinates, so anchor on the slice's own midpoint. */
  const anchorOnSlice = (index: number, midAngle: number) => {
    setActive(index)

    const wrapper = wrapperRef.current
    const svg = svgRef.current
    if (!wrapper || !svg) return

    const wrapperBounds = wrapper.getBoundingClientRect()
    const svgBounds = svg.getBoundingClientRect()
    const inSvg = viewBoxToPixel(
      polarToCartesian(R_ANCHOR, midAngle),
      SIZE,
      svgBounds.width,
    )

    setAnchor({
      x: svgBounds.left - wrapperBounds.left + inSvg.x,
      y: svgBounds.top - wrapperBounds.top + inSvg.y,
    })
  }

  return (
    <figure className="not-prose my-8 flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
        <div ref={wrapperRef} className="relative">
          <svg
            ref={svgRef}
            width={SIZE}
            height={SIZE}
            viewBox={`${-SIZE / 2} ${-SIZE / 2} ${SIZE} ${SIZE}`}
            onPointerLeave={clear}
          >
            {arcs.map(
              ({ key, path, label, percent, midAngle, color }, index) =>
                path ? (
                  <path
                    key={key}
                    d={path}
                    role="img"
                    aria-label={`${label}: ${percent}%`}
                    tabIndex={0}
                    className={cn(
                      'stroke-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 motion-safe:transition-opacity motion-safe:duration-150',
                      color.fill,
                      dimmed(index) ? 'opacity-40' : 'opacity-100',
                    )}
                    strokeWidth={2}
                    strokeLinejoin="round"
                    onPointerEnter={(event) =>
                      trackPointer(index, event.clientX, event.clientY)
                    }
                    onPointerMove={(event) =>
                      trackPointer(index, event.clientX, event.clientY)
                    }
                    onFocus={() => anchorOnSlice(index, midAngle)}
                    onBlur={clear}
                  />
                ) : null,
            )}
            {arcs.map(({ key, percent, labelAt }, index) =>
              percent > 0 ? (
                <text
                  key={key}
                  x={round(labelAt.x)}
                  y={round(labelAt.y)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={cn(
                    'text-foreground pointer-events-none fill-current text-xs font-medium motion-safe:transition-opacity motion-safe:duration-150',
                    dimmed(index) ? 'opacity-40' : 'opacity-100',
                  )}
                >
                  {percent}%
                </text>
              ) : null,
            )}
          </svg>

          {activeArc ? (
            <div
              ref={tooltipRef}
              aria-hidden="true"
              className={cn(
                'border-border bg-popover text-popover-foreground pointer-events-none absolute top-0 left-0 z-10 w-max rounded-md border px-2.5 py-1.5 whitespace-nowrap shadow-sm',
                // Held back until the layout effect has measured and placed it.
                position ? 'opacity-100' : 'opacity-0',
              )}
              style={{
                transform: `translate(${position?.x ?? 0}px, ${position?.y ?? 0}px)`,
              }}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'h-0.5 w-2 shrink-0 rounded-full',
                    activeArc.color.swatch,
                  )}
                />
                <span className="text-foreground text-sm font-semibold tabular-nums">
                  {activeArc.percent}%
                </span>
              </div>
              <div className="text-muted-foreground text-xs">
                {showRawValues
                  ? `${activeArc.label} · ${formatValue(activeArc.value)}`
                  : activeArc.label}
              </div>
            </div>
          ) : null}
        </div>

        <ul className="flex flex-col gap-2">
          {arcs.map(({ key, label, percent, color }, index) => (
            <li
              key={key}
              className={cn(
                // The padding is cancelled by the negative margin, so the wash
                // has room without shifting the idle layout.
                '-mx-2 -my-1 flex items-center gap-2 rounded-md px-2 py-1',
                active === index && 'bg-muted',
              )}
              onPointerEnter={() => setActive(index)}
              onPointerLeave={clear}
            >
              <div
                className={cn('size-3 shrink-0 rounded-sm', color.swatch)}
                aria-hidden="true"
              />
              <span className="text-sm">{label}</span>
              <span className="text-muted-foreground text-sm tabular-nums">
                {percent}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      {caption ? (
        <figcaption className="text-muted-foreground text-center text-sm">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

export default PieChart
