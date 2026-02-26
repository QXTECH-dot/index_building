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
      className="relative min-h-[85vh] flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background image */}
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
          className="absolute inset-0 bg-gradient-to-r from-stone-950/75 via-stone-950/50 to-stone-950/20"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container-site py-24 pt-36">
        <div className="max-w-2xl">
          <p className="text-stone-300 text-sm font-medium tracking-widest uppercase mb-4">
            {business.area}
          </p>
          <h1 className="font-display font-semibold text-white leading-tight tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', lineHeight: '1.1' }}
          >
            {h1}
          </h1>
          {subtitle && (
            <p className="text-stone-200 text-lg leading-relaxed mb-8 max-w-xl">
              {subtitle}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            <Link href={PRIMARY_CTA_HREF} className="btn-primary">
              {PRIMARY_CTA_LABEL}
            </Link>
            <Link href="/projects" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:border-white/50">
              View Our Work
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
