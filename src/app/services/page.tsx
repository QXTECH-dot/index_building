import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PrimaryCTA } from '@/components/PrimaryCTA'
import { SectionReveal } from '@/components/SectionReveal'
import { getServicesPage, SITE_URL } from '@/lib/site-data'

const servicesPage = getServicesPage()
const commercialServices = [
  {
    slug: 'industrial-warehouse-construction',
    name: 'Industrial Warehouse Construction',
    eyebrow: 'Commercial 01',
    description:
      'From new industrial facilities to warehouse expansions, we deliver durable, practical spaces built around access, workflow, and long-term performance.',
  },
  {
    slug: 'shop-fitouts',
    name: 'Shop Fitouts',
    eyebrow: 'Commercial 02',
    description:
      'We create polished retail and commercial interiors that balance brand presentation, customer flow, and day-to-day functionality.',
  },
]

export const metadata: Metadata = {
  title: servicesPage.title,
  description: servicesPage.metaDescription,
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: servicesPage.title,
    description: servicesPage.metaDescription,
    url: `${SITE_URL}/services`,
  },
}

export default function ServicesPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-warm-50 pt-14 pb-16 border-b border-warm-200">
        <div className="container-site">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-brand-accent flex-shrink-0" aria-hidden="true" />
              <p className="eyebrow">What We Offer</p>
            </div>
            <h1 className="font-display font-semibold text-display-xl text-warm-900 tracking-tight max-w-2xl">
              {servicesPage.h1}
            </h1>
          </SectionReveal>
        </div>
      </div>

      {/* Residential services */}
      <section className="section-py bg-white" aria-label="Residential services">
        <div className="container-site space-y-20">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-8 h-px bg-brand-accent flex-shrink-0" aria-hidden="true" />
              <p className="eyebrow">Residential</p>
            </div>
            <h2 className="h-section max-w-2xl">
              Thoughtful homes, extensions, and renovations tailored to the way you live.
            </h2>
          </SectionReveal>

          {servicesPage.items.map((service, i) => (
            <SectionReveal key={service.name}>
              <article className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                {/* Image — alternates sides */}
                {service.image && (
                  <div className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="relative aspect-[4/3] rounded-card overflow-hidden bg-warm-100">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover scale-[1.22]"
                        sizes="(max-width: 1024px) 100vw, 41vw"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}

                <div className={`${service.image ? 'lg:col-span-7' : 'lg:col-span-12'} ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <span className="text-xs font-semibold uppercase tracking-widest eyebrow mb-3 block">
                    Service 0{i + 1}
                  </span>
                  <h2 className="h-card text-warm-900 mb-4">
                    {service.name}
                  </h2>
                  <p className="text-warm-600 text-body-lg leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="btn-secondary"
                    aria-label={`Learn more about ${service.name}`}
                  >
                    Learn More
                  </Link>
                </div>
              </article>
              {i < servicesPage.items.length - 1 && (
                <hr className="mt-20 border-warm-100" aria-hidden="true" />
              )}
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* Commercial services */}
      <section className="section-py bg-warm-50 border-t border-warm-200" aria-label="Commercial services">
        <div className="container-site">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-8 h-px bg-brand-accent flex-shrink-0" aria-hidden="true" />
              <p className="eyebrow">Commercial</p>
            </div>
            <h2 className="h-section mb-4 max-w-2xl">
              Built for businesses that need practical, high-performing spaces.
            </h2>
            <p className="text-warm-600 text-body-lg leading-relaxed max-w-3xl">
              We also support commercial clients with tailored construction and fitout solutions,
              delivered with the same clear communication, planning, and attention to detail as our
              residential work.
            </p>
          </SectionReveal>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {commercialServices.map((service, i) => (
              <SectionReveal key={service.slug} delay={i * 60}>
                <article
                  id={service.slug}
                  className="scroll-mt-28 bg-white rounded-card border border-warm-200 p-6 sm:p-8 shadow-card h-full"
                >
                  <span className="text-xs font-semibold uppercase tracking-widest eyebrow mb-3 block">
                    {service.eyebrow}
                  </span>
                  <h3 className="h-card text-warm-900 mb-4">{service.name}</h3>
                  <p className="text-warm-600 text-body-md leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <Link href="/contact" className="btn-secondary">
                    Discuss This Service
                  </Link>
                </article>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <PrimaryCTA
        heading="Let's Discuss Your Project"
        body="Whether you're planning a new home, renovation, warehouse, or fitout, we'd love to hear about your project and provide a tailored solution."
      />
    </>
  )
}
