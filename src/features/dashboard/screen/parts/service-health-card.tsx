import type { ServiceOverview } from '../../types/index.ts'

type ServiceHealthCardProps = {
  service: ServiceOverview
}

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  active: { label: 'NOM', color: 'border-status-success text-status-success' },
  warning: { label: 'WRN', color: 'border-status-warning text-status-warning' },
  down: { label: 'CRIT', color: 'border-status-error text-status-error' },
  paused: { label: 'IDLE', color: 'border-text-tertiary text-text-tertiary' },
}

function getUptimeColor(pct: number): string {
  if (pct >= 95) return 'text-status-success'
  if (pct >= 80) return 'text-status-warning'
  return 'text-status-error'
}

function formatUptime(lastCheck: string | null): string {
  if (!lastCheck) return '--'
  const ms = Date.now() - new Date(lastCheck).getTime()
  const hours = Math.floor(ms / 3_600_000)
  return `UP ${hours}H`
}

export function ServiceHealthCard({ service }: ServiceHealthCardProps) {
  const badge = STATUS_BADGE[service.status] ?? STATUS_BADGE.active

  return (
    <div className="flex flex-col justify-between rounded border border-border-light bg-bg-primary p-3">
      {/* Top: name + badge */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-primary">
          {service.name}
        </span>
        <span
          className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest ${badge.color}`}
        >
          {badge.label}
        </span>
      </div>

      {/* Middle: uptime percentage */}
      <div className="mb-4">
        <span className={`text-4xl font-bold ${getUptimeColor(service.uptime_percentage)}`}>
          {service.uptime_percentage}
        </span>
        <span className={`text-lg ${getUptimeColor(service.uptime_percentage)}`}>%</span>
      </div>

      {/* Bottom: alerts + uptime */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary">
          Alerts: {service.failure_count}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary">
          {formatUptime(service.last_check)}
        </span>
      </div>
    </div>
  )
}
