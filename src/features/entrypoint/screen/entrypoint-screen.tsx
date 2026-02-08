import { useRef, useCallback, useEffect } from 'react'
import gsap from 'gsap'
import { GridBackground } from './parts/grid-background.tsx'
import { LandingNavbar } from './parts/landing-navbar.tsx'
import { HeroSection } from './parts/hero-section.tsx'
import { FeaturesSection } from './parts/features-section.tsx'
import { HowItWorksSection } from './parts/how-it-works-section.tsx'
import { DashboardSection } from './parts/dashboard-section.tsx'
import { StatsSection } from './parts/stats-section.tsx'
import { FaqSection } from './parts/faq-section.tsx'
import { FooterSection } from './parts/footer-section.tsx'

const SECTIONS = ['hero', 'features', 'how-it-works', 'dashboard', 'stats', 'faq', 'footer'] as const

export function EntrypointScreen() {
  const containerRef = useRef<HTMLDivElement>(null)
  const currentSection = useRef(0)
  const isAnimating = useRef(false)

  const navigateTo = useCallback((index: number) => {
    if (isAnimating.current) return
    if (index < 0 || index >= SECTIONS.length) return
    if (index === currentSection.current) return

    isAnimating.current = true
    currentSection.current = index

    gsap.to(containerRef.current, {
      y: -index * window.innerHeight,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        isAnimating.current = false
      },
    })
  }, [])

  const navigateNext = useCallback(() => {
    navigateTo(currentSection.current + 1)
  }, [navigateTo])

  const navigatePrev = useCallback(() => {
    navigateTo(currentSection.current - 1)
  }, [navigateTo])

  useEffect(() => {
    let touchStartY = 0

    function handleWheel(e: WheelEvent) {
      e.preventDefault()
      if (Math.abs(e.deltaY) < 30) return
      if (e.deltaY > 0) navigateNext()
      else navigatePrev()
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        navigateNext()
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        navigatePrev()
      }
    }

    function handleTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY
    }

    function handleTouchEnd(e: TouchEvent) {
      const delta = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(delta) < 50) return
      if (delta > 0) navigateNext()
      else navigatePrev()
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [navigateNext, navigatePrev])

  return (
    <main className="h-screen w-screen overflow-hidden bg-bg-primary">
      <GridBackground />
      <LandingNavbar onNavigateSection={navigateTo} />

      <div ref={containerRef} className="relative z-10">
        <HeroSection onScrollDown={navigateNext} />
        <FeaturesSection />
        <HowItWorksSection />
        <DashboardSection />
        <StatsSection />
        <FaqSection />
        <FooterSection />
      </div>
    </main>
  )
}
