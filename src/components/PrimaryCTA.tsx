import Link from 'next/link'
import { PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL } from '@/lib/site-data'

interface PrimaryCTAProps {
  heading?: string
  body?: string
}

export function PrimaryCTA({
  heading = 'Ready to Start Your Project?',
  body = 'Contact us today to discuss your construction or renovation project. Our team is ready to bring your vision to life.',
}: PrimaryCTAProps) {
  return (
    <section
      className="bg-stone-900 text-white section-py"
      aria-label="Call to action"
    >
      <div className="container-site text-center max-w-2xl mx-auto">
        <h2 className="font-display font-semibold text-display-lg text-white mb-4">
          {heading}
        </h2>
        <p className="text-stone-300 text-body-lg leading-relaxed mb-8">
          {body}
        </p>
        <Link
          href={PRIMARY_CTA_HREF}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-stone-900 text-sm font-medium rounded-btn
          transition-all duration-150 hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
          active:scale-[0.98]"
        >
          {PRIMARY_CTA_LABEL}
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
