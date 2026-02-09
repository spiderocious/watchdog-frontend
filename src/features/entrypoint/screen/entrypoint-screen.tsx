import { useState, useRef, useCallback, useEffect } from 'react'
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

const SECTION_COUNT = 7
const WHEEL_THRESHOLD = 60
const ANIMATION_DURATION = 0.7
const MOBILE_BREAKPOINT = 768 // md breakpoint

export function EntrypointScreen() {
  const containerRef = useRef<HTMLDivElement>(null)
  const currentSection = useRef(0)
  const isAnimating = useRef(false)
  const accumulatedDelta = useRef(0)
  const deltaResetTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [activeSection, setActiveSection] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT)

  const navigateTo = useCallback((index: number) => {
    if (isAnimating.current) return
    if (index < 0 || index >= SECTION_COUNT) return
    if (index === currentSection.current) return

    isAnimating.current = true
    currentSection.current = index
    accumulatedDelta.current = 0
    setActiveSection(index)

    gsap.to(containerRef.current, {
      y: -index * window.innerHeight,
      duration: ANIMATION_DURATION,
      ease: 'power3.inOut',
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

  // Handle window resize to detect mobile/desktop
  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobile)
      // Reset position on resize if switching to mobile
      if (mobile && containerRef.current) {
        gsap.set(containerRef.current, { y: 0 })
        currentSection.current = 0
        setActiveSection(0)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Skip scroll snap animations on mobile
    if (isMobile) return

    let touchStartY = 0

    function handleWheel(e: WheelEvent) {
      e.preventDefault()
      if (isAnimating.current) return

      accumulatedDelta.current += e.deltaY

      clearTimeout(deltaResetTimer.current)
      deltaResetTimer.current = setTimeout(() => {
        accumulatedDelta.current = 0
      }, 150)

      if (Math.abs(accumulatedDelta.current) >= WHEEL_THRESHOLD) {
        if (accumulatedDelta.current > 0) navigateNext()
        else navigatePrev()
        accumulatedDelta.current = 0
      }
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
      clearTimeout(deltaResetTimer.current)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [navigateNext, navigatePrev, isMobile])

  return (
    <main className={isMobile ? 'h-screen w-screen overflow-y-auto bg-bg-primary' : 'h-screen w-screen overflow-hidden bg-bg-primary'}>
      <GridBackground />
      <LandingNavbar onNavigateSection={isMobile ? undefined : navigateTo} />

      <div ref={containerRef} className="relative z-10">
        <HeroSection onScrollDown={isMobile ? undefined : navigateNext} />
        <FeaturesSection isActive={isMobile ? true : activeSection >= 1} />
        <HowItWorksSection isActive={isMobile ? true : activeSection >= 2} />
        <DashboardSection isActive={isMobile ? true : activeSection >= 3} />
        <StatsSection isActive={isMobile ? true : activeSection >= 4} />
        <FaqSection isActive={isMobile ? true : activeSection >= 5} />
        <FooterSection isActive={isMobile ? true : activeSection >= 6} />
      </div>
    </main>
  )
}
