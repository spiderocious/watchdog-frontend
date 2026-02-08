import type { ApiResponse } from '@shared/types/index.ts'
import { storageAdapter } from './storage-adapter.ts'

type RequestOptions = {
  headers?: Record<string, string>
  body?: unknown
}

function getAuthHeaders(): Record<string, string> {
  const token = storageAdapter.get<string>('access_token')
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

function handleUnauthorized(): void {
  // Clear token and redirect to login
  storageAdapter.remove('access_token')
  window.location.href = '/login'
}

async function request<T>(
  method: string,
  url: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...options.headers,
  }

  const config: RequestInit = {
    method,
    headers,
  }

  if (options.body && method !== 'GET') {
    config.body = JSON.stringify(options.body)
  }

  const response = await fetch(url, config)

  // Handle 401 Unauthorized
  if (response.status === 401) {
    handleUnauthorized()
    // Return a default error response to prevent further processing
    return {
      success: false,
      message: 'Unauthorized - please login again',
    } as ApiResponse<T>
  }

  const data = (await response.json()) as ApiResponse<T>
  return data
}

export const apiClient = {
  get<T>(url: string, options?: RequestOptions) {
    return request<T>('GET', url, options)
  },

  post<T>(url: string, body?: unknown, options?: RequestOptions) {
    return request<T>('POST', url, { ...options, body })
  },

  patch<T>(url: string, body?: unknown, options?: RequestOptions) {
    return request<T>('PATCH', url, { ...options, body })
  },

  delete<T>(url: string, options?: RequestOptions) {
    return request<T>('DELETE', url, options)
  },
}
