import { Show } from 'meemaw'
import { Link } from 'react-router-dom'
import { Network, Plus } from '@icons/index.ts'
import { ROUTES } from '@shared/constants/routes.ts'
import type { ServiceOverview } from '../../types/index.ts'
import { ServiceHealthCard } from './service-health-card.tsx'

type SystemHealthMatrixProps = {
  services: ServiceOverview[]
}

export function SystemHealthMatrix({ services }: SystemHealthMatrixProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-border-light bg-bg-secondary p-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
        System Health Matrix
      </h2>

      <Show
        when={services.length > 0}
        fallback={
          <div className="flex h-40 flex-col items-center justify-center gap-3">
            <Network className="h-8 w-8 text-text-muted/40" />
            <span className="text-xs uppercase tracking-wider text-text-muted">
              No services monitored yet
            </span>
            <Link
              to={ROUTES.SERVICES.ROOT}
              className="flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary/20"
            >
              <Plus className="h-3 w-3" />
              Add Service
            </Link>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceHealthCard key={service.id} service={service} />
          ))}
        </div>
      </Show>
    </section>
  )
}
