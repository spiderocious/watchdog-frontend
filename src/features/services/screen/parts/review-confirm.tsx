import { useState } from 'react'
import { Upload, Sliders, CheckCircle } from '@icons/index.ts'
import type { ServiceFormData } from '../../types/index.ts'

type ReviewConfirmProps = {
  data: ServiceFormData
  onEdit: (step: number) => void
  confirmed: boolean
  onConfirmChange: (v: boolean) => void
}

const METHOD_COLOR: Record<string, string> = {
  GET: 'border-status-success text-status-success',
  POST: 'border-status-info text-status-info',
  PUT: 'border-status-info text-status-info',
  DELETE: 'border-status-error text-status-error',
}

function formatInterval(ms: number): string {
  if (ms < 60000) return `${ms / 1000}s Interval`
  if (ms < 3600000) return `${ms / 60000}m Interval`
  return `${ms / 3600000}h Interval`
}

export function ReviewConfirm({ data, onEdit, confirmed, onConfirmChange }: ReviewConfirmProps) {
  const activeHeaders = data.headers.filter((h) => h.key.trim())
  const methodColor = METHOD_COLOR[data.method] ?? METHOD_COLOR.GET

  return (
    <div className="flex flex-col gap-4">
      {/* Endpoint Details */}
      <div className="rounded-lg border border-border-light bg-bg-secondary p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-primary" />
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-text-white">
              Endpoint Details
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onEdit(0)}
            className="text-[10px] font-bold uppercase tracking-wider text-primary transition-colors hover:text-primary-hover"
          >
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-wider text-text-secondary">
              Service Name
            </span>
            <span className="text-sm font-semibold text-text-white">
              {data.service_name || '--'}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-wider text-text-secondary">
              Target URL
            </span>
            <span className="break-all font-mono text-sm text-primary">
              {data.endpoint_url || '--'}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-wider text-text-secondary">
              Request Method
            </span>
            <span className={`w-fit rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${methodColor}`}>
              {data.method}
            </span>
          </div>
        </div>

        {activeHeaders.length > 0 && (
          <div className="mt-4 border-t border-border-light/50 pt-4">
            <span className="text-[9px] uppercase tracking-wider text-text-secondary">
              Headers ({activeHeaders.length})
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {activeHeaders.map((h, i) => (
                <span
                  key={i}
                  className="rounded border border-border-light bg-bg-tertiary px-2 py-0.5 font-mono text-[10px] text-text-secondary"
                >
                  {h.key}: {h.value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Monitoring Settings */}
      <div className="rounded-lg border border-border-light bg-bg-secondary p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-primary" />
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-text-white">
              Monitoring Settings
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onEdit(1)}
            className="text-[10px] font-bold uppercase tracking-wider text-primary transition-colors hover:text-primary-hover"
          >
            Edit
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-wider text-text-secondary">
              Check Interval
            </span>
            <span className="text-sm font-semibold text-text-white">
              {formatInterval(data.check_interval)}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-wider text-text-secondary">
              Request Timeout
            </span>
            <span className="text-sm font-semibold text-text-white">
              {data.request_timeout}s Timeout
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-wider text-text-secondary">
              Failure Threshold
            </span>
            <span className="text-sm font-semibold text-text-white">
              {data.failure_threshold} Failure Threshold
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-wider text-text-secondary">
              Encryption
            </span>
            <div className="flex items-center gap-1.5">
              <div className={`h-1.5 w-1.5 rounded-full ${data.ssl_verify ? 'bg-status-success' : 'bg-text-secondary'}`} />
              <span className="text-sm font-semibold text-text-white">
                SSL: {data.ssl_verify ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        {data.expected_status_codes.length > 0 && (
          <div className="mt-4 border-t border-border-light/50 pt-4">
            <span className="text-[9px] uppercase tracking-wider text-text-secondary">
              Expected Status Codes
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.expected_status_codes.map((code) => (
                <span
                  key={code}
                  className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary"
                >
                  {code}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation checkbox */}
      <div className="rounded-lg border border-border-light bg-bg-secondary p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <div className="pt-0.5">
            <button
              type="button"
              onClick={() => onConfirmChange(!confirmed)}
              className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                confirmed
                  ? 'border-primary bg-primary'
                  : 'border-border-light bg-bg-primary hover:border-border-hover'
              }`}
            >
              {confirmed && <CheckCircle className="h-3.5 w-3.5 text-bg-primary" />}
            </button>
          </div>
          <span
            onClick={() => onConfirmChange(!confirmed)}
            className="text-[11px] leading-relaxed tracking-wider text-text-secondary"
          >
            I confirm this configuration is correct and authorize the monitoring engine to begin
            monitoring the specified endpoint with the defined parameters.
          </span>
        </label>
      </div>
    </div>
  )
}
