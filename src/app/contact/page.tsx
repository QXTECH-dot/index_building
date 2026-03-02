import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionReveal } from '@/components/SectionReveal'
import { ContactForm } from '@/components/ContactForm'
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
      {/* Page header — warm light */}
      <div className="bg-warm-50 pt-14 pb-16 border-b border-warm-200">
        <div className="container-site">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-brand-accent flex-shrink-0" aria-hidden="true" />
              <p className="eyebrow">Contact</p>
            </div>
            <h1 className="font-display font-semibold text-display-xl text-warm-900 tracking-tight max-w-2xl">
              {contact.h1}
            </h1>
          </SectionReveal>
        </div>
      </div>

      {/* Contact details */}
      <section className="section-py bg-white" aria-label="Contact information">
        <div className="container-site">
          <div className="flex flex-wrap gap-12 lg:gap-16">

            {business.phone && (
              <SectionReveal>
                <ContactBlock eyebrow="Call Us" icon="phone">
                  <a
                    href={`tel:${business.phone.replace(/\s/g, '')}`}
                    className="text-warm-900 font-medium hover:text-brand-accent transition-colors duration-300 text-base"
                  >
                    {business.phone}
                  </a>
                </ContactBlock>
              </SectionReveal>
            )}

            {business.email && (
              <SectionReveal delay={60}>
                <ContactBlock eyebrow="Email Us" icon="email">
                  <a
                    href={`mailto:${business.email}`}
                    className="text-warm-900 font-medium hover:text-brand-accent transition-colors duration-300 break-all text-base"
                  >
                    {business.email}
                  </a>
                </ContactBlock>
              </SectionReveal>
            )}

            {business.address && (
              <SectionReveal delay={120}>
                <ContactBlock eyebrow="Visit Us" icon="map">
                  <address className="not-italic text-warm-900 font-medium leading-snug text-base">
                    {business.address}
                  </address>
                </ContactBlock>
              </SectionReveal>
            )}

          </div>

          {/* Hours */}
          {business.hours?.weekdays && (
            <SectionReveal delay={80} className="mt-16 pt-12 border-t border-warm-200">
              <div className="max-w-sm">
                <p className="eyebrow text-warm-500 mb-6">Office Hours</p>
                <dl className="space-y-3">
                  <div className="flex justify-between gap-8 pb-3 border-b border-warm-100">
                    <dt className="text-warm-600 text-sm">Monday – Friday</dt>
                    <dd className="text-warm-900 text-sm font-medium">{business.hours.weekdays}</dd>
                  </div>
                  <div className="flex justify-between gap-8 pb-3 border-b border-warm-100">
                    <dt className="text-warm-600 text-sm">Saturday</dt>
                    <dd className="text-warm-400 text-sm">{business.hours.saturday}</dd>
                  </div>
                  <div className="flex justify-between gap-8">
                    <dt className="text-warm-600 text-sm">Sunday</dt>
                    <dd className="text-warm-400 text-sm">{business.hours.sunday}</dd>
                  </div>
                </dl>
              </div>
            </SectionReveal>
          )}
        </div>
      </section>

      {/* Send a message */}
      <section className="section-py bg-warm-50 border-t border-warm-200" aria-label="Send a message">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

            {/* Left: copy */}
            <SectionReveal className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-5">
                <span className="block w-8 h-px bg-brand-accent flex-shrink-0" aria-hidden="true" />
                <p className="eyebrow">Send a Message</p>
              </div>
              <h2 className="h-card mb-4">Let&rsquo;s Discuss Your Project</h2>
              <p className="text-warm-600 text-body-md leading-relaxed mb-8">
                Share a few details and we&rsquo;ll get back to you shortly. For urgent enquiries, call us directly and we&rsquo;ll help straight away.
              </p>

              {business.phone && (
                <Link href={`tel:${business.phone.replace(/\s/g, '')}`} className="btn-secondary">
                  {business.phone}
                </Link>
              )}
            </SectionReveal>

            {/* Right: form */}
            <SectionReveal delay={60} className="lg:col-span-7">
              <div className="card p-6 sm:p-8">
                <ContactForm />
              </div>
            </SectionReveal>

          </div>
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
  icon: 'phone' | 'email' | 'map'
  children: React.ReactNode
}) {
  return (
    <div className="pl-4 border-l-2 border-brand-accent/30">
      <div className="mb-3 text-brand-accent">
        {icon === 'phone' && (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
        )}
        {icon === 'email' && (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        )}
        {icon === 'map' && (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        )}
      </div>
      <p className="eyebrow text-warm-500 mb-2">{eyebrow}</p>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}
