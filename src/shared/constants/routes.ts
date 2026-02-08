export const ROUTES = {
  ROOT: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  DASHBOARD: '/dashboard',
  SERVICES: {
    ROOT: '/services',
    DETAIL: '/services/:service_id',
  },
} as const
