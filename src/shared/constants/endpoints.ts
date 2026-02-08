const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const Endpoints = {
  AUTH: {
    REGISTER: `${API_BASE}/api/auth/register`,
    LOGIN: `${API_BASE}/api/auth/login`,
    ME: `${API_BASE}/api/auth/me`,
  },
  DASHBOARD: {
    OVERVIEW: `${API_BASE}/api/dashboard/overview`,
  },
  SERVICES: {
    LIST: `${API_BASE}/api/services`,
    TEST: `${API_BASE}/api/services/test`,
    CREATE: `${API_BASE}/api/services`,
    DETAIL: (id: string) => `${API_BASE}/api/services/${id}`,
    UPDATE: (id: string) => `${API_BASE}/api/services/${id}`,
    DELETE: (id: string) => `${API_BASE}/api/services/${id}`,
    PAUSE: (id: string) => `${API_BASE}/api/services/${id}/pause`,
    RESUME: (id: string) => `${API_BASE}/api/services/${id}/resume`,
    MANUAL_TEST: (id: string) => `${API_BASE}/api/services/${id}/test`,
  },
  SYSTEM: {
    STATUS: `${API_BASE}/api/system/status`,
    HEALTH: `${API_BASE}/api/system/health`,
  },
} as const
