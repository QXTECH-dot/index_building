import Image from 'next/image'
import Link from 'next/link'
import { SectionReveal } from './SectionReveal'
import type { ServiceItem } from '@/types/site'

interface ServiceGridProps {
  services: ServiceItem[]
}

export function ServiceGrid({ services }: ServiceGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
      {services.map((service, i) => (
        <SectionReveal key={service.name} delay={i * 60}>
          <ServiceCard service={service} />
        </SectionReveal>
      ))}
    </div>
  )
}

function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <article className="card group overflow-hidden border border-stone-100 hover:border-stone-200 transition-all duration-200">
      {service.image && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 620px"
          />
          {/* Hover overlay */}
          <div
            className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-300"
            aria-hidden="true"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="font-display font-semibold text-xl text-stone-900 mb-3">
          {service.name}
        </h3>
        <p className="text-stone-600 text-sm leading-relaxed line-clamp-3">
          {service.description}
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-stone-900 hover:text-stone-600 transition-colors group/link"
          aria-label={`Enquire about ${service.name}`}
        >
          Enquire
          <svg
            className="w-3.5 h-3.5 transition-transform duration-150 group-hover/link:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  )
}
