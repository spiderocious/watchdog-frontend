import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ArrowRight, Play, Shield, CheckCircle, Lock, ChevronDown } from '@icons/index.ts'
import { ROUTES } from '@shared/constants/routes.ts'

const TERMINAL_LINES = [
  { type: 'command', text: '$ monitor --start --region=us-east-1' },
  { type: 'info', text: 'Initializing clusters... [OK]' },
  { type: 'success', label: '[SUCCESS]', text: 'Database Cluster (PG-01)', metric: '12ms' },
  { type: 'success', label: '[SUCCESS]', text: 'Redis Cache Layer', metric: '4ms' },
  { type: 'error', label: '', text: 'Payment Gateway Service', metric: '503 ERROR' },
] as const

type HeroSectionProps = {
  onScrollDown?: () => void
}

export function HeroSection({ onScrollDown }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('[data-hero-tag]', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
      })
      .from('[data-hero-headline]', {
        y: 60,
        opacity: 0,
        duration: 0.8,
      }, '-=0.3')
      .from('[data-hero-subtitle]', {
        y: 30,
        opacity: 0,
        duration: 0.6,
      }, '-=0.4')
      .from('[data-hero-cta] > *', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
      }, '-=0.3')
      .from('[data-hero-terminal]', {
        x: 80,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
      }, '-=0.8')
      .from('[data-hero-stat]', {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: 'back.out(1.4)',
      }, '-=0.4')
      .from('[data-hero-badges]', {
        y: 20,
        opacity: 0,
        duration: 0.5,
      }, '-=0.3')
      .from('[data-hero-scroll]', {
        opacity: 0,
        duration: 0.6,
      }, '-=0.2')

      // Terminal typing effect
      gsap.from('[data-terminal-line]', {
        opacity: 0,
        x: -20,
        duration: 0.4,
        stagger: 0.15,
        delay: 1.2,
        ease: 'power2.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full flex-col justify-between overflow-hidden px-6 pt-24 pb-8 md:px-10 lg:px-16"
    >
      <div className="flex flex-1 flex-col justify-center gap-8 lg:flex-row lg:items-center lg:gap-12">
        {/* Left content */}
        <div className="flex max-w-2xl flex-1 flex-col gap-6">
          <div data-hero-tag className="flex items-center gap-2">
            <span className="text-primary">&#9889;</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Real-Time Infrastructure Monitoring
            </span>
          </div>

          <h1
            data-hero-headline
            className="text-5xl font-black uppercase leading-[0.95] tracking-tight text-text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Never Miss A Downtime Again
          </h1>

          <p
            data-hero-subtitle
            className="max-w-lg text-sm leading-relaxed tracking-wide text-text-secondary sm:text-base"
          >
            Enterprise-grade infrastructure monitoring with millisecond
            precision and automated incident response. Designed for
            teams that demand zero-latency visibility.
          </p>

          <div data-hero-cta className="flex flex-wrap items-center gap-4">
            <Link
              to={ROUTES.AUTH.REGISTER}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-primary-text transition-colors hover:bg-primary-hover sm:px-8"
            >
              Start Monitoring Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={ROUTES.DASHBOARD}
              className="flex items-center gap-3 rounded-lg border border-border-light px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-secondary transition-colors hover:border-border-hover hover:text-text-white sm:px-8"
            >
              <Play className="h-4 w-4" />
              View Live Demo
            </Link>
          </div>

          {/* Trust badges */}
          <div
            data-hero-badges
            className="flex flex-wrap items-center gap-6 pt-4"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-text-secondary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                SOC2 Type II
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-text-secondary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                99.99% SLA
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-text-secondary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                TLS 1.3 Ready
              </span>
            </div>
          </div>
        </div>

        {/* Right: Terminal + floating stats */}
        <div className="relative hidden flex-1 lg:flex lg:justify-end">
          {/* Terminal card */}
          <div
            data-hero-terminal
            className="relative w-full max-w-lg rounded-xl border border-border-light bg-bg-secondary/80 shadow-2xl backdrop-blur-sm"
          >
            {/* Title bar */}
            <div className="flex items-center justify-between border-b border-border-light px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-status-error" />
                <div className="h-2.5 w-2.5 rounded-full bg-status-warning" />
                <div className="h-2.5 w-2.5 rounded-full bg-status-success" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-status-success" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-status-success">
                  Live System Status
                </span>
              </div>
            </div>

            {/* Terminal body */}
            <div className="flex flex-col gap-3 p-5 font-mono text-sm">
              {TERMINAL_LINES.map((line, i) => (
                <div key={i} data-terminal-line className="flex items-center justify-between gap-4">
                  {line.type === 'command' && (
                    <span className="text-text-secondary">
                      <span className="text-primary">$</span>{' '}
                      {line.text.slice(2)}
                    </span>
                  )}
                  {line.type === 'info' && (
                    <span className="text-primary">{line.text}</span>
                  )}
                  {line.type === 'success' && (
                    <>
                      <span>
                        <span className="text-status-success">{line.label}</span>{' '}
                        <span className="text-text-primary">{line.text}</span>
                      </span>
                      <span className="text-primary">{line.metric}</span>
                    </>
                  )}
                  {line.type === 'error' && (
                    <>
                      <span className="text-text-primary">{line.text}</span>
                      <span className="font-bold text-status-error">{line.metric}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Floating stat: Total Checks */}
          <div
            data-hero-stat
            className="absolute -right-4 top-0 rounded-lg border border-border-light bg-bg-secondary/90 px-4 py-3 shadow-lg backdrop-blur-sm"
          >
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary">
              Total Checks
            </span>
            <p className="font-mono text-2xl font-bold text-text-white">2.4M</p>
          </div>

          {/* Floating stat: Avg Response */}
          <div
            data-hero-stat
            className="absolute -left-8 bottom-16 rounded-lg border border-border-light bg-bg-secondary/90 px-4 py-3 shadow-lg backdrop-blur-sm"
          >
            <span className="text-[9px] font-bold uppercase tracking-widest text-text-secondary">
              Avg Response
            </span>
            <p className="font-mono text-2xl font-bold text-text-white">
              142<span className="text-sm font-normal text-text-secondary">ms</span>
            </p>
          </div>

          {/* Floating stat: Uptime */}
          <div
            data-hero-stat
            className="absolute -right-2 bottom-4 rounded-lg border border-primary/20 bg-bg-secondary/90 px-4 py-3 shadow-lg backdrop-blur-sm"
          >
            <span className="text-[9px] font-bold uppercase tracking-widest text-text-secondary">
              Uptime
            </span>
            <p className="font-mono text-2xl font-bold text-text-white">99.98%</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        type="button"
        data-hero-scroll
        onClick={onScrollDown}
        className="mx-auto flex flex-col items-center gap-2 pb-4"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-text-secondary">
          Scroll to Explore Architecture
        </span>
        <ChevronDown className="h-4 w-4 animate-bounce text-text-secondary" />
      </button>
    </section>
  )
}
