import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ServiceGrid } from '@/components/ServiceGrid'
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
      {/* Page header — warm light */}
      <div className="bg-warm-50 pt-14 pb-16 border-b border-warm-200">
        <div className="container-site">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-brand-accent flex-shrink-0" aria-hidden="true" />
              <p className="eyebrow">Who We Are</p>
            </div>
            <h1 className="font-display font-semibold text-display-xl text-warm-900 tracking-tight max-w-2xl">
              {about.h1}
            </h1>
          </SectionReveal>
        </div>
      </div>

      {/* Main content */}
      <section className="section-py bg-white" aria-labelledby="about-company">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Content column */}
            <div className="lg:col-span-7 space-y-10">
              <SectionReveal>
                <h2 id="about-company" className="h-card mb-6">
                  Building Excellence in Canberra
                </h2>
                <div className="space-y-5">
                  {(about.body ?? []).length > 0
                    ? (about.body ?? []).map((para, i) => (
                        <p key={i} className="text-warm-600 text-body-md leading-relaxed">{para}</p>
                      ))
                    : (
                        <p className="text-warm-600 text-body-md leading-relaxed">
                          {about.metaDescription || 'Index Building Group is your trusted local builder serving Canberra and surrounding regions.'}
                        </p>
                      )
                  }
                </div>
              </SectionReveal>

              {/* Testimonial */}
              {about.testimonial && (
                <SectionReveal delay={60}>
                  <blockquote className="relative bg-warm-50 border border-warm-200 rounded-card p-8 md:p-10 overflow-hidden">
                    {/* Gold accent left bar */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent rounded-l-card" aria-hidden="true" />
                    <div
                      className="absolute top-4 right-8 text-[6rem] font-serif leading-none select-none text-brand-accent/10"
                      aria-hidden="true"
                    >
                      &ldquo;
                    </div>
                    <p className="relative font-display italic text-lg text-warm-800 leading-relaxed mb-5">
                      {about.testimonial.quote}
                    </p>
                    <cite className="block text-xs tracking-[0.1em] uppercase text-brand-accent not-italic font-semibold">
                      — {about.testimonial.attribution}
                    </cite>
                  </blockquote>
                </SectionReveal>
              )}

              <SectionReveal delay={80}>
                <Link href="/contact" className="btn-primary">
                  Contact Us
                </Link>
              </SectionReveal>
            </div>

            {/* Image column */}
            {about.image && (
              <SectionReveal delay={40} className="lg:col-span-5">
                <div className="relative aspect-[3/4] rounded-card overflow-hidden bg-warm-100 ring-1 ring-brand-accent/15 sticky top-28 shadow-card">
                  <Image
                    src={about.image}
                    alt="Index Building – construction team in Canberra"
                    fill
                    className="object-cover scale-[1.20]"
                    sizes="(max-width: 1024px) 100vw, 41vw"
                    loading="lazy"
                  />
                </div>
              </SectionReveal>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-py bg-white" aria-labelledby="about-services">
        <div className="container-site">
          <SectionReveal>
            <div className="max-w-xl mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="block w-8 h-px bg-brand-accent flex-shrink-0" aria-hidden="true" />
                <p className="eyebrow">Our Expertise</p>
              </div>
              <h2 id="about-services" className="h-section">
                {services.h1}
              </h2>
            </div>
          </SectionReveal>
          <ServiceGrid services={services.items} />
        </div>
      </section>
    </>
  )
}
