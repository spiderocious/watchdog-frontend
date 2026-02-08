import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@shared/services/api-client.ts'
import { storageAdapter } from '@shared/services/storage-adapter.ts'
import { Endpoints } from '@shared/constants/endpoints.ts'
import type { AuthData } from '@shared/types/index.ts'
import type { LoginPayload } from '../types/index.ts'

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await apiClient.post<AuthData>(
        Endpoints.AUTH.LOGIN,
        payload,
      )

      if (!response.success) {
        throw response
      }

      return response.data
    },
    onSuccess: (data) => {
      storageAdapter.set('access_token', data.access_token)
      storageAdapter.set('refresh_token', data.refresh_token)
    },
  })
}
