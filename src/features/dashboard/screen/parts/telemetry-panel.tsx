import type { TelemetryMetric } from '../../types/index.ts'

type TelemetryPanelProps = {
  label: string
  metric: TelemetryMetric
  color: string
  showThreshold?: boolean
}

function buildPolylinePoints(
  data: { value: number }[],
  width: number,
  height: number,
  padding: number,
): string {
  if (data.length < 2) return ''
  const values = data.map((d) => d.value)
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const usableW = width - padding * 2
  const usableH = height - padding * 2

  return data
    .map((d, i) => {
      const x = padding + (i / (data.length - 1)) * usableW
      const y = padding + usableH - ((d.value - min) / range) * usableH
      return `${x},${y}`
    })
    .join(' ')
}

export function TelemetryPanel({
  label,
  metric,
  color,
  showThreshold = false,
}: TelemetryPanelProps) {
  const chartW = 200
  const chartH = 60
  const padding = 4
  const points = buildPolylinePoints(metric.chart_data, chartW, chartH, padding)

  return (
    <div className="flex flex-col gap-2 rounded border border-border-light bg-bg-primary p-3">
      {/* Header: label + value */}
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
          {label}
        </span>
        <div className="text-right">
          <span className={`text-lg font-bold ${color}`}>
            {metric.current.toLocaleString(undefined, { maximumFractionDigits: 1 })}
          </span>
          <span className={`ml-1 text-[10px] uppercase ${color}`}>
            {metric.unit}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${chartW} ${chartH}`}
          className="h-14 w-full"
          preserveAspectRatio="none"
        >
          {/* Threshold dashed line */}
          {showThreshold && (
            <line
              x1={0}
              y1={chartH / 2}
              x2={chartW}
              y2={chartH / 2}
              stroke="#ff3333"
              strokeWidth="1"
              strokeDasharray="4 3"
              opacity="0.6"
            />
          )}

          {/* Sparkline */}
          {points && (
            <polyline
              points={points}
              fill="none"
              stroke={color === 'text-chart-response' ? '#00aaff' :
                     color === 'text-chart-request' ? '#00ff88' :
                     color === 'text-chart-error' ? '#ffaa00' : '#ff3333'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </div>

      {/* Limit */}
      <span className="text-[9px] font-mono uppercase tracking-wider text-text-secondary">
        Limit: {metric.threshold.toLocaleString()}{metric.unit}
      </span>
    </div>
  )
}
