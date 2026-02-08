import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@shared/services/api-client.ts'
import { Endpoints } from '@shared/constants/endpoints.ts'
import type { DashboardData } from '../types/index.ts'

export function useDashboardOverview() {
  return useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: async () => {
      const response = await apiClient.get<DashboardData>(
        Endpoints.DASHBOARD.OVERVIEW,
      )

      if (!response.success) {
        throw response
      }

      return response.data
    },
    refetchInterval: 30_000,
  })
}
