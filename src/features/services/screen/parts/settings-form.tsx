import { useState } from 'react'
import { Show } from 'meemaw'
import { X } from '@icons/index.ts'
import type { ServiceFormData } from '../../types/index.ts'

type SettingsFormProps = {
  data: ServiceFormData
  onChange: (data: ServiceFormData) => void
  errors: Record<string, string>
}

const INTERVAL_OPTIONS = [
  { label: '15s', value: 15000 },
  { label: '30s', value: 30000 },
  { label: '1m', value: 60000 },
  { label: '5m', value: 300000 },
  { label: '15m', value: 900000 },
  { label: '30m', value: 1800000 },
  { label: '1h', value: 3600000 },
] as const

function formatInterval(ms: number): string {
  if (ms < 60000) return `${ms / 1000}s`
  if (ms < 3600000) return `${ms / 60000}m`
  return `${ms / 3600000}h`
}

function getIntervalRecommendation(ms: number): string {
  if (ms <= 30000) return 'Recommended for APIs'
  if (ms <= 300000) return 'Recommended for websites'
  return 'Recommended for background services'
}

function getSliderPercent(value: number): number {
  const idx = INTERVAL_OPTIONS.findIndex((o) => o.value === value)
  if (idx === -1) return 0
  return (idx / (INTERVAL_OPTIONS.length - 1)) * 100
}

function getClosestInterval(percent: number): number {
  const idx = Math.round((percent / 100) * (INTERVAL_OPTIONS.length - 1))
  return INTERVAL_OPTIONS[Math.max(0, Math.min(idx, INTERVAL_OPTIONS.length - 1))].value
}

export function SettingsForm({ data, onChange, errors }: SettingsFormProps) {
  const [statusCodeInput, setStatusCodeInput] = useState('')

  function update(partial: Partial<ServiceFormData>) {
    onChange({ ...data, ...partial })
  }

  function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const percent = Number(e.target.value)
    update({ check_interval: getClosestInterval(percent) })
  }

  function addStatusCode() {
    const code = parseInt(statusCodeInput, 10)
    if (isNaN(code) || code < 100 || code > 599) return
    if (data.expected_status_codes.includes(code)) return
    update({ expected_status_codes: [...data.expected_status_codes, code] })
    setStatusCodeInput('')
  }

  function removeStatusCode(code: number) {
    update({
      expected_status_codes: data.expected_status_codes.filter((c) => c !== code),
    })
  }

  function handleStatusCodeKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addStatusCode()
    }
  }

  return (
    <div className="flex flex-col gap-8 rounded-lg border border-border-light bg-bg-secondary p-6">
      {/* Check Interval */}
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            Check Interval
          </label>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-primary">
              {formatInterval(data.check_interval)}
            </span>
            <span className="text-[10px] italic tracking-wider text-primary/60">
              {getIntervalRecommendation(data.check_interval)}
            </span>
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={getSliderPercent(data.check_interval)}
            onChange={handleSliderChange}
            className="slider-primary h-1.5 w-full cursor-pointer appearance-none rounded-full bg-bg-tertiary outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:bg-primary"
          />
          <div className="mt-2 flex justify-between">
            {INTERVAL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ check_interval: opt.value })}
                className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  data.check_interval === opt.value
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Show when={!!errors.check_interval}>
          <span className="text-[10px] tracking-wider text-status-error">
            {errors.check_interval}
          </span>
        </Show>
      </div>

      {/* Request Timeout + Failure Threshold */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            Request Timeout
          </label>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="number"
                min={1}
                max={60}
                value={data.request_timeout}
                onChange={(e) => update({ request_timeout: Math.max(1, Math.min(60, parseInt(e.target.value, 10) || 1)) })}
                className="h-12 w-20 rounded-lg border border-border-light bg-bg-primary px-3 text-center font-mono text-lg font-bold text-text-white outline-none transition-colors focus:border-primary/40"
              />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Seconds
            </span>
          </div>
          <span className="text-[10px] tracking-wider text-text-secondary">
            Maximum duration for a single request
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            Failure Threshold
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={10}
              value={data.failure_threshold}
              onChange={(e) => update({ failure_threshold: Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)) })}
              className="h-12 w-20 rounded-lg border border-border-light bg-bg-primary px-3 text-center font-mono text-lg font-bold text-text-white outline-none transition-colors focus:border-primary/40"
            />
          </div>
          <span className="text-[10px] tracking-wider text-text-secondary">
            Service marked down after {data.failure_threshold} failed checks (~{Math.round((data.failure_threshold * data.check_interval) / 1000)}s)
          </span>
        </div>
      </div>

      {/* Expected Status Codes */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
          Expected Status Codes
        </label>
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border-light bg-bg-primary p-3">
          {data.expected_status_codes.map((code) => (
            <span
              key={code}
              className="flex items-center gap-1.5 rounded border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary"
            >
              {code}
              <button
                type="button"
                onClick={() => removeStatusCode(code)}
                className="text-primary/60 transition-colors hover:text-primary"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={statusCodeInput}
            onChange={(e) => setStatusCodeInput(e.target.value.replace(/\D/g, '').slice(0, 3))}
            onKeyDown={handleStatusCodeKeyDown}
            placeholder="Add code..."
            className="h-7 w-24 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary/40"
          />
        </div>
      </div>

      {/* SSL/TLS Verification */}
      <div className="flex items-center justify-between rounded-lg border border-border-light bg-bg-primary p-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            SSL/TLS Verification
          </span>
          <span className="text-[10px] uppercase tracking-wider text-text-secondary">
            Validate certificates for encrypted traffic
          </span>
        </div>
        <button
          type="button"
          onClick={() => update({ ssl_verify: !data.ssl_verify })}
          className="flex items-center gap-2"
        >
          <div
            className={`relative h-6 w-11 rounded-full transition-colors ${
              data.ssl_verify ? 'bg-primary' : 'bg-bg-tertiary'
            }`}
          >
            <div
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                data.ssl_verify ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${
            data.ssl_verify ? 'text-primary' : 'text-text-secondary'
          }`}>
            {data.ssl_verify ? 'Enabled' : 'Disabled'}
          </span>
        </button>
      </div>
    </div>
  )
}
