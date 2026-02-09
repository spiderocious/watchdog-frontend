import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Search, Plus, Mail, MessageSquare, Monitor } from "@icons/index.ts";
import { Hidden } from "meemaw";

type FaqCategory = "all" | "pricing" | "technical" | "security";

type FaqItem = {
  question: string;
  answer: string;
  categories: FaqCategory[];
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What protocols can I monitor?",
    answer:
      "Monitor Central supports HTTP and HTTPS endpoints. You can configure GET, POST, PUT, DELETE, and other HTTP methods with custom headers and request bodies.",
    categories: ["technical"],
  },
  {
    question: "How often are health checks performed?",
    answer:
      "You can configure check intervals per service, with a minimum of 30 seconds. Each service is checked independently at your chosen interval.",
    categories: ["technical"],
  },
  {
    question: "What metrics are tracked?",
    answer:
      "For each service, we track uptime percentage, average response time, status codes, success/failure counts, and maintain a complete log of all health checks with timestamps.",
    categories: ["technical"],
  },
  {
    question: "Does it support alerts or notifications?",
    answer:
      "Alert functionality is currently not implemented. The dashboard provides real-time visibility into service health, response times, and error logs.",
    categories: ["pricing", "technical"],
  },
];

const CATEGORIES: { label: string; value: FaqCategory }[] = [
  { label: "All", value: "all" },
  { label: "Pricing", value: "pricing" },
  { label: "Technical", value: "technical" },
  { label: "Security", value: "security" },
];

type FaqSectionProps = {
  isActive: boolean;
};

export function FaqSection({ isActive }: FaqSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = FAQ_ITEMS.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.categories.includes(activeCategory);
    const matchesSearch =
      searchQuery === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (!isActive || !sectionRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const el = sectionRef.current;
    const tl = gsap.timeline();

    tl.from(el.querySelector(".faq-badge"), {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: "power2.out",
    })
      .from(
        el.querySelector(".faq-title"),
        { opacity: 0, y: 30, duration: 0.6, ease: "power2.out" },
        "-=0.2",
      )
      .from(
        el.querySelector(".faq-search"),
        { opacity: 0, y: 20, duration: 0.5, ease: "power2.out" },
        "-=0.2",
      )
      .from(
        el.querySelector(".faq-tabs"),
        { opacity: 0, y: 15, duration: 0.4, ease: "power2.out" },
        "-=0.2",
      )
      .from(
        el.querySelectorAll(".faq-item"),
        {
          opacity: 0,
          y: 30,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        },
        "-=0.2",
      )
      .from(
        el.querySelector(".faq-support"),
        { opacity: 0, y: 30, duration: 0.5, ease: "power2.out" },
        "-=0.2",
      );
  }, [isActive]);

  return (
    <section
      ref={sectionRef}
      className="flex min-h-screen md:h-screen w-screen flex-shrink-0 flex-col items-center justify-center px-4 py-8 md:px-10 lg:px-16"
    >
      <div className="flex w-full max-w-3xl flex-col items-center">
        {/* Header */}
        <div className="faq-badge flex items-center gap-1.5 text-primary sm:gap-2">
          <Monitor className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] sm:text-[10px] sm:tracking-[0.3em]">
            Monitor Central // FAQ
          </span>
        </div>
        <h2 className="faq-title mt-2.5 text-center text-2xl font-black uppercase tracking-tight text-text-white sm:mt-3 sm:text-3xl md:text-4xl lg:text-5xl">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>

        {/* Search */}
        <div className="faq-search mt-4 flex w-full items-center gap-2 rounded-lg border border-border-light bg-bg-secondary px-3 py-2.5 sm:mt-6 sm:gap-3 sm:px-4 sm:py-3">
          <Search className="h-3.5 w-3.5 shrink-0 text-text-tertiary sm:h-4 sm:w-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="flex-1 bg-transparent text-[11px] font-medium tracking-wider text-text-white placeholder:text-text-tertiary focus:outline-none sm:text-xs"
          />
          <div className="hidden items-center gap-0.5 rounded border border-border-light px-1.5 py-0.5 sm:flex">
            <span className="text-[9px] font-bold text-text-tertiary">
              CMD +
            </span>
            <span className="text-[9px] font-bold text-text-tertiary">K</span>
          </div>
        </div>

        {/* Category tabs */}
        <div className="faq-tabs mt-3 flex w-full items-center gap-1.5 overflow-x-auto sm:mt-4 sm:w-auto sm:gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setActiveCategory(cat.value)}
              className={`shrink-0 rounded-lg border px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all sm:px-4 sm:text-[10px] ${
                activeCategory === cat.value
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border-light bg-transparent text-text-secondary hover:border-border-hover hover:text-text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion items */}
        <div className="mt-4 w-full space-y-2 sm:mt-6">
          {filteredItems.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <div
                key={item.question}
                className="faq-item overflow-hidden rounded-lg border border-border-light bg-bg-secondary transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="min-h-11 flex w-full items-center justify-between gap-3 px-4 py-3 text-left sm:px-5 sm:py-4"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-white sm:text-xs md:text-sm">
                    {item.question}
                  </span>
                  <Plus
                    className={`h-4 w-4 shrink-0 text-primary transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: isOpen ? "200px" : "0",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="px-4 pb-3 text-[11px] leading-relaxed text-text-secondary sm:px-5 sm:pb-4 sm:text-xs">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support CTA */}
        <Hidden when={true}>
          <div className="faq-support mt-6 flex w-full flex-col items-center justify-between gap-4 rounded-lg border border-border-light bg-bg-secondary p-5 sm:flex-row">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-white">
                Need Help?
              </h3>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-text-secondary">
                Check our docs or open an issue on GitHub.
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
        </Hidden>
        {/* Footer bar */}
        <div className="mt-3 flex w-full items-center justify-between text-[7px] uppercase tracking-widest text-text-tertiary sm:mt-4 sm:text-[8px]">
          <span>WatchDog v1.0</span>
          <span>Open Source</span>
          <span className="hidden sm:block">MIT License</span>
        </div>
      </div>
    </section>
  );
}
