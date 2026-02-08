import type { RouteObject } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes.ts'
import { DashboardScreen } from './screen/dashboard-screen.tsx'

export const dashboardRoutes: RouteObject[] = [
  {
    path: ROUTES.DASHBOARD,
    Component: DashboardScreen,
  },
]
