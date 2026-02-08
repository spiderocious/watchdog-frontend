import { Show } from 'meemaw'
import type { HealthCheckEntry } from '../../types/index.ts'

type HealthCheckLogProps = {
  logs: HealthCheckEntry[]
  serviceEndpoint: string
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: false,
  })
}

function getEndpointPath(fullUrl: string): string {
  try {
    return new URL(fullUrl).pathname
  } catch {
    return fullUrl
  }
}

export function HealthCheckLog({ logs, serviceEndpoint }: HealthCheckLogProps) {
  const endpointPath = getEndpointPath(serviceEndpoint)

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-border-light bg-bg-secondary p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
          Health Check Log
        </h2>
      </div>

      <Show
        when={logs.length > 0}
        fallback={
          <div className="flex h-32 items-center justify-center">
            <span className="text-xs uppercase tracking-wider text-text-secondary">
              No health checks recorded yet
            </span>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-light">
                <th className="px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                  Timestamp
                </th>
                <th className="px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                  Endpoint
                </th>
                <th className="px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                  Latency
                </th>
                <th className="px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-border-light/50 last:border-0"
                >
                  <td className={`px-3 py-2.5 font-mono text-[11px] tracking-wider ${
                    log.success ? 'text-text-secondary' : 'text-status-error'
                  }`}>
                    {formatTimestamp(log.created_at)}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px] tracking-wider text-text-secondary">
                    {endpointPath}
                  </td>
                  <td className={`px-3 py-2.5 font-mono text-[11px] tracking-wider ${
                    log.response_time > 500
                      ? 'text-status-warning'
                      : log.response_time > 1000
                        ? 'text-status-error'
                        : 'text-status-success'
                  }`}>
                    {log.response_time}ms
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                      log.success
                        ? 'bg-status-success/10 text-status-success'
                        : 'bg-status-error/10 text-status-error'
                    }`}>
                      {log.status_code} {log.success ? 'OK' : 'ERR'}
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
