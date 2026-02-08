import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { Activity, BellRing, Sliders, Clock, Code } from '@icons/index.ts'
import { ROUTES } from '@shared/constants/routes.ts'
import type { LucideIcon } from '@icons/index.ts'

type FeatureCard = {
  icon: LucideIcon
  title: string
  description: string
  illustration: 'heartbeat' | 'bars' | 'dots' | 'sliders' | 'timeline' | 'code'
}

const FEATURES: FeatureCard[] = [
  {
    icon: Activity,
    title: 'Endpoint Monitoring',
    description:
      'Monitor any HTTP/HTTPS endpoint with configurable check intervals. Track status codes and response times in real-time.',
    illustration: 'heartbeat',
  },
  {
    icon: Clock,
    title: 'Health Check Logs',
    description:
      'Complete history of every health check with timestamps, status codes, and response times for troubleshooting.',
    illustration: 'timeline',
  },
  {
    icon: Activity,
    title: 'Uptime Tracking',
    description:
      'Track uptime percentage over time with detailed metrics showing success rates and failure counts.',
    illustration: 'bars',
  },
  {
    icon: Sliders,
    title: 'Custom Configuration',
    description:
      'Configure HTTP methods, headers, request bodies, expected status codes, and failure thresholds per service.',
    illustration: 'sliders',
  },
  {
    icon: BellRing,
    title: 'Service Diagnostics',
    description:
      'View recent check logs and error history in a clean dashboard. Quickly identify when and why services went down.',
    illustration: 'dots',
  },
  {
    icon: Code,
    title: 'REST API',
    description:
      'Full REST API for programmatic access to create, update, pause, resume, and delete monitored services.',
    illustration: 'code',
  },
]

function HeartbeatSvg() {
  return (
    <svg viewBox="0 0 280 60" className="h-12 w-full" fill="none">
      <path
        d="M0 30 Q20 30 40 30 T60 30 L70 30 L80 10 L90 50 L100 10 L110 50 L120 30 Q140 30 160 30 T180 30 L190 30 L200 10 L210 50 L220 10 L230 50 L240 30 Q260 30 280 30"
        stroke="var(--color-primary)"
        strokeWidth="2"
        strokeLinecap="round"
        className="animate-pulse"
      />
    </svg>
  )
}

function BarsSvg() {
  const heights = [60, 80, 45, 90, 70]
  const opacities = [0.4, 0.7, 0.3, 1, 0.6]
  return (
    <svg viewBox="0 0 200 80" className="h-16 w-40" fill="none">
      {heights.map((h, i) => (
        <rect
          key={i}
          x={10 + i * 38}
          y={80 - h}
          width="28"
          height={h}
          rx="3"
          fill="var(--color-primary)"
          opacity={opacities[i]}
        />
      ))}
    </svg>
  )
}

function DotsSvg() {
  return (
    <svg viewBox="0 0 200 60" className="h-12 w-40" fill="none">
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3, 4].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={30 + col * 36}
            cy={12 + row * 20}
            r="5"
            fill="var(--color-primary)"
            opacity={((row + col) % 3 === 0) ? 1 : 0.3}
          />
        ))
      )}
    </svg>
  )
}

function SlidersSvg() {
  return (
    <svg viewBox="0 0 240 60" className="h-12 w-48" fill="none">
      <line x1="20" y1="30" x2="220" y2="30" stroke="var(--color-primary)" strokeWidth="3" opacity="0.3" />
      <circle cx="80" cy="30" r="8" fill="var(--color-primary)" />
      <circle cx="180" cy="30" r="8" fill="var(--color-primary)" />
      <line x1="80" y1="30" x2="180" y2="30" stroke="var(--color-primary)" strokeWidth="3" />
    </svg>
  )
}

function TimelineSvg() {
  return (
    <svg viewBox="0 0 280 50" className="h-10 w-full" fill="none">
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x="10"
          y={4 + i * 12}
          width={200 - i * 40}
          height="6"
          rx="3"
          fill="var(--color-primary)"
          opacity={1 - i * 0.2}
        />
      ))}
    </svg>
  )
}

function CodeSvg() {
  return (
    <svg viewBox="0 0 240 60" className="h-12 w-48" fill="none">
      <text x="40" y="38" fill="var(--color-primary)" fontSize="32" fontFamily="monospace" opacity="0.8">
        {'<'}
      </text>
      <line x1="80" y1="30" x2="160" y2="30" stroke="var(--color-primary)" strokeWidth="3" />
      <text x="170" y="38" fill="var(--color-primary)" fontSize="32" fontFamily="monospace" opacity="0.8">
        {'/>'}
      </text>
    </svg>
  )
}

const ILLUSTRATION_MAP: Record<FeatureCard['illustration'], React.FC> = {
  heartbeat: HeartbeatSvg,
  bars: BarsSvg,
  dots: DotsSvg,
  sliders: SlidersSvg,
  timeline: TimelineSvg,
  code: CodeSvg,
}

type FeaturesSectionProps = {
  isActive: boolean
}

export function FeaturesSection({ isActive }: FeaturesSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isActive || !sectionRef.current || hasAnimated.current) return
    hasAnimated.current = true

    const el = sectionRef.current
    const tl = gsap.timeline()

    tl.from(el.querySelector('.section-tag'), {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
    })
      .from(
        el.querySelector('.section-title'),
        { opacity: 0, y: 30, duration: 0.7, ease: 'power2.out' },
        '-=0.3'
      )
      .from(
        el.querySelector('.section-bar'),
        { scaleX: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      )
      .from(
        el.querySelectorAll('.feature-card'),
        {
          opacity: 1,
          y: 50,
          scale: 0.95,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        },
        '-=0.2'
      )
      .from(
        el.querySelector('.section-cta'),
        { opacity: 0, y: 0, duration: 0.7, ease: 'power2.out' },
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
        <p className="section-tag text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
          — Core Features —
        </p>
        <h2 className="section-title mt-3 text-center text-3xl font-black uppercase tracking-tight text-text-white md:text-5xl lg:text-6xl">
          Simple Yet Powerful
        </h2>
        <div className="section-bar mt-4 h-1 w-16 origin-center rounded-full bg-primary" />

        {/* Cards grid */}
        <div className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {FEATURES.map((feature) => {
            const Illustration = ILLUSTRATION_MAP[feature.illustration]
            return (
              <div
                key={feature.title}
                className="feature-card group flex flex-col justify-between rounded-lg border border-primary/20 bg-primary/5 p-5 transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 md:p-6"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
                      <feature.icon className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold text-text-white md:text-base">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-text-secondary md:text-sm">
                    {feature.description}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-center opacity-60 transition-opacity group-hover:opacity-100">
                  <Illustration />
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Banner */}
        <div
          className="mt-12 flex w-full flex-col items-center justify-between gap-5 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/15 via-primary/10 to-cyan-500/15 p-6 md:flex-row md:p-8"
        >
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-text-white md:text-2xl">
              Ready To Start Monitoring?
            </h3>
            <p className="mt-1 text-xs text-text-secondary md:text-sm">
              Add your first endpoint in seconds. No credit card required.
            </p>
          </div>
          <Link
            to={ROUTES.AUTH.REGISTER}
            className="flex-shrink-0 rounded-lg bg-bg-primary px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest text-primary border border-primary/30 transition-all hover:bg-primary hover:text-bg-primary"
          >
            Start Monitoring Free
          </Link>
        </div>
      </div>
    </section>
  )
}
