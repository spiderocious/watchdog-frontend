import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ArrowRight, Shield, CheckCircle, Lock, ChevronDown } from '@icons/index.ts'
import { ROUTES } from '@shared/constants/routes.ts'

const TERMINAL_LINES = [
  { type: 'command', text: '$ watchdog add https://api.example.com/health' },
  { type: 'info', text: 'Testing connection... [OK]' },
  { type: 'success', label: '[200]', text: 'Production API', metric: '142ms' },
  { type: 'success', label: '[200]', text: 'Staging API', metric: '89ms' },
  { type: 'error', label: '[503]', text: 'Payment Service', metric: 'DOWN' },
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
      <div className="flex flex-1 flex-col justify-center gap-6 lg:flex-row lg:items-center lg:gap-12">
        {/* Left content */}
        <div className="flex max-w-2xl flex-1 flex-col gap-5 lg:gap-6">
          <div data-hero-tag className="flex items-center gap-2">
            <span className="text-primary">&#9889;</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Simple Uptime Monitoring
            </span>
          </div>

          <h1
            data-hero-headline
            className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          >
            Monitor Your Endpoints With Ease
          </h1>

          <p
            data-hero-subtitle
            className="max-w-lg text-xs leading-relaxed tracking-wide text-text-secondary sm:text-sm"
          >
            Track uptime and response times for your HTTP endpoints.
            Clean dashboard, real-time monitoring, and zero hassle.
            Perfect for developers who need straightforward visibility.
          </p>

          <div data-hero-cta className="flex flex-wrap items-center gap-3">
            <Link
              to={ROUTES.AUTH.REGISTER}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-primary-text transition-colors hover:bg-primary-hover min-h-11"
            >
              Start Monitoring Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Trust badges */}
          <div
            data-hero-badges
            className="flex flex-wrap items-center gap-4 pt-2 sm:gap-6"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-text-secondary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                Free to Start
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-text-secondary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                Open Source
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-text-secondary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                Self Hosted
              </span>
            </div>
          </div>
        </div>

        {/* Right: Terminal + floating stats */}
        <div className="relative flex flex-1 justify-center lg:justify-end">
          {/* Terminal card */}
          <div
            data-hero-terminal
            className="relative w-full max-w-sm rounded-xl border border-border-light bg-bg-secondary/80 shadow-2xl backdrop-blur-sm lg:max-w-lg"
          >
            {/* Title bar */}
            <div className="flex items-center justify-between border-b border-border-light px-3 py-2.5 lg:px-4 lg:py-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-status-error lg:h-2.5 lg:w-2.5" />
                <div className="h-2 w-2 rounded-full bg-status-warning lg:h-2.5 lg:w-2.5" />
                <div className="h-2 w-2 rounded-full bg-status-success lg:h-2.5 lg:w-2.5" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-status-success" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-status-success lg:text-[9px]">
                  Live Monitoring
                </span>
              </div>
            </div>

            {/* Terminal body */}
            <div className="flex flex-col gap-2 p-3 font-mono text-xs lg:gap-3 lg:p-5 lg:text-sm">
              {TERMINAL_LINES.map((line, i) => (
                <div key={i} data-terminal-line className="flex items-center justify-between gap-2 lg:gap-4">
                  {line.type === 'command' && (
                    <span className="truncate text-text-secondary">
                      <span className="text-primary">$</span>{' '}
                      {line.text.slice(2)}
                    </span>
                  )}
                  {line.type === 'info' && (
                    <span className="text-primary">{line.text}</span>
                  )}
                  {line.type === 'success' && (
                    <>
                      <span className="truncate">
                        <span className="text-status-success">{line.label}</span>{' '}
                        <span className="text-text-primary">{line.text}</span>
                      </span>
                      <span className="shrink-0 text-primary">{line.metric}</span>
                    </>
                  )}
                  {line.type === 'error' && (
                    <>
                      <span className="truncate text-text-primary">{line.text}</span>
                      <span className="shrink-0 font-bold text-status-error">{line.metric}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Floating stats - hidden on mobile, shown on lg+ */}
          <div
            data-hero-stat
            className="absolute -right-4 top-0 hidden rounded-lg border border-border-light bg-bg-secondary/90 px-4 py-3 shadow-lg backdrop-blur-sm lg:block"
          >
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary">
              Active Services
            </span>
            <p className="font-mono text-2xl font-bold text-text-white">3</p>
          </div>

          <div
            data-hero-stat
            className="absolute -left-8 bottom-16 hidden rounded-lg border border-border-light bg-bg-secondary/90 px-4 py-3 shadow-lg backdrop-blur-sm lg:block"
          >
            <span className="text-[9px] font-bold uppercase tracking-widest text-text-secondary">
              Avg Response
            </span>
            <p className="font-mono text-2xl font-bold text-text-white">
              142<span className="text-sm font-normal text-text-secondary">ms</span>
            </p>
          </div>

          <div
            data-hero-stat
            className="absolute -right-2 bottom-4 hidden rounded-lg border border-primary/20 bg-bg-secondary/90 px-4 py-3 shadow-lg backdrop-blur-sm lg:block"
          >
            <span className="text-[9px] font-bold uppercase tracking-widest text-text-secondary">
              Uptime
            </span>
            <p className="font-mono text-2xl font-bold text-text-white">99.2%</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        type="button"
        data-hero-scroll
        onClick={onScrollDown}
        className="mx-auto flex flex-col items-center gap-2 pb-4 min-h-11"
      >
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-text-secondary sm:text-[9px] sm:tracking-[0.3em]">
          Scroll to Explore Features
        </span>
        <ChevronDown className="h-4 w-4 animate-bounce text-text-secondary" />
      </button>
    </section>
  )
}
