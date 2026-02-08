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

function SystemHealthGrid() {
  const cells = Array.from({ length: 18 }, (_, i) => {
    if (i === 5) return 'bg-yellow-500/70'
    if (i < 12) return 'bg-primary/60'
    return 'bg-primary/30'
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
          System Health
        </span>
      </div>
      <div className="grid grid-cols-6 gap-1">
        {cells.map((color, i) => (
          <div key={i} className={`h-4 w-full rounded-sm ${color}`} />
        ))}
      </div>
    </div>
  )
}

function IngestionChart() {
  const bars = [45, 30, 55, 25, 65, 40, 70]

  return (
    <div className="rounded-lg border border-primary/15 bg-bg-primary/80 p-3">
      <p className="text-[8px] font-bold uppercase tracking-widest text-text-secondary">
        Real-Time Ingestion (req/s)
      </p>
      <div className="mt-1 flex items-baseline gap-3">
        <span className="text-2xl font-black text-text-white">14,284</span>
        <span className="text-[9px] font-bold text-primary">+12.4% from prev hour</span>
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

function CriticalAlerts() {
  return (
    <div className="rounded-lg border border-primary/15 bg-bg-primary/80 p-3">
      <div className="mb-2 flex items-center gap-1.5">
        <AlertTriangle className="h-3 w-3 text-status-warning" />
        <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary">
          Critical Alerts
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="rounded border-l-2 border-status-error bg-status-error/10 px-2 py-1.5">
          <p className="text-[8px] font-bold uppercase text-status-error">Database Pressure</p>
          <p className="text-[8px] text-text-secondary">Connection pool at 98% capacity.</p>
        </div>
        <div className="rounded border-l-2 border-status-warning bg-status-warning/10 px-2 py-1.5">
          <p className="text-[8px] font-bold uppercase text-status-warning">Network Drift</p>
          <p className="text-[8px] text-text-secondary">
            Sync delay exceeds 500ms between regions.
          </p>
        </div>
      </div>
    </div>
  )
}

function ActiveNodes() {
  const nodes = [
    { name: 'node-east-01', status: 'ONLINE', color: 'text-primary' },
    { name: 'node-east-02', status: 'ONLINE', color: 'text-primary' },
    { name: 'node-west-01', status: 'WARNING', color: 'text-status-warning' },
  ]

  return (
    <div className="rounded-lg border border-primary/15 bg-bg-primary/80 p-3">
      <div className="mb-2 flex items-center gap-1.5">
        <Server className="h-3 w-3 text-text-secondary" />
        <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary">
          Active Nodes
        </span>
      </div>
      <div className="space-y-1.5">
        {nodes.map((node) => (
          <div key={node.name} className="flex items-center justify-between">
            <span className="text-[9px] text-text-secondary">{node.name}</span>
            <span className={`text-[8px] font-bold uppercase ${node.color}`}>
              {node.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DiagnosticsLog() {
  const logs = [
    { time: '20:44:01', level: 'INFO', color: 'text-status-info', msg: 'Cluster synchronization started.' },
    { time: '20:44:05', level: 'WARN', color: 'text-status-warning', msg: 'Latency spike detected in US-WEST-2.' },
    { time: '20:44:08', level: 'EXEC', color: 'text-primary', msg: 'Automated remediation script 0x4F triggered.' },
    { time: '20:44:12', level: 'OK', color: 'text-primary', msg: 'System stabilized. Latency at 14ms.' },
  ]

  return (
    <div className="rounded-lg border border-primary/15 bg-bg-primary/80 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary">
          Diagnostics Log
        </span>
        <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[7px] font-bold uppercase text-primary">
          Auto_Refresh: ON
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
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
          </div>
          <span className="text-[8px] font-medium tracking-wider text-text-tertiary">
            SCADA_V2.4.0 // LIVE_TELEMETRY
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-bg-tertiary">
            <div className="h-full w-4/5 rounded-full bg-primary" />
          </div>
          <span className="text-[8px] font-bold text-primary">Sync: 99.0%</span>
        </div>
      </div>
      {/* Grid layout */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <SystemHealthGrid />
        <IngestionChart />
        <CriticalAlerts />
        <ActiveNodes />
        <div className="col-span-2">
          <DiagnosticsLog />
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
  { value: '15+', label: 'Monitoring Regions' },
  { value: '30s', label: 'Check Intervals' },
  { value: '<5s', label: 'Alert Delivery' },
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
      className="flex h-screen w-screen flex-shrink-0 flex-col items-center justify-center px-4 py-8 md:px-10 lg:px-16"
    >
      <div className="flex w-full max-w-6xl flex-col items-center">
        {/* Header */}
        <p className="ds-tag text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
          — Your Command Center —
        </p>
        <h2 className="ds-title mt-3 text-center text-3xl font-black uppercase tracking-tight text-text-white md:text-5xl">
          Mission Control For Your
          <br />
          <span className="text-primary">Infrastructure</span>
        </h2>
        <p className="ds-subtitle mt-3 max-w-xl text-center text-xs text-text-secondary md:text-sm">
          Real-time telemetry, automated diagnostics, and industrial-grade monitoring for
          mission-critical backend systems.
        </p>

        {/* Dashboard mockup with floating badges */}
        <div className="relative mt-6 w-full">
          {/* Floating badges - left side, hidden on mobile */}
          <div className="absolute -left-2 top-8 z-10 hidden flex-col gap-3 lg:flex">
            <div className="ds-badge rounded-lg border border-primary/20 bg-bg-secondary/90 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-white">
                  At-a-Glance Status
                </span>
              </div>
              <p className="mt-1 max-w-[140px] text-[8px] text-text-secondary">
                Status matrix for health assessment across entire fleets.
              </p>
            </div>
          </div>

          {/* Floating badges - right side, hidden on mobile */}
          <div className="absolute -right-2 top-1/2 z-10 hidden flex-col gap-3 lg:flex">
            <div className="ds-badge rounded-lg border border-primary/20 bg-bg-secondary/90 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-white">
                  Low-Latency Alerts
                </span>
              </div>
              <p className="mt-1 max-w-[140px] text-[8px] text-text-secondary">
                Push-based notification engine delivering under 5 seconds.
              </p>
            </div>
          </div>

          {/* Floating deep telemetry badge - bottom left */}
          <div className="absolute -bottom-4 -left-2 z-10 hidden lg:block">
            <div className="ds-badge rounded-lg border border-primary/20 bg-bg-secondary/90 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-white">
                  Deep Telemetry
                </span>
              </div>
              <p className="mt-1 max-w-[140px] text-[8px] text-text-secondary">
                High-frequency sampling and deep-packet diagnostics out of the box.
              </p>
            </div>
          </div>

          <div className="ds-mockup mx-auto max-w-4xl">
            <DashboardMockup />
          </div>
        </div>

        {/* Feature icons row */}
        <div className="mt-8 flex items-center gap-8 md:gap-12">
          {FEATURE_ICONS.map((item) => (
            <div key={item.label} className="ds-feature-icon flex flex-col items-center gap-1.5">
              <item.icon className="h-5 w-5 text-text-tertiary" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-text-tertiary">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-6 flex w-full max-w-3xl divide-x divide-primary/20 overflow-hidden rounded-xl border border-primary/20 bg-bg-secondary">
          {STATS_BAR.map((stat) => (
            <div
              key={stat.label}
              className="ds-stat flex flex-1 flex-col items-center justify-center py-4"
            >
              <span className="text-2xl font-black text-primary md:text-3xl">{stat.value}</span>
              <span className="mt-0.5 text-[8px] font-bold uppercase tracking-widest text-text-secondary">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
