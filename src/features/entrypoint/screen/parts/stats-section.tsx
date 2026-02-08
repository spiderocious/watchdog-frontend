import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { Activity, Shield, Database, Zap, CheckCircle, Sparkles } from '@icons/index.ts'
import type { LucideIcon } from '@icons/index.ts'

type StatItem = {
  icon: LucideIcon
  value: string
  label: string
}

const STATS: StatItem[] = [
  { icon: Activity, value: '30s', label: 'Check Interval' },
  { icon: Zap, value: '142 ms', label: 'Avg Response' },
  { icon: CheckCircle, value: '99.2 %', label: 'Uptime Tracked' },
  { icon: Sparkles, value: 'HTTP', label: 'Protocol Support' },
]

const TICKER_ITEMS = [
  '// MONITOR CENTRAL v1.0',
  '// HTTP/HTTPS MONITORING',
  '// SIMPLE UPTIME TRACKING',
  '// RESPONSE TIME METRICS',
  '// HEALTH CHECK LOGS',
  '// REST API ACCESS',
  '// OPEN SOURCE',
  '// SELF HOSTED',
]

function LatencyPulseCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animFrame: number
    let offset = 0

    function draw() {
      if (!ctx || !canvas) return
      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)
      ctx.beginPath()
      ctx.strokeStyle = '#00ff88'
      ctx.lineWidth = 2

      for (let x = 0; x < w; x++) {
        const y =
          h / 2 +
          Math.sin((x + offset) * 0.03) * 18 +
          Math.sin((x + offset) * 0.07) * 8 +
          Math.sin((x + offset) * 0.01) * 12

        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Glow effect
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(0,255,136,0.15)'
      ctx.lineWidth = 6
      for (let x = 0; x < w; x++) {
        const y =
          h / 2 +
          Math.sin((x + offset) * 0.03) * 18 +
          Math.sin((x + offset) * 0.07) * 8 +
          Math.sin((x + offset) * 0.01) * 12

        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      offset += 1.5
      animFrame = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animFrame)
  }, [])

  return (
    <div className="flex flex-1 flex-col rounded-xl border border-primary/15 bg-bg-secondary p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-sm bg-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-white">
            Latency Pulse
          </span>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wider text-primary">
          Live_Feed_01
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={100}
        className="mt-3 h-20 w-full"
      />
    </div>
  )
}

function ConfigurationCard() {
  return (
    <div className="flex flex-1 flex-col rounded-xl border border-primary/15 bg-bg-secondary p-4">
      <Shield className="h-5 w-5 text-primary" />
      <span className="mt-3 text-[10px] font-bold uppercase tracking-widest text-text-white">
        Configurable
      </span>
      <span className="mt-1 text-lg font-black text-primary">100%</span>
    </div>
  )
}

function ServicesCard() {
  return (
    <div className="flex flex-1 flex-col rounded-xl border border-primary/15 bg-bg-secondary p-4">
      <Database className="h-5 w-5 text-status-info" />
      <span className="mt-3 text-[10px] font-bold uppercase tracking-widest text-text-white">
        Services
      </span>
      <span className="mt-1 text-lg font-black text-status-info">MONITORED</span>
    </div>
  )
}

type StatsSectionProps = {
  isActive: boolean
}

export function StatsSection({ isActive }: StatsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isActive || !sectionRef.current || hasAnimated.current) return
    hasAnimated.current = true

    const el = sectionRef.current
    const tl = gsap.timeline()

    // Header
    tl.from(el.querySelector('.st-badge'), {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out',
    })
      .from(
        el.querySelector('.st-title'),
        { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out' },
        '-=0.2'
      )
      .from(
        el.querySelector('.st-subtitle'),
        { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' },
        '-=0.2'
      )

    // Stat counters
    tl.from(
      el.querySelectorAll('.st-stat'),
      {
        opacity: 0,
        y: 50,
        scale: 0.9,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.4)',
      },
      '-=0.2'
    )

    // Ticker
    tl.from(
      el.querySelector('.st-ticker'),
      { opacity: 0, duration: 0.6 },
      '-=0.3'
    )

    // Bottom cards
    tl.from(
      el.querySelectorAll('.st-card'),
      {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
      },
      '-=0.3'
    )
  }, [isActive])

  const tickerText = TICKER_ITEMS.join('     ')

  return (
    <section
      ref={sectionRef}
      className="flex h-screen w-screen flex-shrink-0 flex-col items-center justify-center px-4 py-8 md:px-10 lg:px-16"
    >
      <div className="flex w-full max-w-6xl flex-col items-center">
        {/* Header */}
        <div className="st-badge inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 sm:px-4">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary sm:text-[10px] sm:tracking-[0.3em]">
            Key Capabilities
          </span>
        </div>
        <h2 className="st-title mt-3 text-center text-2xl font-black uppercase tracking-tight text-text-white sm:mt-4 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
          Built For <span className="text-primary">Simplicity</span>
        </h2>
        <p className="st-subtitle mt-2 max-w-lg px-4 text-center text-[9px] font-medium uppercase tracking-widest text-text-secondary sm:mt-3 sm:text-[10px]">
          Straightforward endpoint monitoring without unnecessary complexity.
        </p>

        {/* Big stats */}
        <div className="mt-8 grid w-full grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-4 md:gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="st-stat flex flex-col items-center justify-center py-4 sm:py-6"
            >
              <stat.icon className="h-7 w-7 text-primary sm:h-8 sm:w-8 md:h-10 md:w-10" />
              <span className="mt-2 text-2xl font-black text-primary sm:mt-3 sm:text-3xl md:text-4xl lg:text-5xl">
                {stat.value}
              </span>
              <span className="mt-1 text-[8px] font-bold uppercase tracking-widest text-text-secondary sm:text-[9px]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Scrolling ticker */}
        <div className="st-ticker mt-4 w-full overflow-hidden sm:mt-6">
          <div className="animate-scroll-x flex whitespace-nowrap">
            <span className="inline-block pr-6 font-mono text-[9px] tracking-wider text-primary/50 sm:pr-8 sm:text-[10px]">
              {tickerText}
            </span>
            <span className="inline-block pr-6 font-mono text-[9px] tracking-wider text-primary/50 sm:pr-8 sm:text-[10px]">
              {tickerText}
            </span>
          </div>
        </div>

        {/* Bottom cards */}
        <div className="mt-4 flex w-full flex-col gap-3 sm:mt-6 sm:gap-4 md:flex-row">
          <div className="st-card flex-[2]">
            <LatencyPulseCard />
          </div>
          <div className="st-card flex-1">
            <ConfigurationCard />
          </div>
          <div className="st-card flex-1">
            <ServicesCard />
          </div>
        </div>
      </div>
    </section>
  )
}
