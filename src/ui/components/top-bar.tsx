import { useState, useEffect, useCallback } from 'react'
import { useQueryClient, useIsFetching } from '@tanstack/react-query'
import { AlertTriangle, Menu, RefreshCw } from '@shared/icons/index.ts'
import type { StatusOverview, DashboardMetadata } from '@features/dashboard/types/index.ts'

type TopBarProps = {
  statusOverview?: StatusOverview
  metadata?: DashboardMetadata
  onMenuToggle?: () => void
}

function getStatusColor(count: number): string {
  return count > 0 ? 'bg-status-error' : 'bg-status-success'
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  return d.toISOString().replace('T', ' ').substring(0, 23) + ' UTC'
}

export function TopBar({ statusOverview, metadata, onMenuToggle }: TopBarProps) {
  const [now, setNow] = useState(() => new Date().toISOString())
  const queryClient = useQueryClient()
  const isFetching = useIsFetching()

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date().toISOString()), 1000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries()
  }, [queryClient])

  const timestamp = metadata?.timestamp ?? now
  const alertCount = (statusOverview?.down ?? 0) + (statusOverview?.warning ?? 0)

  return (
    <header className="flex h-12 flex-shrink-0 items-center justify-between border-b border-border-light bg-bg-primary px-4">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-bg-tertiary md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <span className="text-xs font-bold uppercase tracking-wider text-text-white">
          Monitor-Central-01
        </span>

        <div className="hidden items-center gap-4 sm:flex">
          <StatusDot
            color={getStatusColor(statusOverview?.down ?? 0)}
            label="System"
          />
          <StatusDot color="bg-status-success" label="Services" />
          <StatusDot
            color={alertCount > 0 ? 'bg-status-warning' : 'bg-status-success'}
            label="Alerts"
          />
          <StatusDot color="bg-status-success" label="Latency" />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleRefresh}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-secondary"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching > 0 ? 'animate-spin' : ''}`} />
        </button>

        {alertCount > 0 && (
          <div className="flex items-center gap-1.5 rounded-full border border-status-error/40 px-3 py-1">
            <AlertTriangle className="h-3 w-3 text-status-error" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-status-error">
              {alertCount} Active
            </span>
          </div>
        )}

        <span className="hidden text-[11px] font-mono text-text-secondary sm:block">
          {formatTimestamp(timestamp)}
        </span>
      </div>
    </header>
  )
}

function StatusDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-1.5 w-1.5 rounded-full ${color}`} />
      <span className="text-[10px] uppercase tracking-wider text-text-secondary">
        {label}
      </span>
    </div>
  )
}
