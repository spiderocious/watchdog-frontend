import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@shared/services/api-client.ts'
import { Endpoints } from '@shared/constants/endpoints.ts'
import type { ServicesListData, ServicesQueryParams } from '../types/index.ts'

function buildQueryString(params: ServicesQueryParams): string {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.limit) searchParams.set('limit', String(params.limit))
  if (params.search) searchParams.set('search', params.search)
  if (params.status) searchParams.set('status', params.status)
  if (params.sort_by) searchParams.set('sort_by', params.sort_by)
  if (params.sort_order) searchParams.set('sort_order', params.sort_order)
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ''
}

export function useServicesList(params: ServicesQueryParams = {}) {
  return useQuery({
    queryKey: ['services-list', params],
    queryFn: async () => {
      const url = `${Endpoints.SERVICES.LIST}${buildQueryString(params)}`
      const response = await apiClient.get<ServicesListData>(url)

      if (!response.success) {
        throw response
      }

      return response.data
    },
  })
}
