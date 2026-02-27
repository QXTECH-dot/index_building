import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { ServiceGrid } from '@/components/ServiceGrid'
import { GalleryEditorial } from '@/components/GalleryEditorial'
import { PrimaryCTA } from '@/components/PrimaryCTA'
import { SectionReveal } from '@/components/SectionReveal'
import { SEOJsonLd } from '@/components/SEOJsonLd'
import {
  getHomePage, getServicesPage, getProjectsPage, getAboutPage,
  getBusiness, SITE_URL
} from '@/lib/site-data'

const home = getHomePage()
const services = getServicesPage()
const projects = getProjectsPage()
const about = getAboutPage()
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
        subtitle={`${business.tagline}. Specialising in house construction, shop renovations, flooring installation, and repairs across Canberra, ACT.`}
        imageSrc={home.heroImage}
        imageAlt="Residential construction project by Index Building, Canberra"
      />

      {/* ── Services ── */}
      <section className="section-py bg-white" aria-labelledby="services-heading">
        <div className="container-site">
          <SectionReveal>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
              <div className="max-w-lg">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-3">
                  What We Do
                </p>
                <h2 id="services-heading" className="h-section">
                  Our Services
                </h2>
              </div>
              <Link href="/services" className="btn-secondary text-sm flex-shrink-0">
                All Services
              </Link>
            </div>
          </SectionReveal>

          <ServiceGrid services={services.items.slice(0, 4)} />
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="section-py bg-stone-50" aria-labelledby="projects-heading">
        <div className="container-site">
          <SectionReveal>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
              <div className="max-w-lg">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-3">
                  Portfolio
                </p>
                <h2 id="projects-heading" className="h-section">
                  Selected Work
                </h2>
              </div>
              <Link href="/projects" className="btn-secondary text-sm flex-shrink-0">
                View All Projects
              </Link>
            </div>
          </SectionReveal>

          <GalleryEditorial projects={projects.items} limit={6} />
        </div>
      </section>

      {/* ── About preview ── */}
      <section className="section-py bg-white" aria-labelledby="about-preview-heading">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Image */}
            {about.image && (
              <SectionReveal className="lg:col-span-5 relative aspect-[4/3] rounded-card overflow-hidden bg-stone-100 shadow-sm">
                <Image
                  src={about.image}
                  alt="Index Building team – Canberra construction professionals"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 41vw"
                />
              </SectionReveal>
            )}

            {/* Text */}
            <SectionReveal delay={80} className="lg:col-span-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-4">
                About Us
              </p>
              <h2 id="about-preview-heading" className="h-section mb-5">
                Canberra Built,{' '}
                <span className="text-stone-400">Canberra Proud</span>
              </h2>
              <p className="text-stone-600 text-body-lg leading-relaxed mb-5">
                {about.body[0]}
              </p>
              <p className="text-stone-500 text-base leading-relaxed mb-8">
                {about.body[1]}
              </p>

              {about.testimonial && (
                <blockquote className="border-l-2 border-stone-200 pl-5 mb-8">
                  <p className="text-stone-600 italic text-[0.95rem] leading-relaxed">
                    "{about.testimonial.quote}"
                  </p>
                  <cite className="block mt-2 text-xs text-stone-400 not-italic tracking-wide">
                    — {about.testimonial.attribution}
                  </cite>
                </blockquote>
              )}

              <Link href="/about" className="btn-secondary">
                Learn More
              </Link>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <PrimaryCTA />
    </>
  )
}
