import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { Activity, Bell } from '@icons/index.ts'
import { ROUTES } from '@shared/constants/routes.ts'

const STEPS = [
  {
    number: '01',
    title: 'Add Your Endpoint',
    subtitle: 'Enter your URL, configure method and check interval.',
  },
  {
    number: '02',
    title: 'We Check Continuously',
    subtitle: 'Automated health checks at your chosen interval.',
  },
  {
    number: '03',
    title: 'View Status Dashboard',
    subtitle: 'Monitor uptime, response times, and error logs.',
  },
]

function TerminalCard() {
  return (
    <div className="rounded-lg border border-primary/20 bg-bg-secondary p-4">
      {/* Title bar */}
      <div className="flex items-center gap-4 border-b border-border-primary/20 pb-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
        </div>
        <span className="text-[10px] font-medium tracking-wider text-text-tertiary">
          bash — terminal
        </span>
      </div>
      {/* Content */}
      <div className="mt-3 space-y-2 font-mono text-xs">
        <p className="text-text-secondary">
          <span className="text-text-tertiary">$ </span>
          <span className="text-text-white">monitor init</span>
        </p>
        <p className="text-text-tertiary">? Enter Endpoint URL:</p>
        <p>
          <span className="inline-block rounded bg-primary/20 px-1.5 py-0.5 text-primary">
            https://api.v1.production.io/health
          </span>
          <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-primary" />
        </p>
        <p className="text-text-tertiary italic">// validating handshake...</p>
      </div>
    </div>
  )
}

function ServiceStatusCard() {
  const services = [
    { name: 'Production API', status: 'active', uptime: '99.8%' },
    { name: 'Staging API', status: 'active', uptime: '99.2%' },
    { name: 'Payment Service', status: 'down', uptime: '94.1%' },
  ]

  return (
    <div className="rounded-lg border border-primary/20 bg-bg-secondary p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-white">
            Service Status
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          3 Services
        </span>
      </div>
      {/* Services */}
      <div className="mt-4 space-y-2">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${service.status === 'active' ? 'bg-status-success' : 'bg-status-error'}`} />
              <span className="text-[9px] text-text-white">{service.name}</span>
            </div>
            <span className="text-[8px] font-medium tracking-wider text-text-tertiary">
              {service.uptime}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HealthCheckCard() {
  const logs = [
    { time: '14:32:01', status: 200, response: '142ms', success: true },
    { time: '14:31:31', status: 200, response: '138ms', success: true },
    { time: '14:31:01', status: 503, response: '—', success: false },
    { time: '14:30:31', status: 200, response: '145ms', success: true },
  ]

  return (
    <div className="rounded-lg border border-primary/20 bg-bg-secondary p-4">
      <div className="flex items-center gap-2">
        <Bell className="h-3.5 w-3.5 text-primary" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-white">
          Health Check Log
        </span>
      </div>
      <div className="mt-3 space-y-1.5 font-mono text-[9px]">
        {logs.map((log, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-text-tertiary">{log.time}</span>
            <span className={log.success ? 'text-status-success' : 'text-status-error'}>
              [{log.status}]
            </span>
            <span className="text-text-secondary">{log.response}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

type HowItWorksSectionProps = {
  isActive: boolean
}

export function HowItWorksSection({ isActive }: HowItWorksSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isActive || !sectionRef.current || hasAnimated.current) return
    hasAnimated.current = true

    const tl = gsap.timeline()

    tl.from(sectionRef.current.querySelector('.hw-tag'), {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
    })
      .from(
        sectionRef.current.querySelector('.hw-title'),
        { opacity: 0, y: 30, duration: 0.7, ease: 'power2.out' },
        '-=0.3'
      )
      .from(
        sectionRef.current.querySelectorAll('.step-item'),
        {
          opacity: 0,
          y: 40,
          duration: 0.5,
          stagger: 0.15,
          ease: 'power2.out',
        },
        '-=0.2'
      )
      .from(
        sectionRef.current.querySelector('.step-line'),
        { scaleX: 0, duration: 0.8, ease: 'power2.inOut' },
        '-=0.6'
      )
      .from(
        sectionRef.current.querySelectorAll('.card-item'),
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
        },
        '-=0.4'
      )
      .from(
        sectionRef.current.querySelector('.hw-cta'),
        { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out' },
        '-=0.2'
      )
  }, [isActive])

  return (
    <section
      ref={sectionRef}
      className="flex h-screen w-screen flex-shrink-0 flex-col items-center justify-center px-4 py-12 md:px-10 lg:px-16"
    >
      <div className="flex w-full max-w-6xl flex-col items-center">
        {/* Header */}
        <div className="inline-block rounded border border-primary/30 bg-primary/10 px-3 py-1.5 sm:px-4">
          <span className="hw-tag text-[9px] font-bold uppercase tracking-[0.2em] text-primary sm:text-[10px] sm:tracking-[0.3em]">
            How It Works
          </span>
        </div>
        <h2 className="hw-title mt-3 text-center text-2xl font-black uppercase tracking-tight text-text-white sm:mt-4 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
          Start Monitoring In{' '}
          <span className="text-primary">3 Simple Steps</span>
        </h2>
        <p className="mt-2 max-w-lg px-4 text-center text-[11px] text-text-secondary sm:mt-3 sm:text-xs md:text-sm">
          Add endpoints, track uptime, and view metrics in a clean dashboard.
        </p>

        {/* Steps */}
        <div className="relative mt-8 grid w-full grid-cols-1 gap-5 sm:mt-10 sm:gap-6 md:grid-cols-3 md:gap-8">
          {/* Connecting line - hidden on mobile */}
          <div className="step-line absolute left-[16%] right-[16%] top-[32px] hidden h-0.5 origin-left bg-primary/40 md:block" />

          {STEPS.map((step) => (
            <div key={step.number} className="step-item flex flex-col items-start md:items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-primary/30 bg-bg-secondary text-lg font-black text-primary sm:h-16 sm:w-16 sm:text-xl">
                {step.number}
              </div>
              <h3 className="mt-2.5 text-[13px] font-bold uppercase tracking-wider text-text-white sm:mt-3 sm:text-sm">
                {step.title}
              </h3>
              <p className="mt-1 text-[11px] text-text-secondary sm:text-xs md:text-center">
                {step.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Illustration cards */}
        <div className="mt-6 grid w-full grid-cols-1 gap-3 sm:mt-8 sm:gap-4 md:grid-cols-3">
          <div className="card-item">
            <TerminalCard />
          </div>
          <div className="card-item">
            <ServiceStatusCard />
          </div>
          <div className="card-item">
            <HealthCheckCard />
          </div>
        </div>

        {/* CTA */}
        <div className="hw-cta mt-6 flex flex-col items-center gap-2.5 sm:mt-8 sm:gap-3">
          <Link
            to={ROUTES.AUTH.REGISTER}
            className="min-h-11 rounded-lg bg-primary px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest text-bg-primary transition-all hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] sm:px-10"
          >
            Start Monitoring Free
          </Link>
          <p className="px-4 text-center text-[9px] font-bold uppercase tracking-widest text-text-tertiary sm:text-[10px]">
            No Credit Card Required &bull; Free to Use &bull; Open Source
          </p>
        </div>
      </div>
    </section>
  )
}
