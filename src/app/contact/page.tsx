import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'
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
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
              Get In Touch
            </p>
            <h1 className="font-display font-semibold text-display-xl text-white tracking-tight">
              {contact.h1}
            </h1>
          </SectionReveal>
        </div>
      </div>

      {/* Contact section */}
      <section className="section-py bg-white" aria-label="Contact information and form">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Contact info */}
            <SectionReveal className="lg:col-span-4">
              <div className="space-y-8">
                <div>
                  <h2 className="font-display font-semibold text-xl text-stone-900 mb-5">
                    Office Details
                  </h2>
                  <address className="not-italic space-y-4">
                    <ContactDetail
                      label="Address"
                      value={business.address}
                      icon={
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      }
                    />
                    <ContactDetail
                      label="Phone"
                      value={business.phone}
                      href={`tel:${business.phone.replace(/\s/g, '')}`}
                      icon={
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      }
                    />
                    <ContactDetail
                      label="Email"
                      value={business.email}
                      href={`mailto:${business.email}`}
                      icon={
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      }
                    />
                  </address>
                </div>

                <div>
                  <h3 className="font-medium text-stone-900 mb-3 text-sm uppercase tracking-wider">
                    Office Hours
                  </h3>
                  <dl className="space-y-1.5 text-sm text-stone-600">
                    <div className="flex justify-between gap-4">
                      <dt>Monday – Friday</dt>
                      <dd className="text-stone-900 font-medium">{business.hours.weekdays}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Saturday</dt>
                      <dd className="text-stone-400">{business.hours.saturday}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Sunday</dt>
                      <dd className="text-stone-400">{business.hours.sunday}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </SectionReveal>

            {/* Form */}
            <SectionReveal delay={60} className="lg:col-span-8">
              <div>
                <h2 className="font-display font-semibold text-xl text-stone-900 mb-6">
                  Send Us a Message
                </h2>
                <ContactForm />
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </>
  )
}

function ContactDetail({
  label,
  value,
  href,
  icon,
}: {
  label: string
  value: string
  href?: string
  icon: React.ReactNode
}) {
  const content = (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center">
        <svg className="w-4 h-4 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          {icon}
        </svg>
      </div>
      <div>
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-stone-700 text-sm leading-relaxed">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block hover:opacity-75 transition-opacity">
        {content}
      </a>
    )
  }
  return <div>{content}</div>
}
