import { Show } from 'meemaw'
import { AlertTriangle, X } from '@icons/index.ts'

type ConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  confirmColor?: 'error' | 'primary'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  confirmColor = 'error',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const btnClass = confirmColor === 'error'
    ? 'bg-status-error text-white hover:bg-status-error/80'
    : 'bg-primary text-primary-text hover:bg-primary-hover'

  return (
    <Show when={open}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60" onClick={onCancel} />

        <div className="relative z-10 w-full max-w-sm rounded-lg border border-border-light bg-bg-secondary p-6 shadow-xl">
          <button
            type="button"
            onClick={onCancel}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-error/10">
              <AlertTriangle className="h-6 w-6 text-status-error" />
            </div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-text-white">
              {title}
            </h3>

            <p className="text-[11px] leading-relaxed tracking-wider text-text-secondary">
              {message}
            </p>

            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-md border border-border-light px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-text-secondary transition-colors hover:border-border-hover hover:text-text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`flex-1 rounded-md px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${btnClass}`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Show>
  )
}
