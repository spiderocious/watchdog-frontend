export type ServiceOverview = {
  id: string
  status: 'active' | 'down' | 'warning' | 'paused'
  name: string
  endpoint: string
  method: string
  interval: number
  uptime_percentage: number
  avg_response: number
  last_check: string | null
  failure_count: number
  success_count: number
}

export type ChartDataPoint = {
  timestamp: string
  value: number
}

export type TelemetryMetric = {
  current: number
  unit: string
  threshold: number
  chart_data: ChartDataPoint[]
}

export type RealTimeTelemetryData = {
  response_time: TelemetryMetric
  request_rate: TelemetryMetric
  error_rate: TelemetryMetric
  latency_p99: TelemetryMetric
}

export type CheckLog = {
  id: string
  node_id: string
  status_code: number
  status_text: string
  response_time: number
  success: boolean
  error_message: string
  created_at: string
}

export type StatusOverview = {
  total_services: number
  active: number
  down: number
  warning: number
  paused: number
  monitoring_active: boolean
}

export type DashboardMetadata = {
  timestamp: string
  system_status: 'operational' | 'degraded'
}

export type DashboardData = {
  services_overview: ServiceOverview[]
  real_time_telemetry: RealTimeTelemetryData
  service_diagnostics: {
    check_logs: CheckLog[]
  }
  error_logs: CheckLog[]
  status_overview: StatusOverview
  metadata: DashboardMetadata
}
