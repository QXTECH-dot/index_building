import Link from 'next/link'
import { getBusiness, getNav, getServicesPage } from '@/lib/site-data'

const business = getBusiness()
const navItems = getNav()
const services = getServicesPage()

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-warm-900 border-t border-warm-800" aria-label="Footer">
      {/* Gold accent top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" aria-hidden="true" />

      <div className="container-site py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <p className="font-display font-semibold text-white text-xl tracking-tight mb-2">
              Index Building
            </p>
            <div className="divider-gold mb-5" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-warm-400 max-w-xs">
              {business.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="eyebrow mb-5">Navigation</p>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-warm-400 hover:text-brand-accent transition-colors duration-300"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Services */}
          <div>
            <p className="eyebrow mb-5">Services</p>
            <ul className="space-y-3">
              {services.items.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-warm-400 hover:text-brand-accent transition-colors duration-300"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="eyebrow mb-5">Get in Touch</p>
            <address className="not-italic space-y-3">
              {business.address && (
                <p className="text-sm text-warm-400 leading-relaxed">{business.address}</p>
              )}
              {business.phone && (
                <a
                  href={`tel:${business.phone.replace(/\s/g, '')}`}
                  className="block text-sm text-warm-400 hover:text-brand-accent transition-colors duration-300"
                >
                  {business.phone}
                </a>
              )}
              {business.email && (
                <a
                  href={`mailto:${business.email}`}
                  className="block text-sm text-warm-400 hover:text-brand-accent transition-colors duration-300"
                >
                  {business.email}
                </a>
              )}
              {business.hours?.weekdays && (
                <p className="text-sm text-warm-500 mt-4 pt-4 border-t border-warm-800">
                  Mon–Fri &nbsp;·&nbsp; {business.hours.weekdays}
                </p>
              )}
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-warm-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-warm-600">
            © {currentYear} Index Building. All rights reserved.
          </p>
          {business.area && (
            <p className="text-xs text-warm-600 tracking-wide">
              {business.area}
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
