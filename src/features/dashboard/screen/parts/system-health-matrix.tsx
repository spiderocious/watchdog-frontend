import { Show } from 'meemaw'
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
          <div className="flex h-40 items-center justify-center">
            <span className="text-xs uppercase tracking-wider text-text-muted">
              No services configured
            </span>
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
