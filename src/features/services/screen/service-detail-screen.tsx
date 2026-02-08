import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Show } from 'meemaw'
import { Loader2, AlertTriangle } from '@icons/index.ts'
import { ROUTES } from '@shared/constants/routes.ts'
import { ConfirmDialog } from '@ui/components/index.ts'
import { useServiceDetail } from '../api/use-service-detail.ts'
import {
  useDeleteService,
  usePauseService,
  useResumeService,
} from '../api/use-service-mutations.ts'
import { DetailHeader } from './parts/detail-header.tsx'
import { DetailMetrics } from './parts/detail-metrics.tsx'
import { ResponseTimeChart } from './parts/response-time-chart.tsx'
import { HealthCheckLog } from './parts/health-check-log.tsx'
import { IncidentHistory } from './parts/incident-history.tsx'

export function ServiceDetailScreen() {
  const { service_id } = useParams<{ service_id: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useServiceDetail(service_id ?? '')

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const deleteMutation = useDeleteService()
  const pauseMutation = usePauseService()
  const resumeMutation = useResumeService()

  function handleDeleteConfirm() {
    if (!service_id) return
    deleteMutation.mutate(service_id, {
      onSuccess: () => navigate(ROUTES.SERVICES.ROOT),
    })
    setDeleteConfirmOpen(false)
  }

  function handlePause() {
    if (!service_id) return
    pauseMutation.mutate(service_id)
  }

  function handleResume() {
    if (!service_id) return
    resumeMutation.mutate(service_id)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
      <Show when={isLoading}>
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </Show>

      <Show when={isError && !isLoading}>
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <AlertTriangle className="h-8 w-8 text-status-error/60" />
          <span className="text-xs uppercase tracking-wider text-status-error">
            Service not found or failed to load
          </span>
        </div>
      </Show>

      <Show when={!!data && !isLoading}>
        {(() => {
          if (!data) return null
          return (
            <>
              <DetailHeader
                service={data.service}
                onPause={handlePause}
                onResume={handleResume}
                onDelete={() => setDeleteConfirmOpen(true)}
              />

              <DetailMetrics metrics={data.quick_metrics} />

              <ResponseTimeChart data={data.response_time_history} />

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <HealthCheckLog
                  logs={data.health_check_log}
                  serviceEndpoint={data.service.endpoint}
                />
                <IncidentHistory errors={data.errors} />
              </div>

              <ConfirmDialog
                open={deleteConfirmOpen}
                title="Delete Service"
                message={`This will permanently delete "${data.service.name}" and all its health check history. This action cannot be undone.`}
                confirmLabel="Delete"
                confirmColor="error"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteConfirmOpen(false)}
              />
            </>
          )
        })()}
      </Show>
    </div>
  )
}
