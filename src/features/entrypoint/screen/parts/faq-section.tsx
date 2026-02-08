import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { Search, Plus, Mail, MessageSquare, Monitor } from '@icons/index.ts'

type FaqCategory = 'all' | 'pricing' | 'technical' | 'security'

type FaqItem = {
  question: string
  answer: string
  categories: FaqCategory[]
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is the latency of the monitoring agent?',
    answer:
      'Our agent operates with sub-10ms latency using a lightweight Rust-based collector that pushes metrics via gRPC to our central ingestion engine. It utilizes an eBPF-powered instrumentation layer for zero-overhead syscall monitoring.',
    categories: ['technical'],
  },
  {
    question: 'How is data encrypted at rest and in transit?',
    answer:
      'All data in transit is encrypted using TLS 1.3 with AES-256-GCM. Data at rest uses envelope encryption with customer-managed keys (BYOK). Our key management integrates with AWS KMS, GCP Cloud KMS, and HashiCorp Vault.',
    categories: ['security'],
  },
  {
    question: 'Does it support legacy PLC protocols?',
    answer:
      'Yes, WatchDog supports Modbus TCP/RTU, OPC-UA, MQTT, and BACnet protocols out of the box. Custom protocol adapters can be configured through our plugin SDK for proprietary industrial systems.',
    categories: ['technical'],
  },
  {
    question: 'What are the API rate limits for enterprise users?',
    answer:
      'Enterprise plans include 10,000 req/min for REST endpoints and unlimited WebSocket connections. GraphQL queries are rate-limited at 5,000 operations/min with burst capacity up to 15,000.',
    categories: ['pricing', 'technical'],
  },
]

const CATEGORIES: { label: string; value: FaqCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pricing', value: 'pricing' },
  { label: 'Technical', value: 'technical' },
  { label: 'Security', value: 'security' },
]

export function FaqSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('all')
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = FAQ_ITEMS.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.categories.includes(activeCategory)
    const matchesSearch =
      searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  useEffect(() => {
    if (!sectionRef.current || hasAnimated.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true

          const tl = gsap.timeline()

          tl.from(sectionRef.current!.querySelector('.faq-badge'), {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: 'power2.out',
          })
            .from(
              sectionRef.current!.querySelector('.faq-title'),
              { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out' },
              '-=0.2'
            )
            .from(
              sectionRef.current!.querySelector('.faq-search'),
              { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' },
              '-=0.2'
            )
            .from(
              sectionRef.current!.querySelector('.faq-tabs'),
              { opacity: 0, y: 15, duration: 0.4, ease: 'power2.out' },
              '-=0.2'
            )
            .from(
              sectionRef.current!.querySelectorAll('.faq-item'),
              {
                opacity: 0,
                y: 30,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power2.out',
              },
              '-=0.2'
            )
            .from(
              sectionRef.current!.querySelector('.faq-support'),
              { opacity: 0, y: 30, duration: 0.5, ease: 'power2.out' },
              '-=0.2'
            )

          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="flex h-screen w-screen flex-shrink-0 flex-col items-center justify-center px-4 py-8 md:px-10 lg:px-16"
    >
      <div className="flex w-full max-w-3xl flex-col items-center">
        {/* Header */}
        <div className="faq-badge flex items-center gap-2 text-primary">
          <Monitor className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
            WatchDog // FAQ
          </span>
        </div>
        <h2 className="faq-title mt-3 text-center text-3xl font-black uppercase tracking-tight text-text-white md:text-5xl">
          Everything You <span className="text-primary">Need To Know</span>
        </h2>

        {/* Search */}
        <div className="faq-search mt-6 flex w-full items-center gap-3 rounded-lg border border-border-light bg-bg-secondary px-4 py-3">
          <Search className="h-4 w-4 flex-shrink-0 text-text-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="FILTER_TECHNICAL_DATABASE..."
            className="flex-1 bg-transparent text-xs font-medium tracking-wider text-text-white placeholder:text-text-tertiary focus:outline-none"
          />
          <div className="hidden items-center gap-0.5 rounded border border-border-light px-1.5 py-0.5 sm:flex">
            <span className="text-[9px] font-bold text-text-tertiary">CMD +</span>
            <span className="text-[9px] font-bold text-text-tertiary">K</span>
          </div>
        </div>

        {/* Category tabs */}
        <div className="faq-tabs mt-4 flex items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setActiveCategory(cat.value)}
              className={`rounded-lg border px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat.value
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-border-light bg-transparent text-text-secondary hover:border-border-hover hover:text-text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion items */}
        <div className="mt-6 w-full space-y-2">
          {filteredItems.map((item, i) => {
            const isOpen = openIndex === i

            return (
              <div
                key={item.question}
                className="faq-item overflow-hidden rounded-lg border border-border-light bg-bg-secondary transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-text-white md:text-sm">
                    {item.question}
                  </span>
                  <Plus
                    className={`h-4 w-4 flex-shrink-0 text-primary transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: isOpen ? '200px' : '0',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="px-5 pb-4 text-xs leading-relaxed text-text-secondary">
                    {item.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Support CTA */}
        <div className="faq-support mt-6 flex w-full flex-col items-center justify-between gap-4 rounded-lg border border-border-light bg-bg-secondary p-5 sm:flex-row">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-white">
              Still Have Questions?
            </h3>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-text-secondary">
              Our technical engineers are online 24/7/365.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-bg-primary"
            >
              <Mail className="h-3.5 w-3.5" />
              Email Support
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-border-light px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-text-secondary transition-all hover:border-border-hover hover:text-text-white"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Live Chat
            </button>
          </div>
        </div>

        {/* Footer bar */}
        <div className="mt-4 flex w-full items-center justify-between text-[8px] uppercase tracking-widest text-text-tertiary">
          <span>
            System Status:{' '}
            <span className="font-bold text-primary">Operational</span>
          </span>
          <span>Region: US-EAST-1</span>
          <span className="hidden sm:block">
            &copy; 2024 WatchDog Infrastructure Group
          </span>
        </div>
      </div>
    </section>
  )
}
