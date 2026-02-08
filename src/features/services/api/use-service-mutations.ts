import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@shared/services/api-client.ts'
import { Endpoints } from '@shared/constants/endpoints.ts'
import type {
  CreateServicePayload,
  CreateServiceResponse,
  UpdateServicePayload,
  UpdateServiceResponse,
  DeleteServiceResponse,
  PauseResumeResponse,
} from '../types/index.ts'

export function useCreateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateServicePayload) => {
      const response = await apiClient.post<CreateServiceResponse>(
        Endpoints.SERVICES.CREATE,
        payload,
      )
      if (!response.success) throw response
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services-list'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] })
    },
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ serviceId, payload }: { serviceId: string; payload: UpdateServicePayload }) => {
      const response = await apiClient.patch<UpdateServiceResponse>(
        Endpoints.SERVICES.UPDATE(serviceId),
        payload,
      )
      if (!response.success) throw response
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services-list'] })
      queryClient.invalidateQueries({ queryKey: ['service-detail'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] })
    },
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (serviceId: string) => {
      const response = await apiClient.delete<DeleteServiceResponse>(
        Endpoints.SERVICES.DELETE(serviceId),
      )
      if (!response.success) throw response
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services-list'] })
      queryClient.invalidateQueries({ queryKey: ['service-detail'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] })
    },
  })
}

export function usePauseService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (serviceId: string) => {
      const response = await apiClient.post<PauseResumeResponse>(
        Endpoints.SERVICES.PAUSE(serviceId),
      )
      if (!response.success) throw response
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services-list'] })
      queryClient.invalidateQueries({ queryKey: ['service-detail'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] })
    },
  })
}

export function useResumeService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (serviceId: string) => {
      const response = await apiClient.post<PauseResumeResponse>(
        Endpoints.SERVICES.RESUME(serviceId),
      )
      if (!response.success) throw response
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services-list'] })
      queryClient.invalidateQueries({ queryKey: ['service-detail'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] })
    },
  })
}
