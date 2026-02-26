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

      {/* Hero */}
      <Hero
        h1={home.h1}
        subtitle={`${business.tagline}. We specialize in house construction, shop renovations, flooring installation, and repairs across the ACT.`}
        imageSrc={home.heroImage}
        imageAlt="Index Building – premium construction in Canberra"
      />

      {/* What We Do */}
      <section className="section-py bg-white" aria-labelledby="services-heading">
        <div className="container-site">
          <SectionReveal>
            <div className="mb-12 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
                Our Services
              </p>
              <h2 id="services-heading" className="h-section mb-4">
                What We Do
              </h2>
              <p className="text-stone-600 text-body-lg">
                From new home construction to commercial renovations, we deliver quality craftsmanship across Canberra and the ACT.
              </p>
            </div>
          </SectionReveal>
          <ServiceGrid services={services.items} />
          <SectionReveal className="mt-10">
            <Link href="/contact" className="btn-secondary">
              Discuss Your Project
            </Link>
          </SectionReveal>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-py bg-stone-50" aria-labelledby="projects-heading">
        <div className="container-site">
          <SectionReveal>
            <div className="mb-12 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
                Portfolio
              </p>
              <h2 id="projects-heading" className="h-section mb-4">
                Featured Projects
              </h2>
              <p className="text-stone-600 text-body-lg">
                A selection of residential and commercial projects completed across Canberra.
              </p>
            </div>
          </SectionReveal>
          <GalleryEditorial projects={projects.items} limit={6} />
          <SectionReveal className="mt-10">
            <Link href="/projects" className="btn-secondary">
              View All Projects
            </Link>
          </SectionReveal>
        </div>
      </section>

      {/* About preview */}
      <section className="section-py bg-white" aria-labelledby="about-heading">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {about.image && (
              <SectionReveal className="relative aspect-[4/3] rounded-card overflow-hidden bg-stone-100">
                <Image
                  src={about.image}
                  alt="Index Building – our team"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </SectionReveal>
            )}
            <SectionReveal delay={60}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
                  About Us
                </p>
                <h2 id="about-heading" className="h-section mb-6">
                  Building Canberra,{' '}
                  <span className="text-stone-500">One Project at a Time</span>
                </h2>
                <p className="text-stone-600 text-body-lg leading-relaxed mb-6">
                  {about.body[0]}
                </p>
                {about.testimonial && (
                  <blockquote className="border-l-2 border-stone-200 pl-5 my-6">
                    <p className="text-stone-700 text-base italic leading-relaxed">
                      "{about.testimonial.quote}"
                    </p>
                    <cite className="block mt-2 text-xs text-stone-400 not-italic">
                      — {about.testimonial.attribution}
                    </cite>
                  </blockquote>
                )}
                <Link href="/about" className="btn-secondary mt-4">
                  Learn More About Us
                </Link>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <PrimaryCTA />
    </>
  )
}
