import type { RouteObject } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes.ts'
import { RegisterScreen } from './screen/register-screen.tsx'

export const authRoutes: RouteObject[] = [
  {
    path: ROUTES.AUTH.REGISTER,
    Component: RegisterScreen,
  },
]
