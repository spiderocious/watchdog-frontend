import { Link } from 'react-router-dom'
import { Pause, Play, Edit3, Trash2, ChevronRight } from '@icons/index.ts'
import { ROUTES } from '@shared/constants/routes.ts'
import type { ServiceInfo } from '../../types/index.ts'

type DetailHeaderProps = {
  service: ServiceInfo
  onPause: () => void
  onResume: () => void
  onEdit: () => void
  onDelete: () => void
}

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  active: { text: 'OPERATIONAL', color: 'text-status-success' },
  down: { text: 'DOWN', color: 'text-status-error' },
  warning: { text: 'WARNING', color: 'text-status-warning' },
  paused: { text: 'PAUSED', color: 'text-text-secondary' },
}

export function DetailHeader({ service, onPause, onResume, onEdit, onDelete }: DetailHeaderProps) {
  const status = STATUS_LABEL[service.status] ?? STATUS_LABEL.active

  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider sm:text-[10px]">
        <Link
          to={ROUTES.SERVICES.ROOT}
          className="text-primary transition-colors hover:text-primary-hover"
        >
          Services
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-text-secondary" />
        <span className="truncate text-text-white">{service.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 rounded-lg border border-border-light bg-bg-secondary p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-lg font-bold uppercase tracking-wider text-text-white sm:text-xl">
            {service.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-[10px] tracking-wider sm:gap-3 sm:text-[11px]">
            <span className="text-text-secondary">
              Endpoint:{' '}
              <span className="break-all font-mono text-primary">{service.endpoint}</span>
            </span>
            <span className="hidden text-text-secondary sm:inline">|</span>
            <span className="text-text-secondary">
              Status:{' '}
              <span className={`font-bold ${status.color}`}>{status.text}</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {service.status === 'paused' ? (
            <button
              type="button"
              onClick={onResume}
              className="flex min-h-11 items-center gap-1.5 rounded-md border border-status-success/40 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-status-success transition-colors hover:bg-status-success/10 sm:px-4"
            >
              <Play className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Resume</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onPause}
              className="flex min-h-11 items-center gap-1.5 rounded-md border border-border-light px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-text-secondary transition-colors hover:border-border-hover hover:text-text-white sm:px-4"
            >
              <Pause className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Pause</span>
            </button>
          )}

          <button
            type="button"
            onClick={onEdit}
            className="flex min-h-11 items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary/20 sm:px-4"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex min-h-11 items-center gap-1.5 rounded-md border border-status-error/40 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-status-error transition-colors hover:bg-status-error/10 sm:px-4"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}
