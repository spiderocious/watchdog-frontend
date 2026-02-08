# WatchDog Frontend

Real-time uptime monitoring dashboard built with React 19 and a SCADA-inspired industrial dark theme. Connects to the WatchDog backend API for service health monitoring, alerting, and diagnostics.

<img width="1600" height="1280" alt="image" src="https://github.com/user-attachments/assets/2ea95188-67a0-44f1-9280-d00602b7678b" />


## Links
- [Live Demo](https://watchdog.devferanmi.xyz/)
- [GitHub Repository](https://github.com/spiderocious/watchdog-frontend)


## Architecture

The project uses the scalable **Feature-Sliced Design (FSD)** with strict module boundaries:

```
src/
  features/           # Feature modules (self-contained)
    auth/             # Registration, login, session
      api/            # TanStack Query hooks (mutations)
      hooks/          # Custom hooks (password strength)
      screen/         # Page components
        parts/        # Composable UI parts
      types/          # Feature-specific types
    dashboard/        # System overview, telemetry, diagnostics
    services/         # Service CRUD, monitoring, detail views
    entrypoint/       # App bootstrap, auth guard, redirect logic
  shared/             # Cross-feature utilities
    constants/        # Routes, API endpoints
    icons/            # Lucide icon proxy (single re-export point)
    services/         # API client, storage adapter
    types/            # API response types, auth types
  ui/                 # Shell components
    components/       # Layout, sidebar, topbar, dialogs
```


## Key Patterns

**API Layer** -- All HTTP calls go through `apiClient` (`src/shared/services/api-client.ts`), which handles auth headers, JSON serialization, and typed responses. Never use raw `fetch` in components.

**Storage** -- All `localStorage` operations go through `storageAdapter` (`src/shared/services/storage-adapter.ts`), which namespaces keys with a `watchdog_` prefix.

**Icons** -- All Lucide icons are re-exported from `@shared/icons/index.ts`. Import from `@icons/index.ts`, never directly from `lucide-react`.

**State Management** -- No global state library. Uses React state, context, props, and TanStack Query's shared cache for server state.

**Conditional Rendering** -- Uses Meemaw's `<Show when={condition}>` component instead of ternaries for cleaner JSX.

**Query Invalidation** -- Mutations invalidate related query keys (`services-list`, `service-detail`, `dashboard-overview`) to keep all views in sync.

## Pages

| Route | Screen | Description |
|-------|--------|-------------|
| `/` | Entrypoint | Auth check, redirects to `/dashboard` or `/login` |
| `/register` | Registration | Full registration with password strength meter |
| `/login` | Login | Email/password authentication |
| `/dashboard` | Dashboard | System health matrix, telemetry, diagnostics, alerts |
| `/services` | Services Overview | Paginated table with search, filter, stats cards |
| `/services/create` | Create Service | 3-step wizard (endpoint, settings, confirm) |
| `/services/:id` | Service Detail | Metrics, response time chart, health check log, incidents |
| `/services/:id/edit` | Edit Service | Reuses create form components with prefilled data |

## Theme

Dark theme defined via Tailwind CSS v4's `@theme` directive in `src/index.css`:

- **Backgrounds**: `bg-primary` (#0d0d0d), `bg-secondary` (#1a1a1a), `bg-tertiary` (#242424)
- **Accent**: `primary` (#00ff88) -- neon green used for interactive elements
- **Status**: `status-success` (#00ff88), `status-warning` (#ffaa00), `status-error` (#ff3333), `status-info` (#00aaff)
- **Font**: Quicksand (sans-serif)
