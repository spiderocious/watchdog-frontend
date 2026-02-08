import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { storageAdapter } from '@shared/services/storage-adapter.ts'
import { ROUTES } from '@shared/constants/routes.ts'

export function useAuth() {
  const navigate = useNavigate()

  const isAuthenticated = useCallback((): boolean => {
    const token = storageAdapter.get<string>('access_token')
    return token !== null && token.length > 0
  }, [])

  const logout = useCallback(() => {
    storageAdapter.remove('access_token')
    navigate(ROUTES.AUTH.LOGIN, { replace: true })
  }, [navigate])

  const getToken = useCallback((): string | null => {
    return storageAdapter.get<string>('access_token')
  }, [])

  return {
    isAuthenticated,
    logout,
    getToken,
  }
}
