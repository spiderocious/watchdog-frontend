import type { ServicesOverviewStats, ServiceItem } from '../../types/index.ts'

type ServicesStatsProps = {
  overview: ServicesOverviewStats
  items: ServiceItem[]
}

function computeAvgUptime(items: ServiceItem[]): number {
  if (items.length === 0) return 0
  const sum = items.reduce((acc, s) => acc + s.uptime_percentage, 0)
  return Math.round((sum / items.length) * 10) / 10
}

function computeAvgLatency(items: ServiceItem[]): number {
  const active = items.filter((s) => s.avg_response > 0)
  if (active.length === 0) return 0
  const sum = active.reduce((acc, s) => acc + s.avg_response, 0)
  return Math.round(sum / active.length)
}

export function ServicesStats({ overview, items }: ServicesStatsProps) {
  const avgUptime = computeAvgUptime(items)
  const criticalCount = overview.down_count
  const avgLatency = computeAvgLatency(items)
  const alertCount = overview.down_count + overview.warning_count

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {/* Uptime Avg */}
      <div className="flex flex-col gap-1 rounded-lg border border-border-light bg-bg-secondary p-4">
        <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
          Uptime Avg
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-3xl font-bold text-status-success">
            {avgUptime}
          </span>
          <span className="text-sm font-bold text-status-success">%</span>
        </div>
      </div>

      {/* Total Services */}
      <div className="flex flex-col gap-1 rounded-lg border border-border-light bg-bg-secondary p-4">
        <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
          Total Services
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-3xl font-bold text-text-white">
            {overview.total_services}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-text-muted">
            stable
          </span>
        </div>
      </div>

      {/* Critical */}
      <div className={`flex flex-col gap-1 rounded-lg border p-4 ${
        criticalCount > 0
          ? 'border-status-error/40 bg-status-error/5'
          : 'border-border-light bg-bg-secondary'
      }`}>
        <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
          Critical
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className={`font-mono text-3xl font-bold ${
            criticalCount > 0 ? 'text-status-error' : 'text-text-white'
          }`}>
            {criticalCount}
          </span>
          <span className={`text-[10px] uppercase tracking-wider ${
            criticalCount > 0 ? 'text-status-error' : 'text-text-muted'
          }`}>
            {criticalCount > 0 ? 'pulsing' : 'clear'}
          </span>
        </div>
      </div>

      {/* Latency */}
      <div className="flex flex-col gap-1 rounded-lg border border-border-light bg-bg-secondary p-4">
        <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
          Latency
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-3xl font-bold text-text-white">
            {avgLatency}
          </span>
          <span className="text-sm font-bold text-text-muted">ms</span>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="col-span-2 flex flex-col gap-1 rounded-lg border border-border-light bg-bg-secondary p-4 sm:col-span-1 lg:col-span-1">
        <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
          Active Alerts
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className={`font-mono text-3xl font-bold ${
            alertCount > 0 ? 'text-status-warning' : 'text-text-white'
          }`}>
            {alertCount}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-text-muted">
            {alertCount === 0 ? 'clear' : 'Normal range'}
          </span>
        </div>
      </div>
    </div>
  )
}
