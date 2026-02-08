import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { Activity, Bell, Mail, AlertTriangle } from '@icons/index.ts'
import { ROUTES } from '@shared/constants/routes.ts'

const STEPS = [
  {
    number: '01',
    title: 'Add Your Endpoint',
    subtitle: 'Connect your API or URL in one click.',
  },
  {
    number: '02',
    title: 'We Monitor 24/7',
    subtitle: 'Global pings every 30 seconds from 12 regions.',
  },
  {
    number: '03',
    title: 'Get Alerted Instantly',
    subtitle: 'Low latency notifications via your favorite stack.',
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

function LivePulseCard() {
  const barData = [
    { label: 'US-EAST-1:', value: '24ms', heights: [55, 40] },
    { label: 'EU-WEST-2:', value: '89ms', heights: [65, 80] },
    { label: 'AP-SOUTH-1:', value: '142ms', heights: [50, 70] },
  ]

  return (
    <div className="rounded-lg border border-primary/20 bg-bg-secondary p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-white">
            Live Pulse
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          System OK
        </span>
      </div>
      {/* Bars */}
      <div className="mt-4 flex items-end justify-around gap-3">
        {barData.map((region) => (
          <div key={region.label} className="flex flex-col items-center gap-1">
            <div className="flex items-end gap-1">
              {region.heights.map((h, j) => (
                <div
                  key={j}
                  className="w-5 rounded-sm bg-primary"
                  style={{ height: h * 0.6, opacity: 0.4 + j * 0.3 }}
                />
              ))}
            </div>
            <span className="mt-1 text-[8px] font-medium tracking-wider text-text-tertiary">
              {region.label} {region.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AlertsCard() {
  const alerts = [
    {
      icon: Bell,
      color: 'bg-green-600',
      app: 'Slack',
      time: '3:14 PM',
      channel: '#ops-alerts',
      message: (
        <>
          <span className="font-bold text-status-success">INCIDENT RESOLVED</span> - Production API
        </>
      ),
    },
    {
      icon: Mail,
      color: 'bg-blue-600',
      app: 'Monitor_X Notification',
      time: '',
      channel: '',
      message: 'Subject: 99.9% Uptime achievement reached...',
    },
    {
      icon: AlertTriangle,
      color: 'bg-red-600',
      app: 'PagerDuty Alert',
      time: '',
      channel: '',
      message: 'Resolved: High Latency in region-us-west',
    },
  ]

  return (
    <div className="space-y-2.5">
      {alerts.map((alert, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-lg border border-border-primary/10 bg-bg-secondary p-3"
        >
          <div
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${alert.color}`}
          >
            <alert.icon className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-white">{alert.app}</span>
              {alert.time && (
                <span className="text-[10px] text-text-tertiary">{alert.time}</span>
              )}
            </div>
            {alert.channel && (
              <p className="text-[10px] text-text-tertiary">{alert.channel}</p>
            )}
            <p className="mt-0.5 text-[10px] leading-relaxed text-text-secondary">
              {alert.message}
            </p>
          </div>
        </div>
      ))}
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
        <div className="inline-block rounded border border-primary/30 bg-primary/10 px-4 py-1.5">
          <span className="hw-tag text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            Deployment Pipeline
          </span>
        </div>
        <h2 className="hw-title mt-4 text-center text-3xl font-black uppercase tracking-tight text-text-white md:text-5xl lg:text-6xl">
          Up And Running In{' '}
          <span className="text-primary">60 Seconds</span>
        </h2>
        <p className="mt-3 max-w-lg text-center text-xs text-text-secondary md:text-sm">
          The fastest way to achieve 99.99% uptime visibility for your critical backend infrastructure.
        </p>

        {/* Steps */}
        <div className="relative mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {/* Connecting line */}
          <div className="step-line absolute left-[16%] right-[16%] top-[32px] hidden h-0.5 origin-left bg-primary/40 md:block" />

          {STEPS.map((step) => (
            <div key={step.number} className="step-item flex flex-col items-start md:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-primary/30 bg-bg-secondary text-xl font-black text-primary">
                {step.number}
              </div>
              <h3 className="mt-3 text-sm font-bold uppercase tracking-wider text-text-white">
                {step.title}
              </h3>
              <p className="mt-1 text-xs text-text-secondary md:text-center">
                {step.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Illustration cards */}
        <div className="mt-8 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          <div className="card-item">
            <TerminalCard />
          </div>
          <div className="card-item">
            <LivePulseCard />
          </div>
          <div className="card-item">
            <AlertsCard />
          </div>
        </div>

        {/* CTA */}
        <div className="hw-cta mt-8 flex flex-col items-center gap-3">
          <Link
            to={ROUTES.AUTH.REGISTER}
            className="rounded-lg bg-primary px-10 py-3.5 text-[11px] font-bold uppercase tracking-widest text-bg-primary transition-all hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]"
          >
            Start Monitoring Free
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
            No Credit Card Required &bull; Unlimited Seats &bull; 14-Day History
          </p>
        </div>
      </div>
    </section>
  )
}
