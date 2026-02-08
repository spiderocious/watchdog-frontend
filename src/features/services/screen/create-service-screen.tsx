import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Show } from 'meemaw'
import { ArrowLeft, ArrowRight, Check, X, Loader2 } from '@icons/index.ts'
import { ROUTES } from '@shared/constants/routes.ts'
import { useCreateService } from '../api/use-service-mutations.ts'
import type { ServiceFormData, CreateServicePayload } from '../types/index.ts'
import { WizardStepper } from './parts/wizard-stepper.tsx'
import { EndpointForm } from './parts/endpoint-form.tsx'
import { SettingsForm } from './parts/settings-form.tsx'
import { ReviewConfirm } from './parts/review-confirm.tsx'

const STEPS = [
  { label: 'Endpoint' },
  { label: 'Settings' },
  { label: 'Confirm' },
]

const INITIAL_FORM_DATA: ServiceFormData = {
  service_name: '',
  endpoint_url: '',
  method: 'GET',
  headers: [],
  body: '',
  check_interval: 30000,
  request_timeout: 10,
  failure_threshold: 3,
  expected_status_codes: [200, 201, 204],
  ssl_verify: true,
}

function validateStep0(data: ServiceFormData): Record<string, string> {
  const errs: Record<string, string> = {}
  if (!data.service_name.trim()) {
    errs.service_name = 'Service name is required'
  } else if (data.service_name.length > 100) {
    errs.service_name = 'Service name must be under 100 characters'
  }
  if (!data.endpoint_url.trim()) {
    errs.endpoint_url = 'Endpoint URL is required'
  } else if (!/^https?:\/\/.+/.test(data.endpoint_url)) {
    errs.endpoint_url = 'A valid HTTP/HTTPS URL is required'
  }
  return errs
}

function validateStep1(data: ServiceFormData): Record<string, string> {
  const errs: Record<string, string> = {}
  if (data.check_interval < 15000 || data.check_interval > 3600000) {
    errs.check_interval = 'Check interval must be between 15s and 1h'
  }
  return errs
}

export function CreateServiceScreen() {
  const navigate = useNavigate()
  const createMutation = useCreateService()

  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<ServiceFormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmed, setConfirmed] = useState(false)
  const [apiError, setApiError] = useState('')

  const handleFormChange = useCallback((data: ServiceFormData) => {
    setFormData(data)
    setErrors({})
    setApiError('')
  }, [])

  function goNext() {
    if (step === 0) {
      const errs = validateStep0(formData)
      if (Object.keys(errs).length > 0) {
        setErrors(errs)
        return
      }
    }
    if (step === 1) {
      const errs = validateStep1(formData)
      if (Object.keys(errs).length > 0) {
        setErrors(errs)
        return
      }
    }
    setErrors({})
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  function goBack() {
    setErrors({})
    setStep((s) => Math.max(s - 1, 0))
  }

  function handleEditFromReview(targetStep: number) {
    setStep(targetStep)
  }

  function handleSubmit() {
    if (!confirmed) return
    setApiError('')

    const headersObj: Record<string, string> = {}
    for (const h of formData.headers) {
      if (h.key.trim()) headersObj[h.key.trim()] = h.value
    }

    const showBody = formData.method === 'POST' || formData.method === 'PUT'

    const payload: CreateServicePayload = {
      service_name: formData.service_name.trim(),
      endpoint_url: formData.endpoint_url.trim(),
      method: formData.method,
      check_interval: formData.check_interval,
      expected_status_codes: formData.expected_status_codes,
      failure_threshold: formData.failure_threshold,
      headers: Object.keys(headersObj).length > 0 ? headersObj : undefined,
      body: showBody && formData.body.trim() ? formData.body.trim() : undefined,
    }

    createMutation.mutate(payload, {
      onSuccess: () => navigate(ROUTES.SERVICES.ROOT),
      onError: (err) => {
        const apiErr = err as { message?: string; fields?: Array<{ path: string; msg: string }> }
        if (apiErr.fields && apiErr.fields.length > 0) {
          const fieldErrors: Record<string, string> = {}
          for (const f of apiErr.fields) {
            fieldErrors[f.path] = f.msg
          }
          setErrors(fieldErrors)
          // Go to the step with the error
          if (fieldErrors.service_name || fieldErrors.endpoint_url || fieldErrors.method) {
            setStep(0)
          } else if (fieldErrors.check_interval || fieldErrors.failure_threshold) {
            setStep(1)
          }
        } else {
          setApiError(apiErr.message ?? 'Failed to create service. Please try again.')
        }
      },
    })
  }

  const isLastStep = step === STEPS.length - 1
  const canSubmit = isLastStep && confirmed && !createMutation.isPending

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 pb-0">
        {/* Stepper */}
        <WizardStepper steps={STEPS} current={step} />

        {/* Step content */}
        <div className="flex-1">
          <Show when={step === 0}>
            <EndpointForm data={formData} onChange={handleFormChange} errors={errors} />
          </Show>
          <Show when={step === 1}>
            <SettingsForm data={formData} onChange={handleFormChange} errors={errors} />
          </Show>
          <Show when={step === 2}>
            <ReviewConfirm
              data={formData}
              onEdit={handleEditFromReview}
              confirmed={confirmed}
              onConfirmChange={setConfirmed}
            />
          </Show>
        </div>

        {/* API Error */}
        <Show when={!!apiError}>
          <div className="rounded-lg border border-status-error/30 bg-status-error/5 px-4 py-3">
            <span className="text-xs tracking-wider text-status-error">{apiError}</span>
          </div>
        </Show>
      </div>

      {/* Bottom navigation - sticky */}
      <div className="sticky bottom-0 border-t border-border-light bg-bg-primary px-4 py-4">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
          <Show when={step === 0}>
            <button
              type="button"
              onClick={() => navigate(ROUTES.SERVICES.ROOT)}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-text-secondary transition-colors hover:text-text-white"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
          </Show>
          <Show when={step > 0}>
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-2 rounded-lg border border-border-light px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary transition-colors hover:border-border-hover hover:text-text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          </Show>

          <Show when={!isLastStep}>
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-[10px] font-bold uppercase tracking-wider text-primary-text transition-colors hover:bg-primary-hover"
            >
              Next Step
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Show>
          <Show when={isLastStep}>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-[10px] font-bold uppercase tracking-wider text-primary-text transition-colors hover:bg-primary-hover disabled:opacity-40"
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create Service
                  <Check className="h-4 w-4" />
                </>
              )}
            </button>
          </Show>
        </div>
      </div>
    </div>
  )
}
