import { useState, useMemo } from 'react'
import { Show } from 'meemaw'
import { Loader2, Network, Plus } from '@icons/index.ts'
import { useServicesList } from '../api/use-services-list.ts'
import {
  useDeleteService,
  usePauseService,
  useResumeService,
} from '../api/use-service-mutations.ts'
import type { ServiceStatus } from '../types/index.ts'
import { ServicesHeader } from './parts/services-header.tsx'
import { ServicesStats } from './parts/services-stats.tsx'
import { ServicesTable } from './parts/services-table.tsx'
import { ServicesPagination } from './parts/services-pagination.tsx'

const PAGE_LIMIT = 5

export function ServicesScreen() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | ''>('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const params = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,
      search: debouncedSearch || undefined,
      status: statusFilter || undefined,
    }),
    [page, debouncedSearch, statusFilter],
  )

  const { data, isLoading, isError } = useServicesList(params)

  const deleteMutation = useDeleteService()
  const pauseMutation = usePauseService()
  const resumeMutation = useResumeService()

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
    // Simple debounce via timeout
    clearTimeout((handleSearchChange as { timer?: ReturnType<typeof setTimeout> }).timer)
    ;(handleSearchChange as { timer?: ReturnType<typeof setTimeout> }).timer = setTimeout(() => {
      setDebouncedSearch(value)
    }, 300)
  }

  function handleStatusFilterChange(value: ServiceStatus | '') {
    setStatusFilter(value)
    setPage(1)
  }

  function handleAddService() {
    // TODO: Open add service modal/drawer
  }

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
      <ServicesHeader
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        onAddService={handleAddService}
      />

      {/* Loading */}
      <Show when={isLoading}>
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </Show>

      {/* Error */}
      <Show when={isError && !isLoading}>
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <Network className="h-8 w-8 text-status-error/60" />
          <span className="text-xs uppercase tracking-wider text-status-error">
            Failed to load services
          </span>
        </div>
      </Show>

      {/* Data */}
      <Show when={!!data && !isLoading}>
        {(() => {
          if (!data) return null

          // Empty state: no services at all
          if (data.total === 0 && !debouncedSearch && !statusFilter) {
            return (
              <div className="flex flex-1 flex-col items-center justify-center gap-4">
                <Network className="h-12 w-12 text-text-muted/40" />
                <span className="text-sm uppercase tracking-wider text-text-white">
                  No services configured
                </span>
                <span className="max-w-[300px] text-center text-[11px] leading-relaxed tracking-wider text-text-muted">
                  Add your first service to start monitoring endpoints, APIs, and infrastructure
                </span>
                <button
                  type="button"
                  onClick={handleAddService}
                  className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-primary-text transition-colors hover:bg-primary-hover"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Your First Service
                </button>
              </div>
            )
          }

          // Empty state: filters returned nothing
          if (data.items.length === 0) {
            return (
              <>
                <ServicesStats overview={data.overview} items={[]} />
                <div className="flex h-60 flex-col items-center justify-center gap-3 rounded-lg border border-border-light bg-bg-secondary">
                  <Network className="h-8 w-8 text-text-muted/40" />
                  <span className="text-xs uppercase tracking-wider text-text-muted">
                    No services match your filters
                  </span>
                </div>
              </>
            )
          }

          return (
            <>
              <ServicesStats overview={data.overview} items={data.items} />
              <ServicesTable
                items={data.items}
                onPause={(id) => pauseMutation.mutate(id)}
                onResume={(id) => resumeMutation.mutate(id)}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
              <Show when={data.total_pages > 1}>
                <ServicesPagination
                  page={data.page}
                  totalPages={data.total_pages}
                  total={data.total}
                  limit={data.limit}
                  onPageChange={setPage}
                />
              </Show>
            </>
          )
        })()}
      </Show>
    </div>
  )
}
