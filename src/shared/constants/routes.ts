export const ROUTES = {
  ROOT: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  DASHBOARD: '/dashboard',
  SERVICES: {
    ROOT: '/services',
    CREATE: '/services/create',
    EDIT: '/services/:service_id/edit',
    DETAIL: '/services/:service_id',
  },
} as const
