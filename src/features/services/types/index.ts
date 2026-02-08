export type ServiceStatus = 'active' | 'down' | 'warning' | 'paused'

export type ServiceItem = {
  id: string
  status: ServiceStatus
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

export type ServicesOverviewStats = {
  total_services: number
  active_count: number
  down_count: number
  warning_count: number
  paused_count: number
}

export type ServicesListData = {
  overview: ServicesOverviewStats
  items: ServiceItem[]
  page: number
  limit: number
  total: number
  total_pages: number
}

export type ServicesQueryParams = {
  page?: number
  limit?: number
  search?: string
  status?: ServiceStatus | ''
  sort_by?: 'name' | 'uptime' | 'last_check' | 'created_at' | ''
  sort_order?: 'asc' | 'desc' | ''
}

export type CreateServicePayload = {
  service_name: string
  endpoint_url: string
  method?: string
  check_interval: number
  expected_status_codes?: number[]
  failure_threshold?: number
  headers?: Record<string, string>
  body?: string
}

export type CreateServiceResponse = {
  service_id: string
  service_name: string
  endpoint_url: string
  method: string
  status: string
  monitoring_started: boolean
  created_at: string
}

export type TestConnectionPayload = {
  endpoint_url: string
  method?: string
  headers?: Record<string, string>
  body?: string
}

export type TestConnectionResponse = {
  status_code: number
  status_text: string
  response_time: number
  response_time_unit: string
  content_size: number
  content_size_unit: string
  connection_established: boolean
}

export type HeaderEntry = {
  key: string
  value: string
}

export type ServiceFormData = {
  service_name: string
  endpoint_url: string
  method: string
  headers: HeaderEntry[]
  body: string
  check_interval: number
  request_timeout: number
  failure_threshold: number
  expected_status_codes: number[]
  ssl_verify: boolean
}

export type UpdateServicePayload = {
  service_name?: string
  endpoint_url?: string
  method?: string
  check_interval?: number
  failure_threshold?: number
  headers?: Record<string, string>
  body?: string
  expected_status_codes?: number[]
}

export type UpdateServiceResponse = {
  service_id: string
  service_name: string
  endpoint_url: string
  method: string
  check_interval: number
  failure_threshold: number
  status: string
  updated_at: string
}

export type DeleteServiceResponse = {
  service_id: string
  deleted_at: string
}

export type PauseResumeResponse = {
  service_id: string
  status: string
  paused_at?: string
  resumed_at?: string
}

// Service Detail types

export type ServiceInfo = {
  id: string
  name: string
  endpoint: string
  method: string
  status: ServiceStatus
  check_interval: number
  failure_threshold: number
  created_at: string
}

export type QuickMetrics = {
  status: ServiceStatus
  uptime_30d: number
  avg_response: number
  errors_7d: number
}

export type ResponseTimePoint = {
  time: string
  value: number
}

export type HealthCheckEntry = {
  id: string
  node_id: string
  status_code: number
  status_text: string
  response_time: number
  success: boolean
  error_message: string
  created_at: string
}

export type ServiceDetailData = {
  service: ServiceInfo
  quick_metrics: QuickMetrics
  response_time_history: ResponseTimePoint[]
  health_check_log: HealthCheckEntry[]
  errors: HealthCheckEntry[]
}
