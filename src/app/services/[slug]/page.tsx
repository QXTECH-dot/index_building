import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SectionReveal } from '@/components/SectionReveal'
import { PrimaryCTA } from '@/components/PrimaryCTA'
import { getServicesPage, SITE_URL } from '@/lib/site-data'

const servicesPage = getServicesPage()

export function generateStaticParams() {
  return servicesPage.items
    .filter(s => s.slug)
    .map(s => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const service = servicesPage.items.find(s => s.slug === params.slug)
  if (!service) return {}
  return {
    title: `${service.name} Canberra | Index Building Group`,
    description: service.description,
    alternates: { canonical: `${SITE_URL}/services/${service.slug}` },
    openGraph: {
      title: `${service.name} Canberra | Index Building Group`,
      description: service.description,
      url: `${SITE_URL}/services/${service.slug}`,
      images: service.image ? [{ url: service.image, alt: service.name }] : [],
    },
  }
}

const PROCESS_STEPS: Record<string, { title: string; detail: string }[]> = {
  'new-home-construction': [
    { title: 'Initial Consultation', detail: 'We meet to understand your vision, lifestyle needs, and budget. No obligation — just an honest conversation about what\'s possible.' },
    { title: 'Design & Approvals', detail: 'We coordinate your design documentation and manage the Development Application (DA) or Complying Development Certificate (CDC) process with the ACT Planning Authority.' },
    { title: 'Construction', detail: 'Your home is built by our team of licensed trades. We manage the entire schedule and keep you updated at every stage — from slab pour to frame, lock-up, fit-out, and finishing.' },
    { title: 'Handover', detail: 'We conduct a final walkthrough together, address any defects, and hand over your keys — along with all warranties and compliance documentation.' },
  ],
  'home-extensions': [
    { title: 'Site Assessment', detail: 'We visit your property to assess the existing structure, understand your goals, and identify any constraints — structural, planning, or otherwise.' },
    { title: 'Design & Approvals', detail: 'We coordinate design drawings and manage the planning approval process. Many extensions qualify for exempt or complying development, which can significantly reduce approval time.' },
    { title: 'Construction', detail: 'Our team builds your extension with minimal disruption to your daily life. We protect your existing home throughout the process and keep the site clean and safe.' },
    { title: 'Completion', detail: 'We complete all finishes, conduct a thorough inspection, and ensure the extension integrates seamlessly with your existing home before we sign off.' },
  ],
  'renovation-refurbishment': [
    { title: 'Scope & Quote', detail: 'We walk through your space together, discuss what you want to achieve, and produce a detailed scope of works with a fixed-price quote — no hidden extras.' },
    { title: 'Planning', detail: 'We schedule trades, order materials, and plan the sequence of work to minimise disruption. If approvals are needed, we manage them for you.' },
    { title: 'Renovation Works', detail: 'Our team executes the scope systematically — demolition, structural work, rough-in services, finishes — coordinating each trade to keep the project moving efficiently.' },
    { title: 'Finishing & Handover', detail: 'We complete all finishes to a high standard, conduct a final quality check, and hand over your refreshed space ready to enjoy.' },
  ],
  'knockdown-rebuild': [
    { title: 'Feasibility Assessment', detail: 'We assess your block, existing home, and council zoning to confirm a knockdown rebuild is the right path — and give you an honest picture of costs and timing before you commit.' },
    { title: 'Approvals & Demolition', detail: 'We manage all required permits, arrange asbestos testing and removal if needed, and carry out the full demolition and site clearing.' },
    { title: 'New Home Construction', detail: 'Your new home is built from the ground up — with the same rigorous project management and quality standards as our new home construction service.' },
    { title: 'Handover', detail: 'We complete all final inspections, hand over keys and documentation, and walk you through your brand new home on the block you\'ve always loved.' },
  ],
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = servicesPage.items.find(s => s.slug === params.slug)
  if (!service) notFound()

  const steps = PROCESS_STEPS[service.slug] ?? []
  const otherServices = servicesPage.items.filter(s => s.slug !== service.slug)

  return (
    <>
      {/* ── Page header ── */}
      <div className="bg-warm-50 pt-14 pb-16 border-b border-warm-200">
        <div className="container-site">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-brand-accent flex-shrink-0" aria-hidden="true" />
              <Link href="/services" className="eyebrow hover:text-brand-accent transition-colors">
                Our Services
              </Link>
            </div>
            <h1 className="font-display font-semibold text-display-xl text-warm-900 tracking-tight max-w-2xl mb-4">
              {service.name}
            </h1>
            <p className="text-warm-600 text-base max-w-xl leading-relaxed">
              {service.description}
            </p>
          </SectionReveal>
        </div>
      </div>

      {/* ── Main content ── */}
      <section className="section-py bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left: body copy */}
            <div className="lg:col-span-7 space-y-8">
              <SectionReveal>
                {(service.body ?? []).map((para, i) => (
                  <p key={i} className="text-warm-600 text-body-md leading-relaxed mb-5 last:mb-0">
                    {para}
                  </p>
                ))}
              </SectionReveal>

              {/* Features */}
              {(service.features ?? []).length > 0 && (
                <SectionReveal delay={60}>
                  <div className="bg-warm-50 rounded-card p-6 sm:p-8 border border-warm-200">
                    <p className="eyebrow text-warm-500 mb-5">What&rsquo;s included</p>
                    <ul className="space-y-3">
                      {(service.features ?? []).map((f, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-1 w-4 h-4 rounded-full bg-brand-accent/15 flex items-center justify-center flex-shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                          </span>
                          <span className="text-warm-700 text-sm leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SectionReveal>
              )}

              <SectionReveal delay={80}>
                <Link href="/contact" className="btn-primary">
                  Discuss Your Project
                </Link>
              </SectionReveal>
            </div>

            {/* Right: image */}
            {service.image && (
              <SectionReveal delay={40} className="lg:col-span-5">
                <div className="relative aspect-[4/3] rounded-card overflow-hidden bg-warm-100 ring-1 ring-brand-accent/15 shadow-card sticky top-28">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover scale-[1.22]"
                    sizes="(max-width: 1024px) 100vw, 41vw"
                    loading="lazy"
                  />
                </div>
              </SectionReveal>
            )}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      {steps.length > 0 && (
        <section className="section-py bg-warm-50 border-t border-warm-200">
          <div className="container-site">
            <SectionReveal>
              <div className="flex items-center gap-3 mb-4">
                <span className="block w-8 h-px bg-brand-accent flex-shrink-0" aria-hidden="true" />
                <p className="eyebrow">How It Works</p>
              </div>
              <h2 className="h-section mb-12 max-w-xl">Our process, step by step</h2>
            </SectionReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <SectionReveal key={i} delay={i * 60}>
                  <div className="relative bg-white rounded-card p-6 border border-warm-200 shadow-card h-full">
                    <div className="w-8 h-8 rounded-full bg-brand-accent text-warm-900 flex items-center justify-center text-xs font-bold mb-4 flex-shrink-0">
                      {i + 1}
                    </div>
                    <h3 className="font-display font-semibold text-warm-900 text-base mb-2">{step.title}</h3>
                    <p className="text-warm-500 text-sm leading-relaxed">{step.detail}</p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Other services ── */}
      <section className="section-py bg-white border-t border-warm-200">
        <div className="container-site">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-8 h-px bg-brand-accent flex-shrink-0" aria-hidden="true" />
              <p className="eyebrow">Also Consider</p>
            </div>
            <h2 className="h-section mb-10 max-w-xl">Other services we offer</h2>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otherServices.map((s, i) => (
              <SectionReveal key={s.slug} delay={i * 60}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group block bg-warm-50 rounded-card border border-warm-200 overflow-hidden hover:border-brand-accent/40 hover:shadow-card transition-all duration-300 cursor-pointer"
                >
                  {s.image && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={s.image}
                        alt={s.name}
                        fill
                        className="object-cover scale-[1.22] group-hover:scale-[1.28] transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 33vw"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-warm-900 text-base mb-1 group-hover:text-brand-accent transition-colors">
                      {s.name}
                    </h3>
                    <p className="text-warm-500 text-sm line-clamp-2">{s.description}</p>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <PrimaryCTA
        heading="Ready to get started?"
        body={`Talk to us about your ${service.name.toLowerCase()} project. We'll listen, ask the right questions, and give you an honest assessment of what's possible.`}
      />
    </>
  )
}
