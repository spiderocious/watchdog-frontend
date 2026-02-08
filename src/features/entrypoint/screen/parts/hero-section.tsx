import { Link } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes.ts'
import { Monitor, ArrowRight } from '@shared/icons/index.ts'

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 px-4 py-24 text-center">
      <div className="flex items-center gap-3">
        <Monitor className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold text-text-white">
          Monitor Central
        </h1>
      </div>

      <p className="max-w-lg text-lg text-text-secondary">
        Real-time uptime monitoring for your infrastructure.
        Never miss a downtime.
      </p>

      <div className="flex gap-4">
        <Link
          to={ROUTES.AUTH.LOGIN}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-text transition-colors hover:bg-primary-hover"
        >
          Go to Login
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link
          to={ROUTES.DASHBOARD}
          className="flex items-center gap-2 rounded-lg border border-border-light px-6 py-3 font-semibold text-text-primary transition-colors hover:border-status-info hover:bg-status-info/5"
        >
          Go to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
