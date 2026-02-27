import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PrimaryCTA } from '@/components/PrimaryCTA'
import { SectionReveal } from '@/components/SectionReveal'
import { getAboutPage, getServicesPage, SITE_URL } from '@/lib/site-data'

const about = getAboutPage()
const services = getServicesPage()

export const metadata: Metadata = {
  title: about.title,
  description: about.metaDescription,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: about.title,
    description: about.metaDescription,
    url: `${SITE_URL}/about`,
    images: about.image ? [{ url: about.image, alt: 'Index Building team' }] : [],
  },
}

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-stone-900 pt-32 pb-16">
        <div className="container-site">
          <SectionReveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
              Who We Are
            </p>
            <h1 className="font-display font-semibold text-display-xl text-white tracking-tight">
              {about.h1}
            </h1>
          </SectionReveal>
        </div>
      </div>

      {/* Main content */}
      <section className="section-py bg-white" aria-labelledby="about-company">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Content */}
            <div className="lg:col-span-7">
              <SectionReveal>
                <h2 id="about-company" className="h-card text-stone-900 mb-6">
                  Our Company
                </h2>
                <div className="space-y-5">
                  {about.body.map((para, i) => (
                    <p key={i} className="text-stone-600 text-body-lg leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </SectionReveal>

              {/* Testimonial */}
              {about.testimonial && (
                <SectionReveal delay={60} className="mt-10">
                  <blockquote className="relative p-8 bg-stone-50 rounded-card border border-stone-100">
                    <div className="absolute top-6 left-6 text-stone-200 text-5xl font-serif leading-none" aria-hidden="true">
                      "
                    </div>
                    <p className="relative text-stone-700 text-lg italic leading-relaxed pt-4">
                      {about.testimonial.quote}
                    </p>
                    <cite className="block mt-4 text-sm text-stone-400 not-italic">
                      — {about.testimonial.attribution}
                    </cite>
                  </blockquote>
                </SectionReveal>
              )}

              <SectionReveal delay={80} className="mt-8">
                <Link href="/contact" className="btn-primary">
                  Start a Project
                </Link>
              </SectionReveal>
            </div>

            {/* Image */}
            {about.image && (
              <SectionReveal delay={40} className="lg:col-span-5">
                <div className="relative aspect-[3/4] rounded-card overflow-hidden bg-stone-100 sticky top-28">
                  <Image
                    src={about.image}
                    alt="Index Building – construction team in Canberra"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 41vw"
                    loading="lazy"
                  />
                </div>
              </SectionReveal>
            )}
          </div>
        </div>
      </section>

      {/* Services quick list */}
      <section className="section-py bg-stone-50" aria-labelledby="about-services">
        <div className="container-site">
          <SectionReveal>
            <h2 id="about-services" className="h-card text-stone-900 mb-8">
              What We Specialise In
            </h2>
          </SectionReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.items.map((service, i) => (
              <SectionReveal key={service.name} delay={i * 50}>
                <div className="p-6 bg-white rounded-card border border-stone-100">
                  <h3 className="font-display font-medium text-xl text-stone-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {service.description.slice(0, 120)}…
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
          <SectionReveal className="mt-8">
            <Link href="/services" className="btn-secondary">
              View All Services
            </Link>
          </SectionReveal>
        </div>
      </section>

      <PrimaryCTA />
    </>
  )
}
