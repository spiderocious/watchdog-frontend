import { useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Show } from 'meemaw'
import { Loader2, AlertTriangle, ArrowLeft, Check } from '@icons/index.ts'
import { ROUTES } from '@shared/constants/routes.ts'
import { useServiceDetail } from '../api/use-service-detail.ts'
import { useUpdateService } from '../api/use-service-mutations.ts'
import type { ServiceFormData, UpdateServicePayload } from '../types/index.ts'
import { EndpointForm } from './parts/endpoint-form.tsx'
import { SettingsForm } from './parts/settings-form.tsx'

function serviceToFormData(service: {
  name: string
  endpoint: string
  method: string
  check_interval: number
  failure_threshold: number
}): ServiceFormData {
  return {
    service_name: service.name,
    endpoint_url: service.endpoint,
    method: service.method,
    headers: [],
    body: '',
    check_interval: service.check_interval,
    request_timeout: 10,
    failure_threshold: service.failure_threshold,
    expected_status_codes: [200, 201, 204],
    ssl_verify: true,
  }
}

export function EditServiceScreen() {
  const { service_id } = useParams<{ service_id: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useServiceDetail(service_id ?? '')
  const updateMutation = useUpdateService()

  const [formData, setFormData] = useState<ServiceFormData | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')

  // Initialize form data from service detail once loaded
  const currentFormData = useMemo(() => {
    if (formData) return formData
    if (!data?.service) return null
    return serviceToFormData(data.service)
  }, [formData, data])

  const handleFormChange = useCallback((updated: ServiceFormData) => {
    setFormData(updated)
    setErrors({})
    setApiError('')
  }, [])

  function validate(): Record<string, string> {
    if (!currentFormData) return {}
    const errs: Record<string, string> = {}
    if (!currentFormData.service_name.trim()) {
      errs.service_name = 'Service name is required'
    } else if (currentFormData.service_name.length > 100) {
      errs.service_name = 'Service name must be under 100 characters'
    }
    if (!currentFormData.endpoint_url.trim()) {
      errs.endpoint_url = 'Endpoint URL is required'
    } else if (!/^https?:\/\/.+/.test(currentFormData.endpoint_url)) {
      errs.endpoint_url = 'A valid HTTP/HTTPS URL is required'
    }
    if (currentFormData.check_interval < 15000 || currentFormData.check_interval > 3600000) {
      errs.check_interval = 'Check interval must be between 15s and 1h'
    }
    return errs
  }

  function handleSave() {
    if (!service_id || !currentFormData) return

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setApiError('')

    const headersObj: Record<string, string> = {}
    for (const h of currentFormData.headers) {
      if (h.key.trim()) headersObj[h.key.trim()] = h.value
    }

    const showBody = currentFormData.method === 'POST' || currentFormData.method === 'PUT'

    const payload: UpdateServicePayload = {
      service_name: currentFormData.service_name.trim(),
      endpoint_url: currentFormData.endpoint_url.trim(),
      method: currentFormData.method,
      check_interval: currentFormData.check_interval,
      failure_threshold: currentFormData.failure_threshold,
      expected_status_codes: currentFormData.expected_status_codes,
      headers: Object.keys(headersObj).length > 0 ? headersObj : undefined,
      body: showBody && currentFormData.body.trim() ? currentFormData.body.trim() : undefined,
    }

    updateMutation.mutate(
      { serviceId: service_id, payload },
      {
        onSuccess: () => navigate(`/services/${service_id}`),
        onError: (err) => {
          const apiErr = err as { message?: string; fields?: Array<{ path: string; msg: string }> }
          if (apiErr.fields && apiErr.fields.length > 0) {
            const fieldErrors: Record<string, string> = {}
            for (const f of apiErr.fields) {
              fieldErrors[f.path] = f.msg
            }
            setErrors(fieldErrors)
          } else {
            setApiError(apiErr.message ?? 'Failed to update service. Please try again.')
          }
        },
      },
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Loading */}
      <Show when={isLoading}>
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </Show>

      {/* Error */}
      <Show when={isError && !isLoading}>
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <AlertTriangle className="h-8 w-8 text-status-error/60" />
          <span className="text-xs uppercase tracking-wider text-status-error">
            Service not found or failed to load
          </span>
        </div>
      </Show>

      {/* Form */}
      <Show when={!!currentFormData && !isLoading}>
        {(() => {
          if (!currentFormData) return null
          return (
            <>
              <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 pb-0">
                {/* Header */}
                <div>
                  <button
                    type="button"
                    onClick={() => navigate(`/services/${service_id}`)}
                    className="mb-3 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-primary transition-colors hover:text-primary-hover"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Back to Service
                  </button>
                  <h1 className="text-xl font-bold uppercase tracking-wider text-text-white">
                    Edit Service
                  </h1>
                  <p className="text-[11px] uppercase tracking-wider text-text-secondary">
                    {data?.service.name}
                  </p>
                </div>

                {/* Endpoint Configuration */}
                <div>
                  <h2 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                    Endpoint Configuration
                  </h2>
                  <EndpointForm data={currentFormData} onChange={handleFormChange} errors={errors} />
                </div>

                {/* Monitoring Settings */}
                <div>
                  <h2 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                    Monitoring Settings
                  </h2>
                  <SettingsForm data={currentFormData} onChange={handleFormChange} errors={errors} />
                </div>

                {/* API Error */}
                <Show when={!!apiError}>
                  <div className="rounded-lg border border-status-error/30 bg-status-error/5 px-4 py-3">
                    <span className="text-xs tracking-wider text-status-error">{apiError}</span>
                  </div>
                </Show>
              </div>

              {/* Bottom bar */}
              <div className="sticky bottom-0 border-t border-border-light bg-bg-primary px-4 py-4">
                <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
                  <button
                    type="button"
                    onClick={() => navigate(`/services/${service_id}`)}
                    className="flex items-center gap-2 rounded-lg border border-border-light px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary transition-colors hover:border-border-hover hover:text-text-white"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-[10px] font-bold uppercase tracking-wider text-primary-text transition-colors hover:bg-primary-hover disabled:opacity-40"
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Save Changes
                        <Check className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )
        })()}
      </Show>
    </div>
  )
}
