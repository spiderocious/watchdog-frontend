import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Show } from 'meemaw'
import { Eye, Edit3, MoreVertical, Pause, Play, Trash2 } from '@icons/index.ts'
import { ConfirmDialog } from '@ui/components/index.ts'
import type { ServiceItem } from '../../types/index.ts'

type ServicesTableProps = {
  items: ServiceItem[]
  onPause: (id: string) => void
  onResume: (id: string) => void
  onDelete: (id: string) => void
}

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  active: { label: 'ACTIVE', color: 'text-status-success', dot: 'bg-status-success' },
  down: { label: 'DOWN', color: 'text-status-error', dot: 'bg-status-error' },
  warning: { label: 'LATENCY WARNING', color: 'text-status-warning', dot: 'bg-status-warning' },
  paused: { label: 'PAUSED', color: 'text-text-secondary', dot: 'bg-text-muted' },
}

const METHOD_COLOR: Record<string, string> = {
  GET: 'border-status-success text-status-success',
  POST: 'border-status-info text-status-info',
  PUT: 'border-status-info text-status-info',
  PATCH: 'border-status-warning text-status-warning',
  DELETE: 'border-status-error text-status-error',
}

function formatInterval(ms: number): string {
  const seconds = Math.round(ms / 1000)
  if (seconds >= 60) return `${Math.round(seconds / 60)}M`
  return `${seconds}S`
}

function formatLastCheck(iso: string | null): string {
  if (!iso) return '--'
  const diff = Date.now() - new Date(iso).getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

function getUptimeBarColor(pct: number): string {
  if (pct >= 95) return 'bg-status-success'
  if (pct >= 80) return 'bg-status-warning'
  return 'bg-status-error'
}

function getResponseColor(ms: number): string {
  if (ms === 0) return 'text-text-secondary'
  if (ms > 1000) return 'text-status-error'
  if (ms > 500) return 'text-status-warning'
  return 'text-status-success'
}

function ActionsMenu({
  service,
  onPause,
  onResume,
  onDelete,
}: {
  service: ServiceItem
  onPause: (id: string) => void
  onResume: (id: string) => void
  onDelete: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-7 w-7 items-center justify-center rounded text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-secondary"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      <Show when={open}>
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded border border-border-light bg-bg-secondary py-1 shadow-lg">
          <Show when={service.status !== 'paused'}>
            <button
              type="button"
              onClick={() => { onPause(service.id); setOpen(false) }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-wider text-text-secondary transition-colors hover:bg-bg-tertiary"
            >
              <Pause className="h-3 w-3" />
              Pause
            </button>
          </Show>
          <Show when={service.status === 'paused'}>
            <button
              type="button"
              onClick={() => { onResume(service.id); setOpen(false) }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-wider text-status-success transition-colors hover:bg-bg-tertiary"
            >
              <Play className="h-3 w-3" />
              Resume
            </button>
          </Show>
          <button
            type="button"
            onClick={() => { setOpen(false); setConfirmDelete(true) }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-wider text-status-error transition-colors hover:bg-bg-tertiary"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
        </div>
      </Show>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete Service"
        message={`This will permanently delete "${service.name}" and all its health check history. This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={() => { onDelete(service.id); setConfirmDelete(false) }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}

export function ServicesTable({ items, onPause, onResume, onDelete }: ServicesTableProps) {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto rounded-lg border border-border-light bg-bg-secondary">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border-light">
            <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-text-secondary">
              Status
            </th>
            <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-text-secondary">
              Service Name
            </th>
            <th className="hidden px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-text-secondary md:table-cell">
              Endpoint
            </th>
            <th className="hidden px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-text-secondary sm:table-cell">
              Method
            </th>
            <th className="hidden px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-text-secondary sm:table-cell">
              Interval
            </th>
            <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-text-secondary">
              Uptime
            </th>
            <th className="hidden px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-text-secondary lg:table-cell">
              Avg Resp
            </th>
            <th className="hidden px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-text-secondary lg:table-cell">
              Last Check
            </th>
            <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-text-secondary">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((service) => {
            const status = STATUS_CONFIG[service.status] ?? STATUS_CONFIG.active
            const methodColor = METHOD_COLOR[service.method.toUpperCase()] ?? 'border-text-muted text-text-secondary'

            return (
              <tr
                key={service.id}
                onClick={() => navigate(`/services/${service.id}`)}
                className="cursor-pointer border-b border-border-light/50 transition-colors last:border-0 hover:bg-bg-tertiary/30"
              >
                {/* Status */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${status.dot}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </td>

                {/* Service Name */}
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold text-text-white">
                    {service.name}
                  </span>
                </td>

                {/* Endpoint */}
                <td className="hidden px-4 py-3 md:table-cell">
                  <span className="font-mono text-[11px] tracking-wider text-text-secondary">
                    {service.endpoint}
                  </span>
                </td>

                {/* Method */}
                <td className="hidden px-4 py-3 sm:table-cell">
                  <span className={`rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${methodColor}`}>
                    {service.method}
                  </span>
                </td>

                {/* Interval */}
                <td className="hidden px-4 py-3 sm:table-cell">
                  <span className="font-mono text-[11px] tracking-wider text-text-secondary">
                    {formatInterval(service.interval)}
                  </span>
                </td>

                {/* Uptime */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-bg-tertiary">
                      <div
                        className={`h-full rounded-full ${getUptimeBarColor(service.uptime_percentage)}`}
                        style={{ width: `${service.uptime_percentage}%` }}
                      />
                    </div>
                    <span className="font-mono text-[11px] tracking-wider text-text-secondary">
                      {service.uptime_percentage}%
                    </span>
                  </div>
                </td>

                {/* Avg Resp */}
                <td className="hidden px-4 py-3 lg:table-cell">
                  <span className={`font-mono text-[11px] tracking-wider ${getResponseColor(service.avg_response)}`}>
                    {service.avg_response > 0 ? `${service.avg_response}ms` : '--'}
                  </span>
                </td>

                {/* Last Check */}
                <td className="hidden px-4 py-3 lg:table-cell">
                  <span className="font-mono text-[11px] tracking-wider text-text-secondary">
                    {formatLastCheck(service.last_check)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => navigate(`/services/${service.id}`)}
                      className="flex h-7 w-7 items-center justify-center rounded text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-secondary"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/services/${service.id}/edit`)}
                      className="flex h-7 w-7 items-center justify-center rounded text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-secondary"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <ActionsMenu
                      service={service}
                      onPause={onPause}
                      onResume={onResume}
                      onDelete={onDelete}
                    />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
