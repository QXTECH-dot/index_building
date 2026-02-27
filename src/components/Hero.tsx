import Image from 'next/image'
import Link from 'next/link'
import { getBusiness, PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL } from '@/lib/site-data'

interface HeroProps {
  h1: string
  subtitle?: string
  imageSrc: string
  imageAlt: string
}

const business = getBusiness()

export function Hero({ h1, subtitle, imageSrc, imageAlt }: HeroProps) {
  return (
    <section
      className="relative min-h-[85vh] flex items-center overflow-hidden bg-stone-900"
      aria-label="Hero"
    >
      {/* Background image – priority load for LCP */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={85}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgba(12,10,9,0.78) 0%, rgba(12,10,9,0.55) 55%, rgba(12,10,9,0.2) 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container-site py-20 pt-36 md:pt-40">
        <div className="max-w-2xl">
          <p className="text-stone-300 text-xs font-semibold tracking-widest uppercase mb-5 opacity-90">
            {business.area}
          </p>

          <h1
            className="font-display font-bold text-white leading-[1.04] tracking-[-0.03em] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}
          >
            {h1}
          </h1>

          {subtitle && (
            <p className="text-stone-200 text-[1.05rem] md:text-lg leading-relaxed mb-8 max-w-[520px] opacity-90">
              {subtitle}
            </p>
          )}

          <div className="flex flex-wrap gap-4">
            <Link href={PRIMARY_CTA_HREF} className="btn-primary px-7 py-3.5 text-[0.875rem]">
              {PRIMARY_CTA_LABEL}
            </Link>
            <Link
              href="/projects"
              className="btn-secondary px-7 py-3.5 text-[0.875rem] border-white/30 text-white hover:bg-white/10 hover:border-white/60"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/40"
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
