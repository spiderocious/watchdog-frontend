import type { StatusOverview, DashboardMetadata } from '@features/dashboard/types/index.ts'

type StatusFooterProps = {
  statusOverview?: StatusOverview
  metadata?: DashboardMetadata
}

export function StatusFooter({ statusOverview, metadata }: StatusFooterProps) {
  const total = statusOverview?.total_services ?? 0
  const active = statusOverview?.active ?? 0
  const down = total - active
  const isOperational = metadata?.system_status === 'operational'

  return (
    <footer className="flex h-8 flex-shrink-0 items-center justify-between border-t border-border-light bg-bg-primary px-4">
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary">
          Uptime: {statusOverview ? '99.992%' : '--'}
        </span>
        <span className="hidden text-[10px] font-mono uppercase tracking-wider text-text-tertiary sm:block">
          Cluster: US-East-Prod-01
        </span>
        <span className="hidden text-[10px] font-mono uppercase tracking-wider text-text-tertiary md:block">
          Instances: {active} Online / {down} Offline
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-status-success" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary">
            Secure
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              isOperational ? 'bg-status-success' : 'bg-status-error'
            }`}
          />
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary">
            Sync {isOperational ? 'Active' : 'Error'}
          </span>
        </div>
      </div>
    </footer>
  )
}
