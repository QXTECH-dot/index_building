import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Hero } from '@/components/Hero'
import { ServiceGrid } from '@/components/ServiceGrid'
import { PrimaryCTA } from '@/components/PrimaryCTA'
import { SectionReveal } from '@/components/SectionReveal'
import { SEOJsonLd } from '@/components/SEOJsonLd'
import {
  getHomePage, getServicesPage, getAboutPage, getProjectsPage,
  getBusiness, SITE_URL
} from '@/lib/site-data'

const home = getHomePage()
const services = getServicesPage()
const business = getBusiness()
const about = getAboutPage()
const projects = getProjectsPage()

// Pick first 6 images across all groups for the featured grid
const featuredImages = (projects.groups ?? [])
  .flatMap(g => g.items)
  .filter(item => item.image)
  .slice(0, 6)

const WHY_US = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Licensed & Experienced',
    body: 'Led by Stephen Zhou, a fully licensed builder with over a decade of hands-on construction experience across the ACT.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    title: 'End-to-End Service',
    body: 'From design and council approvals through to final handover, we manage every step so you never feel left in the dark.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'On Time, On Budget',
    body: 'We respect your timeline and your budget. Clear communication and proactive planning keep your project on track.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
    title: 'Personal Approach',
    body: 'We treat every project as if it were our own home — attentive, honest, and genuinely invested in delivering results you\'re proud of.',
  },
]

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

      {/* ── About intro ── */}
      <section className="section-py bg-warm-50" aria-labelledby="about-intro-heading">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Image */}
            {about.image && (
              <SectionReveal className="lg:col-span-5">
                <div className="relative aspect-[4/3] rounded-card overflow-hidden bg-warm-100 shadow-card ring-1 ring-brand-accent/10">
                  <Image
                    src={about.image}
                    alt="Index Building founder Stephen Zhou"
                    fill
                    className="object-cover scale-[1.16]"
                    sizes="(max-width: 1024px) 100vw, 41vw"
                    loading="lazy"
                  />
                </div>
              </SectionReveal>
            )}
            {/* Text */}
            <SectionReveal delay={60} className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-5">
                <span className="block w-8 h-px bg-brand-accent flex-shrink-0" aria-hidden="true" />
                <p className="eyebrow">Who We Are</p>
              </div>
              <h2 id="about-intro-heading" className="h-section mb-6">
                Built on Trust,<br />Delivered with Care
              </h2>
              <p className="text-warm-600 text-body-lg leading-relaxed mb-8">
                {about.body?.[0]}
              </p>
              <Link href="/about" className="btn-secondary">
                Our Story
              </Link>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ── Why choose us ── */}
      <section className="section-py bg-white" aria-labelledby="why-us-heading">
        <div className="container-site">
          <SectionReveal>
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-3 mb-4">
                <span className="block w-8 h-px bg-brand-accent flex-shrink-0" aria-hidden="true" />
                <p className="eyebrow">Why Index Building</p>
              </div>
              <h2 id="why-us-heading" className="h-section">
                What Sets Us Apart
              </h2>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {WHY_US.map((item, i) => (
              <SectionReveal key={item.title} delay={i * 80}>
                <div className="bg-warm-50 border border-warm-200/70 rounded-card p-7 h-full">
                  <div className="w-11 h-11 flex items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent mb-5">
                    {item.icon}
                  </div>
                  <h3 className="font-display font-semibold text-warm-900 text-[1.05rem] mb-3 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-warm-500 text-sm leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured projects ── */}
      {featuredImages.length > 0 && (
        <section className="section-py bg-warm-50" aria-labelledby="featured-projects-heading">
          <div className="container-site">
            <SectionReveal>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="block w-8 h-px bg-brand-accent flex-shrink-0" aria-hidden="true" />
                    <p className="eyebrow">Our Work</p>
                  </div>
                  <h2 id="featured-projects-heading" className="h-section">
                    Recent Projects
                  </h2>
                </div>
                <Link href="/projects" className="btn-secondary hidden sm:inline-flex">
                  View All
                </Link>
              </div>
            </SectionReveal>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {featuredImages.map((item, i) => (
                <SectionReveal key={item.image} delay={i * 60}>
                  <Link
                    href="/projects"
                    className={`group block relative overflow-hidden rounded-card bg-warm-100 shadow-card cursor-pointer ${i === 0 ? 'col-span-2 lg:col-span-1 aspect-[4/3]' : 'aspect-[4/3]'}`}
                    aria-label="View all projects"
                  >
                    <Image
                      src={item.image!}
                      alt={`Index Building project ${i + 1}`}
                      fill
                      className="object-cover scale-[1.16] transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-safe:group-hover:scale-[1.22]"
                      sizes="(max-width: 640px) 50vw, 33vw"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0 bg-warm-900/0 group-hover:bg-warm-900/20 transition-colors duration-500"
                      aria-hidden="true"
                    />
                  </Link>
                </SectionReveal>
              ))}
            </div>

            <SectionReveal delay={100}>
              <div className="mt-8 flex justify-center sm:hidden">
                <Link href="/projects" className="btn-secondary">View All Projects</Link>
              </div>
            </SectionReveal>
          </div>
        </section>
      )}

      {/* ── CTA banner ── */}
      <PrimaryCTA />
    </>
  )
}
