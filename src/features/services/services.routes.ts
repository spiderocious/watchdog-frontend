import type { RouteObject } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes.ts'
import { ServicesScreen } from './screen/services-screen.tsx'

export const servicesRoutes: RouteObject[] = [
  {
    path: ROUTES.SERVICES.ROOT,
    Component: ServicesScreen,
  },
]
