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
      className="bg-warm-900 section-py"
      aria-label="Call to action"
    >
      <div className="container-site text-center max-w-2xl mx-auto">
        {/* Decorative gold rule */}
        <div className="flex items-center justify-center gap-4 mb-8" aria-hidden="true">
          <span className="block h-px w-16 bg-brand-accent/40" />
          <span className="block w-1.5 h-1.5 rounded-full bg-brand-accent" />
          <span className="block h-px w-16 bg-brand-accent/40" />
        </div>

        <h2 className="font-display font-semibold text-display-lg text-white mb-5 tracking-tight">
          {heading}
        </h2>
        <p className="text-warm-300/80 text-body-lg leading-relaxed mb-10 max-w-lg mx-auto">
          {body}
        </p>
        <Link href={PRIMARY_CTA_HREF} className="btn-gold">
          {PRIMARY_CTA_LABEL}
        </Link>
      </div>
    </section>
  )
}
