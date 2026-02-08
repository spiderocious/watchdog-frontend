import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/hooks/use-auth.ts'
import { ROUTES } from '@shared/constants/routes.ts'

export function ProtectedRoute() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(ROUTES.AUTH.LOGIN, { replace: true })
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated()) {
    return null
  }

  return <Outlet />
}
