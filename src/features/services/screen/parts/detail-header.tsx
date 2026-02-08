import { Link } from 'react-router-dom'
import { Pause, Play, Edit3, Trash2, ChevronRight } from '@icons/index.ts'
import { ROUTES } from '@shared/constants/routes.ts'
import type { ServiceInfo } from '../../types/index.ts'

type DetailHeaderProps = {
  service: ServiceInfo
  onPause: () => void
  onResume: () => void
  onDelete: () => void
}

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  active: { text: 'OPERATIONAL', color: 'text-status-success' },
  down: { text: 'DOWN', color: 'text-status-error' },
  warning: { text: 'WARNING', color: 'text-status-warning' },
  paused: { text: 'PAUSED', color: 'text-text-secondary' },
}

export function DetailHeader({ service, onPause, onResume, onDelete }: DetailHeaderProps) {
  const status = STATUS_LABEL[service.status] ?? STATUS_LABEL.active

  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
        <Link
          to={ROUTES.SERVICES.ROOT}
          className="text-primary transition-colors hover:text-primary-hover"
        >
          Services
        </Link>
        <ChevronRight className="h-3 w-3 text-text-secondary" />
        <span className="text-text-white">{service.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 rounded-lg border border-border-light bg-bg-secondary p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-bold uppercase tracking-wider text-text-white">
            {service.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-[11px] tracking-wider">
            <span className="text-text-secondary">
              Endpoint:{' '}
              <span className="font-mono text-primary">{service.endpoint}</span>
            </span>
            <span className="text-text-secondary">|</span>
            <span className="text-text-secondary">
              Status:{' '}
              <span className={`font-bold ${status.color}`}>{status.text}</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {service.status === 'paused' ? (
            <button
              type="button"
              onClick={onResume}
              className="flex items-center gap-1.5 rounded-md border border-status-success/40 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-status-success transition-colors hover:bg-status-success/10"
            >
              <Play className="h-3.5 w-3.5" />
              Resume
            </button>
          ) : (
            <button
              type="button"
              onClick={onPause}
              className="flex items-center gap-1.5 rounded-md border border-border-light px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-text-secondary transition-colors hover:border-border-hover hover:text-text-white"
            >
              <Pause className="h-3.5 w-3.5" />
              Pause
            </button>
          )}

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary/20"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-md border border-status-error/40 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-status-error transition-colors hover:bg-status-error/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
