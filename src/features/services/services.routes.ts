import type { RouteObject } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes.ts'
import { ServicesScreen } from './screen/services-screen.tsx'
import { CreateServiceScreen } from './screen/create-service-screen.tsx'
import { ServiceDetailScreen } from './screen/service-detail-screen.tsx'

export const servicesRoutes: RouteObject[] = [
  {
    path: ROUTES.SERVICES.ROOT,
    Component: ServicesScreen,
  },
  {
    path: ROUTES.SERVICES.CREATE,
    Component: CreateServiceScreen,
  },
  {
    path: ROUTES.SERVICES.DETAIL,
    Component: ServiceDetailScreen,
  },
]
