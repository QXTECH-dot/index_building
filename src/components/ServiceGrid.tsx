import Image from 'next/image'
import Link from 'next/link'
import { SectionReveal } from './SectionReveal'
import type { ServiceItem } from '@/types/site'

interface ServiceGridProps {
  services: ServiceItem[]
}

export function ServiceGrid({ services }: ServiceGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
      {services.map((service, i) => (
        <SectionReveal key={service.name} delay={i * 80}>
          <ServiceCard service={service} index={i} />
        </SectionReveal>
      ))}
    </div>
  )
}

function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const num = String(index + 1).padStart(2, '0')
  const href = service.slug ? `/services/${service.slug}` : '/services'

  return (
    <Link
      href={href}
      aria-label={`Learn more about ${service.name}`}
      className="group block bg-white border border-warm-200/70 rounded-card overflow-hidden shadow-card transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-card-hover hover:-translate-y-1 cursor-pointer"
    >
    <article>
      {service.image && (
        <div className="relative aspect-[4/3] overflow-hidden bg-warm-100">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover scale-[1.12] transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-safe:group-hover:scale-[1.18]"
            sizes="(max-width: 640px) 100vw, 50vw"
            loading="lazy"
          />
          {/* Warm gold tint on hover */}
          <div
            className="absolute inset-0 bg-brand-accent/0 motion-safe:group-hover:bg-brand-accent/6 transition-colors duration-500"
            aria-hidden="true"
          />
          {/* Number badge */}
          <span
            className="absolute top-4 left-4 bg-brand-accent text-warm-900 text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-sm"
            aria-hidden="true"
          >
            {num}
          </span>
        </div>
      )}

      {/* No image: show number in the card body */}
      {!service.image && (
        <div className="px-6 pt-6">
          <span
            className="inline-block bg-brand-accent/15 text-brand-accent text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-sm mb-2"
            aria-hidden="true"
          >
            {num}
          </span>
        </div>
      )}

      <div className="p-6">
        <h3 className="font-display font-semibold text-xl text-warm-900 mb-2 transition-colors duration-300 group-hover:text-brand-accent leading-tight">
          {service.name}
        </h3>
        <p className="text-warm-600 text-sm leading-relaxed mb-5 line-clamp-3">
          {service.description}
        </p>
        <span
          className="inline-flex items-center gap-2 text-[0.75rem] font-semibold tracking-[0.1em] uppercase text-brand-accent transition-all duration-300 group-hover:gap-3"
          aria-hidden="true"
        >
          Learn More
          <svg
            className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </article>
    </Link>
  )
}
