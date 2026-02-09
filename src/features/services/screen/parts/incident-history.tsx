import { Show } from 'meemaw'
import { AlertTriangle, CheckCircle } from '@icons/index.ts'
import type { HealthCheckEntry } from '../../types/index.ts'

type IncidentHistoryProps = {
  errors: HealthCheckEntry[]
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  }) + ', ' + d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function getSeverity(entry: HealthCheckEntry): { label: string; color: string } {
  if (entry.status_code >= 500) return { label: 'CRITICAL', color: 'text-status-error' }
  if (entry.response_time > 1000) return { label: 'WARNING', color: 'text-status-warning' }
  return { label: 'ERROR', color: 'text-status-error' }
}

export function IncidentHistory({ errors }: IncidentHistoryProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-border-light bg-bg-secondary p-4 max-h-125">
      <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
        Incident History
      </h2>

      <Show
        when={errors.length > 0}
        fallback={
          <div className="flex h-24 items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4 text-status-success/60" />
            <span className="text-xs uppercase tracking-wider text-status-success">
              No incidents recorded
            </span>
          </div>
        }
      >
        <div className="flex flex-col gap-3">
          {errors.map((entry) => {
            const severity = getSeverity(entry)
            return (
              <div
                key={entry.id}
                className="flex items-start gap-3 border-l-2 border-status-error/40 py-2 pl-4"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-status-error" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${severity.color}`}>
                      {severity.label}: {entry.error_message || `HTTP ${entry.status_code} ${entry.status_text}`}
                    </span>
                    <span className="shrink-0 text-[10px] tracking-wider text-text-secondary">
                      {formatDate(entry.created_at)}
                    </span>
                  </div>
                  <span className="text-[10px] tracking-wider text-text-secondary">
                    Response time: {entry.response_time}ms — Status: {entry.status_code} {entry.status_text}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </Show>
    </section>
  )
}
