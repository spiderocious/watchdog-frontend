import { Show } from 'meemaw'
import { AlertTriangle } from '@icons/index.ts'
import type { CheckLog, ServiceOverview } from '../../types/index.ts'

type AlertConsoleProps = {
  errorLogs: CheckLog[]
  services: ServiceOverview[]
}

function getServiceName(nodeId: string, services: ServiceOverview[]): string {
  const svc = services.find((s) => s.id === nodeId)
  return svc?.name ?? nodeId.slice(0, 10)
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export function AlertConsole({ errorLogs, services }: AlertConsoleProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-border-light bg-bg-secondary p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
          Alert Console
        </h2>
        <Show when={errorLogs.length > 0}>
          <span className="rounded bg-status-error/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-status-error">
            {errorLogs.length} Alert{errorLogs.length !== 1 ? 's' : ''}
          </span>
        </Show>
      </div>

      <Show
        when={errorLogs.length > 0}
        fallback={
          <div className="flex h-32 items-center justify-center">
            <span className="text-xs uppercase tracking-wider text-status-success">
              All systems nominal — No alerts
            </span>
          </div>
        }
      >
        <div className="flex flex-col gap-2">
          {errorLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 rounded border border-status-error/30 bg-status-error/5 p-3"
            >
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-status-error" />

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-status-error">
                    {getServiceName(log.node_id, services)}
                  </span>
                  <span className="shrink-0 font-mono text-[9px] tracking-wider text-text-muted">
                    {formatTimestamp(log.created_at)}
                  </span>
                </div>
                <span className="text-[10px] tracking-wider text-text-secondary">
                  {log.error_message || `HTTP ${log.status_code} — ${log.status_text}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Show>
    </section>
  )
}
