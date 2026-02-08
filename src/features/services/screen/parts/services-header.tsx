import { useState } from 'react'
import { Show } from 'meemaw'
import { Search, Filter, Plus } from '@icons/index.ts'
import type { ServiceStatus } from '../../types/index.ts'

type ServicesHeaderProps = {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: ServiceStatus | ''
  onStatusFilterChange: (value: ServiceStatus | '') => void
  onAddService: () => void
}

const STATUS_OPTIONS: { value: ServiceStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'down', label: 'Down' },
  { value: 'warning', label: 'Warning' },
  { value: 'paused', label: 'Paused' },
]

export function ServicesHeader({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAddService,
}: ServicesHeaderProps) {
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Title */}
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wider text-text-white">
          Services Overview
        </h1>
        <p className="text-[11px] uppercase tracking-wider text-text-secondary">
          Real-time Backend Control Panel
        </p>
      </div>

      {/* Right: Search + Filter + Add */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search services"
            className="h-9 w-48 rounded-md border border-border-light bg-bg-primary py-2 pl-9 pr-3 font-mono text-[11px] tracking-wider text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-primary/40 lg:w-64"
          />
        </div>

        {/* Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            className={`flex h-9 items-center gap-1.5 rounded-md border px-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              statusFilter
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-border-light text-text-tertiary hover:border-border-hover hover:text-text-secondary'
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {statusFilter ? STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label : 'Filter'}
            </span>
          </button>

          <Show when={filterOpen}>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setFilterOpen(false)}
            />
            <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded border border-border-light bg-bg-secondary py-1 shadow-lg">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onStatusFilterChange(option.value)
                    setFilterOpen(false)
                  }}
                  className={`flex w-full px-3 py-1.5 text-[10px] uppercase tracking-wider transition-colors hover:bg-bg-tertiary ${
                    statusFilter === option.value
                      ? 'text-primary'
                      : 'text-text-secondary'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </Show>
        </div>

        {/* Add Service */}
        <button
          type="button"
          onClick={onAddService}
          className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[10px] font-bold uppercase tracking-wider text-primary-text transition-colors hover:bg-primary-hover"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Service
        </button>
      </div>
    </div>
  )
}
