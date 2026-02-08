import { Link } from 'react-router-dom'
import { Monitor } from '@icons/index.ts'
import { ROUTES } from '@shared/constants/routes.ts'

type LandingNavbarProps = {
  onNavigateSection?: (index: number) => void
}

export function LandingNavbar({ onNavigateSection }: LandingNavbarProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 md:px-10">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
          <Monitor className="h-5 w-5 text-primary" />
        </div>
        <span className="text-lg font-bold uppercase tracking-wider text-text-white">
          WatchDog
        </span>
      </Link>

      {/* Center nav - hidden on mobile */}
      <nav className="hidden items-center gap-8 md:flex">
        <button
          type="button"
          onClick={() => onNavigateSection?.(1)}
          className="text-[11px] font-bold uppercase tracking-widest text-text-secondary transition-colors hover:text-text-white"
        >
          Features
        </button>
        <button
          type="button"
          onClick={() => onNavigateSection?.(3)}
          className="text-[11px] font-bold uppercase tracking-widest text-text-secondary transition-colors hover:text-text-white"
        >
          Dashboard
        </button>
        <button
          type="button"
          onClick={() => onNavigateSection?.(5)}
          className="text-[11px] font-bold uppercase tracking-widest text-text-secondary transition-colors hover:text-text-white"
        >
          FAQ
        </button>
      </nav>

      {/* Auth buttons */}
      <div className="flex items-center gap-3">
        <Link
          to={ROUTES.AUTH.LOGIN}
          className="hidden text-sm font-semibold text-text-secondary transition-colors hover:text-text-white sm:block"
        >
          Sign In
        </Link>
        <Link
          to={ROUTES.AUTH.REGISTER}
          className="rounded-lg border border-primary bg-transparent px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-text"
        >
          Start Free
        </Link>
      </div>
    </header>
  )
}
