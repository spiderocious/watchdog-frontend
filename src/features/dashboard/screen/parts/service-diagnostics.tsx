import { Show } from 'meemaw'
import { Activity } from '@icons/index.ts'
import type { CheckLog, ServiceOverview } from '../../types/index.ts'

type ServiceDiagnosticsProps = {
  checkLogs: CheckLog[]
  services: ServiceOverview[]
}

function getServiceName(nodeId: string, services: ServiceOverview[]): string {
  const svc = services.find((s) => s.id === nodeId)
  return svc?.name ?? nodeId.slice(0, 10)
}

function getEndpoint(nodeId: string, services: ServiceOverview[]): string {
  const svc = services.find((s) => s.id === nodeId)
  if (!svc) return '--'
  try {
    return new URL(svc.endpoint).pathname
  } catch {
    return svc.endpoint
  }
}

function formatId(id: string): string {
  return id.slice(0, 8).toUpperCase()
}

export function ServiceDiagnostics({ checkLogs, services }: ServiceDiagnosticsProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-border-light bg-bg-secondary p-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
        Service Diagnostics
      </h2>

      <Show
        when={checkLogs.length > 0}
        fallback={
          <div className="flex h-32 flex-col items-center justify-center gap-3">
            <Activity className="h-8 w-8 text-text-muted/40" />
            <span className="text-xs uppercase tracking-wider text-text-muted">
              Awaiting health checks
            </span>
            <span className="max-w-[220px] text-center text-[10px] leading-relaxed tracking-wider text-text-muted/70">
              Diagnostics will appear here once your services start running
            </span>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-light">
                <th className="px-2 py-2 text-[9px] font-bold uppercase tracking-wider text-text-muted">
                  ID
                </th>
                <th className="px-2 py-2 text-[9px] font-bold uppercase tracking-wider text-text-muted">
                  Service
                </th>
                <th className="hidden px-2 py-2 text-[9px] font-bold uppercase tracking-wider text-text-muted sm:table-cell">
                  Endpoint
                </th>
                <th className="px-2 py-2 text-[9px] font-bold uppercase tracking-wider text-text-muted">
                  Value
                </th>
                <th className="px-2 py-2 text-[9px] font-bold uppercase tracking-wider text-text-muted">
                  Latency
                </th>
                <th className="px-2 py-2 text-[9px] font-bold uppercase tracking-wider text-text-muted">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {checkLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-border-light/50 last:border-0"
                >
                  <td className="px-2 py-2 font-mono text-[10px] tracking-wider text-text-tertiary">
                    {formatId(log.id)}
                  </td>
                  <td className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-text-primary">
                    {getServiceName(log.node_id, services)}
                  </td>
                  <td className="hidden px-2 py-2 font-mono text-[10px] tracking-wider text-text-tertiary sm:table-cell">
                    {getEndpoint(log.node_id, services)}
                  </td>
                  <td className="px-2 py-2 font-mono text-[10px] tracking-wider text-text-secondary">
                    {log.status_code}
                  </td>
                  <td className={`px-2 py-2 font-mono text-[10px] tracking-wider ${
                    log.response_time > 1000
                      ? 'text-status-error'
                      : log.response_time > 500
                        ? 'text-status-warning'
                        : 'text-status-success'
                  }`}>
                    {log.response_time}ms
                  </td>
                  <td className="px-2 py-2">
                    <span
                      className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                        log.success
                          ? 'border-status-success text-status-success'
                          : 'border-status-error text-status-error'
                      }`}
                    >
                      {log.success ? 'OK' : 'FAIL'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Show>
    </section>
  )
}
