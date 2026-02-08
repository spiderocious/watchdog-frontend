import { useState } from 'react'
import { Show } from 'meemaw'
import { Plus, X, Loader2, Zap } from '@icons/index.ts'
import { useTestConnection } from '../../api/use-test-connection.ts'
import type { ServiceFormData, HeaderEntry, TestConnectionResponse } from '../../types/index.ts'

type EndpointFormProps = {
  data: ServiceFormData
  onChange: (data: ServiceFormData) => void
  errors: Record<string, string>
}

const METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const

const METHOD_ICONS: Record<string, string> = {
  GET: 'Download',
  POST: 'Upload',
  PUT: 'Edit',
  DELETE: 'Trash',
}

const METHOD_COLORS: Record<string, string> = {
  GET: 'border-primary bg-primary/10 text-primary',
  POST: 'border-border-light bg-bg-tertiary text-text-secondary',
  PUT: 'border-border-light bg-bg-tertiary text-text-secondary',
  DELETE: 'border-border-light bg-bg-tertiary text-text-secondary',
}

function getActiveMethodClass(method: string, selected: string): string {
  if (method !== selected) {
    return 'border-border-light bg-bg-tertiary text-text-secondary hover:border-border-hover hover:text-text-white'
  }
  return METHOD_COLORS[method] ?? METHOD_COLORS.GET
}

function parseEndpointUrl(url: string): { protocol: string; rest: string } {
  if (url.startsWith('https://')) return { protocol: 'https://', rest: url.slice(8) }
  if (url.startsWith('http://')) return { protocol: 'http://', rest: url.slice(7) }
  return { protocol: 'https://', rest: url }
}

function buildEndpointUrl(protocol: string, rest: string): string {
  if (!rest) return ''
  return `${protocol}${rest}`
}

