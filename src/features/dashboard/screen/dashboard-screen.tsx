import { Show } from 'meemaw'
import { useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, Loader2, RefreshCw } from '@icons/index.ts'
import { useDashboardOverview } from '../api/use-dashboard-overview.ts'
import { SystemHealthMatrix } from './parts/system-health-matrix.tsx'
import { RealTimeTelemetry } from './parts/real-time-telemetry.tsx'
import { ServiceDiagnostics } from './parts/service-diagnostics.tsx'
import { AlertConsole } from './parts/alert-console.tsx'

export function DashboardScreen() {
  const { data, isLoading, isError } = useDashboardOverview()
  const queryClient = useQueryClient()

  function handleRetry() {
    queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] })
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      <Show when={isLoading}>
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </Show>

      <Show when={isError}>
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <AlertTriangle className="h-8 w-8 text-status-error/60" />
          <span className="text-xs uppercase tracking-wider text-status-error">
            Failed to load dashboard data
          </span>
          <button
            type="button"
            onClick={handleRetry}
            className="flex items-center gap-1.5 rounded-md border border-text-tertiary/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-secondary transition-colors hover:border-text-tertiary hover:text-text-primary"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      </Show>

      <Show when={!!data}>
        {(() => {
          if (!data) return null
          return (
            <>
              {/* Top row: Health Matrix + Telemetry */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <SystemHealthMatrix services={data.services_overview} />
                <RealTimeTelemetry telemetry={data.real_time_telemetry} />
              </div>

              {/* Bottom row: Diagnostics + Alerts */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ServiceDiagnostics
                  checkLogs={data.service_diagnostics.check_logs}
                  services={data.services_overview}
                />
                <AlertConsole
                  errorLogs={data.error_logs}
                  services={data.services_overview}
                />
              </div>
            </>
          )
        })()}
      </Show>
    </div>
  )
}
