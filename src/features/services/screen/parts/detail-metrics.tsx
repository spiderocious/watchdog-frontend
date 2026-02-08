import { CheckCircle, AlertTriangle } from '@icons/index.ts'
import type { QuickMetrics } from '../../types/index.ts'

type DetailMetricsProps = {
  metrics: QuickMetrics
}

const STATUS_DISPLAY: Record<string, { text: string; color: string }> = {
  active: { text: 'OPERATIONAL', color: 'text-status-success' },
  down: { text: 'DOWN', color: 'text-status-error' },
  warning: { text: 'WARNING', color: 'text-status-warning' },
  paused: { text: 'PAUSED', color: 'text-text-secondary' },
}

function getUptimeLabel(pct: number): string {
  if (pct >= 99.9) return 'Reliability: Nominal'
  if (pct >= 99) return 'Reliability: Good'
  if (pct >= 95) return 'Reliability: Fair'
  return 'Reliability: Degraded'
}

export function DetailMetrics({ metrics }: DetailMetricsProps) {
  const status = STATUS_DISPLAY[metrics.status] ?? STATUS_DISPLAY.active

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* Current Status */}
      <div className="flex flex-col gap-1.5 rounded-lg border border-border-light bg-bg-secondary p-3 sm:gap-2 sm:p-4">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-bold uppercase tracking-wider text-text-secondary sm:text-[9px]">
            Current Status
          </span>
          <CheckCircle className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${status.color}/60`} />
        </div>
        <span className={`text-base font-bold uppercase tracking-wider sm:text-lg ${status.color}`}>
          {status.text}
        </span>
      </div>

      {/* Uptime (30D) */}
      <div className="flex flex-col gap-1.5 rounded-lg border border-border-light bg-bg-secondary p-3 sm:gap-2 sm:p-4">
        <span className="text-[8px] font-bold uppercase tracking-wider text-text-secondary sm:text-[9px]">
          Uptime (30D)
        </span>
        <span className="font-mono text-xl font-bold text-status-success sm:text-2xl">
          {metrics.uptime_30d}%
        </span>
        <span className="text-[9px] tracking-wider text-text-secondary sm:text-[10px]">
          {getUptimeLabel(metrics.uptime_30d)}
        </span>
      </div>

      {/* Avg Response */}
      <div className="flex flex-col gap-1.5 rounded-lg border border-border-light bg-bg-secondary p-3 sm:gap-2 sm:p-4">
        <span className="text-[8px] font-bold uppercase tracking-wider text-text-secondary sm:text-[9px]">
          Avg Response
        </span>
        <span className={`font-mono text-xl font-bold sm:text-2xl ${
          metrics.avg_response > 500 ? 'text-status-warning' : 'text-primary'
        }`}>
          {metrics.avg_response}ms
        </span>
      </div>

      {/* Active Incidents */}
      <div className="flex flex-col gap-1.5 rounded-lg border border-border-light bg-bg-secondary p-3 sm:gap-2 sm:p-4">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-bold uppercase tracking-wider text-text-secondary sm:text-[9px]">
            Active Incidents
          </span>
          {metrics.errors_7d > 0 && (
            <AlertTriangle className="h-3.5 w-3.5 text-status-error/60 sm:h-4 sm:w-4" />
          )}
        </div>
        <span className={`font-mono text-xl font-bold sm:text-2xl ${
          metrics.errors_7d > 0 ? 'text-status-error' : 'text-text-white'
        }`}>
          {metrics.errors_7d}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-text-secondary sm:text-[10px]">
          {metrics.errors_7d === 0 ? 'System clear' : `${metrics.errors_7d} errors (7d)`}
        </span>
      </div>
    </div>
  )
}
