export function RegistrationFooter() {
  return (
    <footer className="w-full border-t border-border-light bg-bg-pure-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-3 sm:flex-row">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-[10px] uppercase tracking-wider text-text-tertiary">
            &copy; 2026 WatchDog
          </span>
          <span className="text-[10px] uppercase tracking-wider text-text-tertiary">
            Encrypted Connection [AES-256]
          </span>
          <span className="text-[10px] uppercase tracking-wider text-text-tertiary">
            SERVER_LOC: US-EAST-1
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-[10px] uppercase tracking-wider text-text-tertiary">
            System Status:{' '}
            <span className="text-primary">Optimal</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
