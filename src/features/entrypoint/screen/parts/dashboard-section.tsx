import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import {
  Activity,
  AlertTriangle,
  RefreshCw,
  Moon,
  Code,
  Shield,
  Zap,
  Server,
} from '@icons/index.ts'

function ServiceHealthMatrix() {
  const cells = Array.from({ length: 12 }, (_, i) => {
    if (i === 5) return 'bg-status-error/70'
    if (i < 9) return 'bg-status-success/60'
    return 'bg-status-success/30'
  })

  return (
    <div className="rounded-lg border border-primary/15 bg-bg-primary/80 p-3">
      <div className="mb-2 flex items-center gap-1.5">
        <div className="grid h-3 w-3 grid-cols-2 gap-px">
          <div className="rounded-[1px] bg-primary" />
          <div className="rounded-[1px] bg-primary" />
          <div className="rounded-[1px] bg-primary" />
          <div className="rounded-[1px] bg-primary" />
        </div>
        <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary">
          Service Health
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {cells.map((color, i) => (
          <div key={i} className={`h-4 w-full rounded-sm ${color}`} />
        ))}
      </div>
    </div>
  )
}

function ResponseTimeChart() {
  const bars = [45, 30, 55, 25, 65, 40, 70]

  return (
    <div className="rounded-lg border border-primary/15 bg-bg-primary/80 p-3">
      <p className="text-[8px] font-bold uppercase tracking-widest text-text-secondary">
        Response Times (Last Hour)
      </p>
      <div className="mt-1 flex items-baseline gap-3">
        <span className="text-2xl font-black text-text-white">142</span>
        <span className="text-[9px] font-bold text-text-secondary">ms avg</span>
      </div>
      <div className="mt-3 flex items-end gap-1.5">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-primary"
            style={{ height: h, opacity: 0.3 + (i / bars.length) * 0.7 }}
          />
        ))}
      </div>
    </div>
  )
}

function RecentErrors() {
  return (
    <div className="rounded-lg border border-primary/15 bg-bg-primary/80 p-3">
      <div className="mb-2 flex items-center gap-1.5">
        <AlertTriangle className="h-3 w-3 text-status-error" />
        <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary">
          Recent Errors
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="rounded border-l-2 border-status-error bg-status-error/10 px-2 py-1.5">
          <p className="text-[8px] font-bold uppercase text-status-error">Payment Service</p>
          <p className="text-[8px] text-text-secondary">503 Service Unavailable</p>
        </div>
        <div className="rounded border-l-2 border-status-warning bg-status-warning/10 px-2 py-1.5">
          <p className="text-[8px] font-bold uppercase text-status-warning">Staging API</p>
          <p className="text-[8px] text-text-secondary">
            Timeout after 5000ms
          </p>
        </div>
      </div>
    </div>
  )
}

