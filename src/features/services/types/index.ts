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
