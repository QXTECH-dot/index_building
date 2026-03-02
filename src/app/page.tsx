import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { ServiceGrid } from '@/components/ServiceGrid'
import { PrimaryCTA } from '@/components/PrimaryCTA'
import { SectionReveal } from '@/components/SectionReveal'
import { SEOJsonLd } from '@/components/SEOJsonLd'
import {
  getHomePage, getServicesPage,
  getBusiness, SITE_URL
} from '@/lib/site-data'

const home = getHomePage()
const services = getServicesPage()
const business = getBusiness()

export const metadata: Metadata = {
  title: home.title,
  description: home.metaDescription,
  alternates: { canonical: SITE_URL },
}

export default function HomePage() {
  return (
    <>
      <SEOJsonLd />

      {/* ── Hero ── */}
      <Hero
        h1={home.h1}
        subtitle={home.metaDescription}
        imageSrc={home.heroImage}
        imageSrcs={home.heroImages}
        imageAlt="Residential construction project by Index Building, Canberra"
      />

      {/* ── Services ── */}
      <section className="section-py bg-white" aria-labelledby="services-heading">
        <div className="container-site">
          <SectionReveal>
            <div className="max-w-2xl mb-14">
              <div className="flex items-center gap-3 mb-4">
                <span className="block w-8 h-px bg-brand-accent flex-shrink-0" aria-hidden="true" />
                <p className="eyebrow">What We Do</p>
              </div>
              <h2 id="services-heading" className="h-section">
                {services.h1}
              </h2>
            </div>
          </SectionReveal>

          <ServiceGrid services={services.items.slice(0, 4)} />

          <SectionReveal delay={120}>
            <div className="mt-10 flex justify-center">
              <Link href="/contact" className="btn-primary">
                Discuss Your Project
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <PrimaryCTA />
    </>
  )
}
