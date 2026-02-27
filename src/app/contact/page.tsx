import type { Metadata } from 'next'
import { SectionReveal } from '@/components/SectionReveal'
import { getContactPage, getBusiness, SITE_URL } from '@/lib/site-data'

const contact = getContactPage()
const business = getBusiness()

export const metadata: Metadata = {
  title: contact.title,
  description: contact.metaDescription,
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: contact.title,
    description: contact.metaDescription,
    url: `${SITE_URL}/contact`,
  },
}

export default function ContactPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-stone-900 pt-32 pb-16">
        <div className="container-site">
          <SectionReveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-3">
              Get In Touch
            </p>
            <h1 className="font-display font-bold text-display-xl text-white tracking-tight">
              {contact.h1}
            </h1>
          </SectionReveal>
        </div>
      </div>

      {/* Contact details */}
      <section className="section-py bg-white" aria-label="Contact information">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">

            <SectionReveal>
              <ContactBlock
                eyebrow="Call Us"
                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />}
              >
                <a
                  href={`tel:${business.phone.replace(/\s/g, '')}`}
                  className="text-stone-900 font-medium hover:text-stone-500 transition-colors"
                >
                  {business.phone}
                </a>
              </ContactBlock>
            </SectionReveal>

            <SectionReveal delay={60}>
              <ContactBlock
                eyebrow="Email Us"
                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
              >
                <a
                  href={`mailto:${business.email}`}
                  className="text-stone-900 font-medium hover:text-stone-500 transition-colors break-all"
                >
                  {business.email}
                </a>
              </ContactBlock>
            </SectionReveal>

            <SectionReveal delay={120}>
              <ContactBlock
                eyebrow="Visit Us"
                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />}
              >
                <address className="not-italic text-stone-900 font-medium leading-snug">
                  {business.address}
                </address>
              </ContactBlock>
            </SectionReveal>

          </div>

          {/* Hours */}
          <SectionReveal delay={80} className="mt-16 pt-12 border-t border-stone-100">
            <div className="max-w-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-5">
                Office Hours
              </p>
              <dl className="space-y-3">
                <div className="flex justify-between gap-8">
                  <dt className="text-stone-500 text-sm">Monday – Friday</dt>
                  <dd className="text-stone-900 text-sm font-medium">{business.hours.weekdays}</dd>
                </div>
                <div className="flex justify-between gap-8">
                  <dt className="text-stone-500 text-sm">Saturday</dt>
                  <dd className="text-stone-400 text-sm">{business.hours.saturday}</dd>
                </div>
                <div className="flex justify-between gap-8">
                  <dt className="text-stone-500 text-sm">Sunday</dt>
                  <dd className="text-stone-400 text-sm">{business.hours.sunday}</dd>
                </div>
              </dl>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}

function ContactBlock({
  eyebrow,
  icon,
  children,
}: {
  eyebrow: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-4">
        <svg className="w-4 h-4 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          {icon}
        </svg>
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-2">
        {eyebrow}
      </p>
      <div className="text-sm leading-relaxed">
        {children}
      </div>
    </div>
  )
}
