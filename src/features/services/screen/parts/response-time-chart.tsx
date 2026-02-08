import { useState, useMemo } from 'react'
import { Activity } from '@icons/index.ts'
import type { ResponseTimePoint } from '../../types/index.ts'

type ResponseTimeChartProps = {
  data: ResponseTimePoint[]
}

type TimeRange = '1H' | '6H' | '12H' | '24H'

const RANGE_MS: Record<TimeRange, number> = {
  '1H': 3_600_000,
  '6H': 21_600_000,
  '12H': 43_200_000,
  '24H': 86_400_000,
}

const CHART_W = 700
const CHART_H = 200
const PADDING = { top: 20, right: 20, bottom: 30, left: 50 }

function buildPath(
  points: ResponseTimePoint[],
  minTime: number,
  maxTime: number,
  maxValue: number,
): string {
  if (points.length < 2) return ''

  const usableW = CHART_W - PADDING.left - PADDING.right
  const usableH = CHART_H - PADDING.top - PADDING.bottom
  const timeRange = maxTime - minTime || 1

  return points
    .map((p, i) => {
      const t = new Date(p.time).getTime()
      const x = PADDING.left + ((t - minTime) / timeRange) * usableW
      const y = PADDING.top + usableH - (p.value / (maxValue || 1)) * usableH
      return `${i === 0 ? 'M' : 'L'}${x},${y}`
    })
    .join(' ')
}

function formatTimeLabel(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function ResponseTimeChart({ data }: ResponseTimeChartProps) {
  const [range, setRange] = useState<TimeRange>('1H')

  const filtered = useMemo(() => {
    const cutoff = Date.now() - RANGE_MS[range]
    return data.filter((p) => new Date(p.time).getTime() >= cutoff)
  }, [data, range])

  const { path, thresholdY, minTime, maxTime, gridLines } = useMemo(() => {
    if (filtered.length === 0) {
      return { path: '', thresholdY: 0, maxValue: 200, minTime: 0, maxTime: 1, gridLines: [] }
    }

    const values = filtered.map((p) => p.value)
    const mv = Math.max(...values, 200) * 1.2
    const times = filtered.map((p) => new Date(p.time).getTime())
    const mint = Math.min(...times)
    const maxt = Math.max(...times)

    const usableH = CHART_H - PADDING.top - PADDING.bottom
    const ty = PADDING.top + usableH - (200 / mv) * usableH

    const p = buildPath(filtered, mint, maxt, mv)

    // Time grid: ~5 labels
    const timeRange = maxt - mint || 1
    const step = timeRange / 5
    const gl: number[] = []
    for (let i = 0; i <= 5; i++) {
      gl.push(mint + step * i)
    }

    return { path: p, thresholdY: ty, maxValue: mv, minTime: mint, maxTime: maxt, gridLines: gl }
  }, [filtered])

  const usableW = CHART_W - PADDING.left - PADDING.right

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-border-light bg-bg-secondary p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Response Time History
          </h2>
        </div>

        <div className="flex items-center gap-1">
          {(['1H', '6H', '12H', '24H'] as TimeRange[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                range === r
                  ? 'border border-primary/40 bg-primary/10 text-primary'
                  : 'border border-border-light text-text-secondary hover:border-border-hover hover:text-text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {filtered.length < 2 ? (
        <div className="flex h-52 items-center justify-center">
          <span className="text-xs uppercase tracking-wider text-text-secondary">
            Not enough data for this time range
          </span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            className="h-52 w-full min-w-[500px]"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((pct) => {
              const y = PADDING.top + (CHART_H - PADDING.top - PADDING.bottom) * (1 - pct)
              return (
                <line
                  key={pct}
                  x1={PADDING.left}
                  y1={y}
                  x2={CHART_W - PADDING.right}
                  y2={y}
                  stroke="#2a2a2a"
                  strokeWidth="0.5"
                />
              )
            })}

            {/* Threshold line at 200ms */}
            <line
              x1={PADDING.left}
              y1={thresholdY}
              x2={CHART_W - PADDING.right}
              y2={thresholdY}
              stroke="#ff3333"
              strokeWidth="1"
              strokeDasharray="6 4"
              opacity="0.6"
            />
            <text
              x={CHART_W - PADDING.right - 2}
              y={thresholdY - 4}
              textAnchor="end"
              className="fill-status-error text-[8px] font-bold uppercase"
            >
              200ms Threshold
            </text>

            {/* Line path */}
            <path
              d={path}
              fill="none"
              stroke="#00ff88"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Glow effect */}
            <path
              d={path}
              fill="none"
              stroke="#00ff88"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.15"
            />

            {/* Time labels */}
            {gridLines.map((ts, i) => {
              const x = PADDING.left + ((ts - minTime) / ((maxTime - minTime) || 1)) * usableW
              return (
                <text
                  key={i}
                  x={x}
                  y={CHART_H - 6}
                  textAnchor="middle"
                  className="fill-text-secondary text-[9px]"
                >
                  {formatTimeLabel(ts)}
                </text>
              )
            })}
          </svg>
        </div>
      )}
    </section>
  )
}
