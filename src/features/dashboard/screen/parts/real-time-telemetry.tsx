import type { RealTimeTelemetryData } from '../../types/index.ts'
import { TelemetryPanel } from './telemetry-panel.tsx'

type RealTimeTelemetryProps = {
  telemetry: RealTimeTelemetryData
}

export function RealTimeTelemetry({ telemetry }: RealTimeTelemetryProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-border-light bg-bg-secondary p-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
        Real-Time Telemetry
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TelemetryPanel
          label="Response Time"
          metric={telemetry.response_time}
          color="text-chart-response"
          showThreshold
        />
        <TelemetryPanel
          label="Request Rate"
          metric={telemetry.request_rate}
          color="text-chart-request"
        />
        <TelemetryPanel
          label="Error Rate"
          metric={telemetry.error_rate}
          color="text-chart-error"
        />
        <TelemetryPanel
          label="Latency P99"
          metric={telemetry.latency_p99}
          color="text-chart-latency"
        />
      </div>
    </section>
  )
}
