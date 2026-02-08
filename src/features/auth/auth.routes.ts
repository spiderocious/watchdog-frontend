import type { RouteObject } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes.ts'
import { RegisterScreen } from './screen/register-screen.tsx'
import { LoginScreen } from './screen/login-screen.tsx'

export const authRoutes: RouteObject[] = [
  {
    path: ROUTES.AUTH.REGISTER,
    Component: RegisterScreen,
  },
  {
    path: ROUTES.AUTH.LOGIN,
    Component: LoginScreen,
  },
]
