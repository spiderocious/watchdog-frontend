import { ChevronLeft, ChevronRight } from '@icons/index.ts'

type ServicesPaginationProps = {
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = [1]

  if (current > 3) pages.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) pages.push('...')

  pages.push(total)

  return pages
}

export function ServicesPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: ServicesPaginationProps) {
  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)
  const pages = getPageNumbers(page, totalPages)

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
        Showing {from} to {to} of {total} services
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded border border-border-light text-text-tertiary transition-colors hover:border-border-hover hover:text-text-secondary disabled:opacity-30 disabled:hover:border-border-light disabled:hover:text-text-tertiary"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-8 w-8 items-center justify-center text-[10px] text-text-secondary"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`flex h-8 w-8 items-center justify-center rounded text-[11px] font-bold transition-colors ${
                p === page
                  ? 'border border-primary bg-primary/10 text-primary'
                  : 'border border-border-light text-text-tertiary hover:border-border-hover hover:text-text-secondary'
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded border border-border-light text-text-tertiary transition-colors hover:border-border-hover hover:text-text-secondary disabled:opacity-30 disabled:hover:border-border-light disabled:hover:text-text-tertiary"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
