import type { RouteObject } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes.ts'
import { AppEntrypoint } from './app.entrypoint.tsx'
import { AppLayout } from '@ui/components/index.ts'
import { entrypointRoutes } from '@features/entrypoint/entrypoint.routes.ts'
import { authRoutes } from '@features/auth/auth.routes.ts'
import { dashboardRoutes } from '@features/dashboard/index.ts'
import { servicesRoutes } from '@features/services/index.ts'

export const routes: RouteObject[] = [
  {
    path: ROUTES.ROOT,
    Component: AppEntrypoint,
    children: [
      entrypointRoutes,
      ...authRoutes,
      {
        Component: AppLayout,
        children: [...dashboardRoutes, ...servicesRoutes],
      },
    ],
  },
]
