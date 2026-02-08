# WatchDog Frontend

Real-time uptime monitoring dashboard built with React 19 and a SCADA-inspired industrial dark theme. Connects to the WatchDog backend API for service health monitoring, alerting, and diagnostics.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2 |
| Language | TypeScript | 5.9 (strict mode) |
| Build | Vite | 7.x |
| Styling | Tailwind CSS | 4.x (via `@tailwindcss/vite`) |
| Routing | React Router | 7.x |
| Data Fetching | TanStack Query | 5.x |
| Icons | Lucide React | 0.563 |
| Utilities | Meemaw | 1.x (`<Show>` conditional rendering) |

## Architecture

The project follows **Feature-Sliced Design (FSD)** with strict module boundaries:

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

### Path Aliases

Configured in both `tsconfig.app.json` and `vite.config.ts`:

```
@app/*       -> src/*
@features/*  -> src/features/*
@shared/*    -> src/shared/*
@ui/*        -> src/ui/*
@icons/*     -> src/shared/icons/*
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

## Getting Started

### Prerequisites

- Node.js 20+
- WatchDog backend running at `http://localhost:3000` (configurable via `VITE_API_BASE_URL`)

### Install and Run

```bash
npm install
npm run dev
```

### Build

```bash
npm run build    # TypeScript check + Vite production build
npm run preview  # Preview production build locally
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3000` | Backend API base URL |

## Theme

SCADA-inspired dark theme defined via Tailwind CSS v4's `@theme` directive in `src/index.css`:

- **Backgrounds**: `bg-primary` (#0d0d0d), `bg-secondary` (#1a1a1a), `bg-tertiary` (#242424)
- **Accent**: `primary` (#00ff88) -- neon green used for interactive elements
- **Status**: `status-success` (#00ff88), `status-warning` (#ffaa00), `status-error` (#ff3333), `status-info` (#00aaff)
- **Font**: Quicksand (sans-serif)

## TypeScript Configuration

Strict mode enabled with additional safety:

- `verbatimModuleSyntax` -- enforces explicit `type` imports
- `noUnusedLocals` / `noUnusedParameters` -- zero dead code
- `noFallthroughCasesInSwitch` -- exhaustive switch handling
- `erasableSyntaxOnly` -- compatible with modern bundler stripping

## Backend API

The frontend connects to 15 REST endpoints. See `docs/api-doc.md` for full documentation including request/response schemas, error codes, and authentication flow.
