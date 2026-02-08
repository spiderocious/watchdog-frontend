import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@shared/services/api-client.ts'
import { Endpoints } from '@shared/constants/endpoints.ts'
import type { ServiceDetailData } from '../types/index.ts'

export function useServiceDetail(serviceId: string) {
  return useQuery({
    queryKey: ['service-detail', serviceId],
    queryFn: async () => {
      const response = await apiClient.get<ServiceDetailData>(
        Endpoints.SERVICES.DETAIL(serviceId),
      )

      if (!response.success) {
        throw response
      }

      return response.data
    },
    enabled: !!serviceId,
    refetchInterval: 30_000,
  })
}
