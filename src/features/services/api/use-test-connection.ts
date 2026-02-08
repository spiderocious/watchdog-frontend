import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@shared/services/api-client.ts'
import { Endpoints } from '@shared/constants/endpoints.ts'
import type {
  TestConnectionPayload,
  TestConnectionResponse,
} from '../types/index.ts'

export function useTestConnection() {
  return useMutation({
    mutationFn: async (payload: TestConnectionPayload) => {
      const response = await apiClient.post<TestConnectionResponse>(
        Endpoints.SERVICES.TEST,
        payload,
      )
      if (!response.success) throw response
      return response.data
    },
  })
}
