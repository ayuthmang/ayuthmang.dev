import { cn } from '@/utils'
import {
  donutSlicePath,
  foldToOther,
  polarToCartesian,
  toPercents,
  type PieChartDatum,
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
const TAU = Math.PI * 2

/** Keeps float noise (and `-0`) out of the rendered coordinates. */
const round = (n: number) => Math.round(n * 1000) / 1000 + 0

/**
 * A dependency-free donut chart for `.mdx` posts, e.g.
 * `<PieChart caption="Portfolio split" data={[{ label: 'Stocks', value: 60 }]} />`.
 *
 * The SVG is decorative (`aria-hidden`); the legend beside it is the accessible
 * representation of the data.
 */
export function PieChart({ data, caption }: PieChartProps) {
  const slices = foldToOther(data, MAX_SLICES)
  if (slices.length === 0) return null

  const percents = toPercents(slices.map((datum) => datum.value))

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
      percent,
      path: donutSlicePath(startAngle, endAngle, R_OUTER, R_INNER),
      labelAt: polarToCartesian(R_LABEL, (startAngle + endAngle) / 2),
      color: PALETTE[index],
    }
  })

  return (
    <figure className="not-prose my-8 flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`${-SIZE / 2} ${-SIZE / 2} ${SIZE} ${SIZE}`}
          aria-hidden="true"
        >
          {arcs.map(({ key, path, color }) =>
            path ? (
              <path
                key={key}
                d={path}
                className={cn('stroke-background', color.fill)}
                strokeWidth={2}
                strokeLinejoin="round"
              />
            ) : null,
          )}
          {arcs.map(({ key, percent, labelAt }) =>
            percent > 0 ? (
              <text
                key={key}
                x={round(labelAt.x)}
                y={round(labelAt.y)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-foreground fill-current text-xs font-medium"
              >
                {percent}%
              </text>
            ) : null,
          )}
        </svg>

        <ul className="flex flex-col gap-2">
          {arcs.map(({ key, label, percent, color }) => (
            <li key={key} className="flex items-center gap-2">
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