export function EndpointForm({ data, onChange, errors }: EndpointFormProps) {
  const { protocol, rest } = parseEndpointUrl(data.endpoint_url)
  const [urlProtocol, setUrlProtocol] = useState(protocol || 'https://')
  const [urlPath, setUrlPath] = useState(rest)
  const [testResult, setTestResult] = useState<TestConnectionResponse | null>(null)
  const [testError, setTestError] = useState('')

  const testMutation = useTestConnection()

  const showBody = data.method === 'POST' || data.method === 'PUT'
  const activeHeaders = data.headers.filter((h) => h.key.trim() !== '')

  function update(partial: Partial<ServiceFormData>) {
    onChange({ ...data, ...partial })
  }

  function handleUrlPathChange(value: string) {
    setUrlPath(value)
    update({ endpoint_url: buildEndpointUrl(urlProtocol, value) })
  }

  function handleProtocolChange(value: string) {
    setUrlProtocol(value)
    update({ endpoint_url: buildEndpointUrl(value, urlPath) })
  }

  function addHeader() {
    update({ headers: [...data.headers, { key: '', value: '' }] })
  }

  function updateHeader(index: number, field: keyof HeaderEntry, value: string) {
    const updated = data.headers.map((h, i) =>
      i === index ? { ...h, [field]: value } : h,
    )
    update({ headers: updated })
  }

  function removeHeader(index: number) {
    update({ headers: data.headers.filter((_, i) => i !== index) })
  }

  function handleTestConnection() {
    setTestResult(null)
    setTestError('')

    const headersObj: Record<string, string> = {}
    for (const h of data.headers) {
      if (h.key.trim()) headersObj[h.key.trim()] = h.value
    }

    testMutation.mutate(
      {
        endpoint_url: data.endpoint_url,
        method: data.method,
        headers: Object.keys(headersObj).length > 0 ? headersObj : undefined,
        body: showBody && data.body ? data.body : undefined,
      },
      {
        onSuccess: (result) => setTestResult(result),
        onError: () => setTestError('Connection test failed. Check the endpoint URL and try again.'),
      },
    )
  }

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border-light bg-bg-secondary p-6">
      {/* Service Name + Endpoint URL */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            Service Name
          </label>
          <input
            type="text"
            value={data.service_name}
            onChange={(e) => update({ service_name: e.target.value })}
            placeholder="API Gateway"
            className="h-11 rounded-lg border border-border-light bg-bg-primary px-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-primary/40"
          />
          <Show when={!!errors.service_name}>
            <span className="text-[10px] tracking-wider text-status-error">
              {errors.service_name}
            </span>
          </Show>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            Endpoint URL
          </label>
          <div className="flex">
            <select
              value={urlProtocol}
              onChange={(e) => handleProtocolChange(e.target.value)}
              className="h-11 rounded-l-lg border border-r-0 border-border-light bg-bg-tertiary px-3 text-xs font-bold text-primary outline-none"
            >
              <option value="https://">https://</option>
              <option value="http://">http://</option>
            </select>
            <input
              type="text"
              value={urlPath}
              onChange={(e) => handleUrlPathChange(e.target.value)}
              placeholder="api.example.com/v1/health"
              className="h-11 flex-1 rounded-r-lg border border-border-light bg-bg-primary px-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-primary/40"
            />
          </div>
          <Show when={!!errors.endpoint_url}>
            <span className="text-[10px] tracking-wider text-status-error">
              {errors.endpoint_url}
            </span>
          </Show>
        </div>
      </div>

      {/* Request Method */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
          Request Method
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {METHODS.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => update({ method })}
              className={`flex h-12 items-center justify-center gap-2 rounded-lg border text-xs font-bold uppercase tracking-widest transition-colors ${getActiveMethodClass(method, data.method)}`}
            >
              <span className="text-[10px]">{METHOD_ICONS[method] ? '↕' : ''}</span>
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Request Headers */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            Request Headers
          </label>
          <span className="text-[10px] uppercase tracking-wider text-text-secondary">
            {activeHeaders.length} active headers
          </span>
        </div>

        {data.headers.map((header, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={header.key}
              onChange={(e) => updateHeader(i, 'key', e.target.value)}
              placeholder="Header-Name"
              className="h-10 flex-1 rounded-lg border border-border-light bg-bg-primary px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-primary/40"
            />
            <input
              type="text"
              value={header.value}
              onChange={(e) => updateHeader(i, 'value', e.target.value)}
              placeholder="value"
              className="h-10 flex-1 rounded-lg border border-border-light bg-bg-primary px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-primary/40"
            />
            <button
              type="button"
              onClick={() => removeHeader(i)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addHeader}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border-light text-[10px] font-bold uppercase tracking-wider text-text-secondary transition-colors hover:border-border-hover hover:text-text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Header
        </button>
      </div>

      {/* Request Body (for POST/PUT) */}
      <Show when={showBody}>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            Request Body (JSON)
          </label>
          <div className="overflow-hidden rounded-lg border border-border-light bg-[#0a0f0a]">
            <textarea
              value={data.body}
              onChange={(e) => update({ body: e.target.value })}
              placeholder={'{\n  "key": "value"\n}'}
              rows={8}
              spellCheck={false}
              className="w-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed text-primary outline-none placeholder:text-text-secondary/40"
            />
          </div>
        </div>
      </Show>

      {/* Test Connection */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={!data.endpoint_url || testMutation.isPending}
            className="flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-[10px] font-bold uppercase tracking-wider text-primary-text transition-colors hover:bg-primary-hover disabled:opacity-40"
          >
            {testMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            Test Connection
          </button>

          <Show when={!!testResult}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${testResult?.connection_established ? 'bg-status-success' : 'bg-status-error'}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${testResult?.connection_established ? 'text-status-success' : 'text-status-error'}`}>
                  HTTP {testResult?.status_code} {testResult?.status_text}
                </span>
              </div>
              <span className="font-mono text-[11px] tracking-wider text-text-secondary">
                {testResult?.response_time}{testResult?.response_time_unit} response time
              </span>
            </div>
          </Show>

          <Show when={!!testError}>
            <span className="text-xs tracking-wider text-status-error">{testError}</span>
          </Show>
        </div>
      </div>
    </div>
  )
}
