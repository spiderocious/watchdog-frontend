import type { RouteObject } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes.ts'
import { AppEntrypoint } from './app.entrypoint.tsx'
import { entrypointRoutes } from '@features/entrypoint/entrypoint.routes.ts'

export const routes: RouteObject[] = [
  {
    path: ROUTES.ROOT,
    Component: AppEntrypoint,
    children: [entrypointRoutes],
  },
]