function ServicesList() {
  const services = [
    { name: 'Production API', status: 'ACTIVE', color: 'text-status-success' },
    { name: 'Staging API', status: 'ACTIVE', color: 'text-status-success' },
    { name: 'Payment Service', status: 'DOWN', color: 'text-status-error' },
  ]

  return (
    <div className="rounded-lg border border-primary/15 bg-bg-primary/80 p-3">
      <div className="mb-2 flex items-center gap-1.5">
        <Server className="h-3 w-3 text-text-secondary" />
        <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary">
          Monitored Services
        </span>
      </div>
      <div className="space-y-1.5">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between">
            <span className="text-[9px] text-text-secondary">{service.name}</span>
            <span className={`text-[8px] font-bold uppercase ${service.color}`}>
              {service.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HealthCheckLog() {
  const logs = [
    { time: '14:44:01', level: 'OK', color: 'text-status-success', msg: 'Production API responded 200 in 142ms' },
    { time: '14:43:31', level: 'OK', color: 'text-status-success', msg: 'Staging API responded 200 in 89ms' },
    { time: '14:43:01', level: 'ERROR', color: 'text-status-error', msg: 'Payment Service returned 503' },
    { time: '14:42:31', level: 'OK', color: 'text-status-success', msg: 'Production API responded 200 in 145ms' },
  ]

  return (
    <div className="rounded-lg border border-primary/15 bg-bg-primary/80 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary">
          Health Check Log
        </span>
        <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[7px] font-bold uppercase text-primary">
          Live
        </span>
      </div>
      <div className="mt-2 space-y-1 font-mono">
        {logs.map((log, i) => (
          <p key={i} className="text-[8px]">
            <span className="text-text-tertiary">[{log.time}] </span>
            <span className={`font-bold ${log.color}`}>{log.level}:</span>{' '}
            <span className="text-text-secondary">{log.msg}</span>
          </p>
        ))}
      </div>
    </div>
  )
}

function DashboardMockup() {
  return (
    <div className="rounded-xl border border-primary/20 bg-bg-secondary p-3 shadow-2xl shadow-primary/5 md:p-4">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-border-primary/15 pb-2">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex gap-1 md:gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-500 md:h-2.5 md:w-2.5" />
            <div className="h-2 w-2 rounded-full bg-yellow-500 md:h-2.5 md:w-2.5" />
            <div className="h-2 w-2 rounded-full bg-green-500 md:h-2.5 md:w-2.5" />
          </div>
          <span className="text-[7px] font-medium tracking-wider text-text-tertiary md:text-[8px]">
            MONITOR CENTRAL // DASHBOARD
          </span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="hidden h-1.5 w-12 overflow-hidden rounded-full bg-bg-tertiary sm:block md:w-20">
            <div className="h-full w-2/3 rounded-full bg-status-success" />
          </div>
          <span className="text-[7px] font-bold text-status-success md:text-[8px]">99.2%</span>
        </div>
      </div>
      {/* Grid layout - responsive */}
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:mt-3 lg:grid-cols-3">
        <ServiceHealthMatrix />
        <ResponseTimeChart />
        <RecentErrors />
        <ServicesList />
        <div className="sm:col-span-2">
          <HealthCheckLog />
        </div>
      </div>
    </div>
  )
}

const FEATURE_ICONS = [
  { icon: RefreshCw, label: 'Auto-Refresh' },
  { icon: Moon, label: 'Dark UI' },
  { icon: Code, label: 'REST API' },
  { icon: Shield, label: 'E2E Encrypted' },
]

const STATS_BAR = [
  { value: '30s', label: 'Min Check Interval' },
  { value: '100%', label: 'Customizable' },
  { value: 'REST', label: 'API Access' },
]

type DashboardSectionProps = {
  isActive: boolean
}

export function DashboardSection({ isActive }: DashboardSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isActive || !sectionRef.current || hasAnimated.current) return
    hasAnimated.current = true

    const el = sectionRef.current
    const tl = gsap.timeline()

    tl.from(el.querySelector('.ds-tag'), {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
    })
      .from(
        el.querySelector('.ds-title'),
        { opacity: 0, y: 30, duration: 0.7, ease: 'power2.out' },
        '-=0.3'
      )
      .from(
        el.querySelector('.ds-subtitle'),
        { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      )
      .from(
        el.querySelector('.ds-mockup'),
        {
          opacity: 0,
          y: 60,
          scale: 0.92,
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.3'
      )

    // Floating badges
    gsap.from(el.querySelectorAll('.ds-badge'), {
      opacity: 0,
      x: -30,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      delay: 1,
    })

    // Feature icons
    gsap.from(el.querySelectorAll('.ds-feature-icon'), {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 1.2,
    })

    // Stats bar
    gsap.from(el.querySelectorAll('.ds-stat'), {
      opacity: 0,
      y: 30,
      duration: 0.5,
      stagger: 0.12,
      ease: 'power2.out',
      delay: 1.5,
    })
  }, [isActive])

  return (
    <section
      ref={sectionRef}
      className="flex min-h-screen md:h-screen w-screen flex-shrink-0 flex-col items-center justify-center px-4 py-8 md:px-10 lg:px-16"
    >
      <div className="flex w-full max-w-6xl flex-col items-center">
        {/* Header */}
        <p className="ds-tag text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
          — Clean Dashboard —
        </p>
        <h2 className="ds-title mt-3 text-center text-2xl font-black uppercase tracking-tight text-text-white sm:text-3xl md:text-4xl lg:text-5xl">
          Monitor All Your
          <br />
          <span className="text-primary">Endpoints</span>
        </h2>
        <p className="ds-subtitle mt-2 max-w-xl px-4 text-center text-[11px] text-text-secondary sm:text-xs md:mt-3 md:text-sm">
          Simple dashboard showing service health, response times, and error logs.
          Everything you need to track uptime at a glance.
        </p>

        {/* Dashboard mockup with floating badges */}
        <div className="relative mt-6 w-full">
          {/* Floating badges - left side, hidden on mobile */}
          <div className="absolute -left-2 top-8 z-10 hidden flex-col gap-3 lg:flex">
            <div className="ds-badge rounded-lg border border-primary/20 bg-bg-secondary/90 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-white">
                  Service Overview
                </span>
              </div>
              <p className="mt-1 max-w-[140px] text-[8px] text-text-secondary">
                View all monitored endpoints and their current health status.
              </p>
            </div>
          </div>

          {/* Floating badges - right side, hidden on mobile */}
          <div className="absolute -right-2 top-1/2 z-10 hidden flex-col gap-3 lg:flex">
            <div className="ds-badge rounded-lg border border-primary/20 bg-bg-secondary/90 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-white">
                  Response Metrics
                </span>
              </div>
              <p className="mt-1 max-w-[140px] text-[8px] text-text-secondary">
                Track response times and identify performance issues.
              </p>
            </div>
          </div>

          {/* Floating deep telemetry badge - bottom left */}
          <div className="absolute -bottom-4 -left-2 z-10 hidden lg:block">
            <div className="ds-badge rounded-lg border border-primary/20 bg-bg-secondary/90 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-white">
                  Error Tracking
                </span>
              </div>
              <p className="mt-1 max-w-[140px] text-[8px] text-text-secondary">
                View recent errors with status codes and timestamps.
              </p>
            </div>
          </div>

          <div className="ds-mockup mx-auto max-w-4xl">
            <DashboardMockup />
          </div>
        </div>

        {/* Feature icons row */}
        <div className="mt-6 flex items-center gap-6 md:mt-8 md:gap-8 lg:gap-12">
          {FEATURE_ICONS.map((item) => (
            <div key={item.label} className="ds-feature-icon flex flex-col items-center gap-1">
              <item.icon className="h-4 w-4 text-text-tertiary md:h-5 md:w-5" />
              <span className="text-[7px] font-bold uppercase tracking-widest text-text-tertiary md:text-[8px]">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-4 flex w-full max-w-3xl divide-x divide-primary/20 overflow-hidden rounded-xl border border-primary/20 bg-bg-secondary md:mt-6">
          {STATS_BAR.map((stat) => (
            <div
              key={stat.label}
              className="ds-stat flex flex-1 flex-col items-center justify-center py-3 md:py-4"
            >
              <span className="text-xl font-black text-primary md:text-2xl lg:text-3xl">{stat.value}</span>
              <span className="mt-0.5 text-[7px] font-bold uppercase tracking-widest text-text-secondary md:text-[8px]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
