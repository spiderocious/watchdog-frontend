import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { Monitor, ArrowRight, Github, Twitter, Linkedin, Globe } from '@icons/index.ts'
import { ROUTES } from '@shared/constants/routes.ts'

const FOOTER_LINKS = {
  product: {
    title: 'Product',
    links: ['Features', 'Edge Nodes', 'API Access', 'Pricing', 'Documentation'],
  },
  resources: {
    title: 'Resources',
    links: ['SDK Libraries', 'CLI Tools', 'System Status', 'Changelog', 'Support Portal'],
  },
  company: {
    title: 'Company',
    links: ['Mission', 'Engineering', 'Security Certs', 'Technical Blog', 'Careers [HIRING]'],
  },
}

export function FooterSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!sectionRef.current || hasAnimated.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true

          const tl = gsap.timeline()

          // CTA header
          tl.from(sectionRef.current!.querySelector('.ft-tag'), {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: 'power2.out',
          })
            .from(
              sectionRef.current!.querySelector('.ft-title'),
              { opacity: 0, y: 40, scale: 0.95, duration: 0.8, ease: 'power3.out' },
              '-=0.2'
            )
            .from(
              sectionRef.current!.querySelectorAll('.ft-btn'),
              {
                opacity: 0,
                y: 30,
                duration: 0.5,
                stagger: 0.12,
                ease: 'power2.out',
              },
              '-=0.3'
            )
            .from(
              sectionRef.current!.querySelector('.ft-notes'),
              { opacity: 0, duration: 0.5 },
              '-=0.2'
            )

          // Footer columns
          gsap.from(sectionRef.current!.querySelectorAll('.ft-col'), {
            opacity: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 1,
          })

          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="flex h-screen w-screen flex-shrink-0 flex-col items-center justify-between px-4 py-8 md:px-10 lg:px-16"
    >
      {/* CTA Area */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="ft-tag text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
          Mission Critical Deployment
        </p>
        <h2 className="ft-title mt-4 text-center text-4xl font-black uppercase tracking-tight text-text-white md:text-6xl lg:text-7xl">
          Start Monitoring In
          <br />
          <span className="text-primary">60 Seconds</span>
        </h2>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            to={ROUTES.AUTH.REGISTER}
            className="ft-btn rounded-lg bg-primary px-10 py-4 text-sm font-bold uppercase tracking-widest text-bg-primary transition-all hover:shadow-[0_0_40px_rgba(0,255,136,0.3)]"
          >
            Start Monitoring Free
          </Link>
          <Link
            to={ROUTES.DASHBOARD}
            className="ft-btn rounded-lg border border-primary/30 bg-transparent px-10 py-4 text-sm font-bold uppercase tracking-widest text-text-white transition-all hover:border-primary/60 hover:text-primary"
          >
            View Live Demo
          </Link>
        </div>

        {/* Protocol notes */}
        <div className="ft-notes mt-6 space-y-1 text-center font-mono text-[10px] tracking-wider text-text-tertiary">
          <p>// AUTHENTICATION_KEY_REQUIRED: FALSE</p>
          <p>// CREDIT_CARD_REQUIRED: FALSE</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-6xl border-t border-border-light pt-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Logo column */}
          <div className="ft-col col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                <Monitor className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider text-text-white">
                WatchDog
              </span>
            </div>
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-bg-secondary px-3 py-1.5">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-primary">
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.values(FOOTER_LINKS).map((section) => (
            <div key={section.title} className="ft-col">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-white">
                {section.title}
              </h4>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      className="text-[10px] tracking-wider text-text-secondary transition-colors hover:text-primary"
                    >
                      <span className="mr-1 text-primary/50">{'>>'}</span> {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Connect column */}
          <div className="ft-col">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-white">
              Connect
            </h4>
            <div className="mt-3 flex items-center gap-3">
              <button type="button" className="text-text-secondary transition-colors hover:text-primary">
                <Github className="h-4.5 w-4.5" />
              </button>
              <button type="button" className="text-text-secondary transition-colors hover:text-primary">
                <Twitter className="h-4.5 w-4.5" />
              </button>
              <button type="button" className="text-text-secondary transition-colors hover:text-primary">
                <Linkedin className="h-4.5 w-4.5" />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-text-secondary">
                Newsletter_Subscribe:
              </p>
              <div className="mt-2 flex overflow-hidden rounded-lg border border-border-light">
                <input
                  type="email"
                  placeholder="Enter technical"
                  className="flex-1 bg-bg-secondary px-3 py-2 text-[10px] text-text-white placeholder:text-text-tertiary focus:outline-none"
                />
                <button
                  type="button"
                  className="flex items-center justify-center bg-primary/15 px-3 text-primary transition-colors hover:bg-primary hover:text-bg-primary"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-border-light pt-4 text-[8px] uppercase tracking-widest text-text-tertiary sm:flex-row">
          <span>&copy; 2024 WatchDog Systems. All Rights Reserved.</span>
          <div className="flex items-center gap-4">
            <button type="button" className="transition-colors hover:text-text-secondary">
              Privacy_Policy
            </button>
            <button type="button" className="transition-colors hover:text-text-secondary">
              Terms_Of_Service
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>Lang: EN-US</span>
            </div>
            <span>v4.22.0-stable</span>
          </div>
        </div>
      </footer>
    </section>
  )
}
