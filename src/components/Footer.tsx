import Link from 'next/link'
import { getBusiness, getNav, SITE_URL } from '@/lib/site-data'

const business = getBusiness()
const navItems = getNav()

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-stone-900 text-stone-300" aria-label="Footer">
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <p className="font-display font-semibold text-white text-lg mb-3">
              Index Building
            </p>
            <p className="text-sm leading-relaxed text-stone-400 max-w-xs">
              {business.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">
              Navigation
            </p>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-stone-400 hover:text-white transition-colors duration-150"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">
              Get in Touch
            </p>
            <address className="not-italic space-y-2">
              <p className="text-sm text-stone-400">{business.address}</p>
              <a
                href={`tel:${business.phone.replace(/\s/g, '')}`}
                className="block text-sm text-stone-400 hover:text-white transition-colors duration-150"
              >
                {business.phone}
              </a>
              <a
                href={`mailto:${business.email}`}
                className="block text-sm text-stone-400 hover:text-white transition-colors duration-150"
              >
                {business.email}
              </a>
              <p className="text-sm text-stone-500 mt-3">
                Mon–Fri: {business.hours.weekdays}
              </p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-500">
            © {currentYear} Index Building. All rights reserved. ABN registered in Canberra, ACT.
          </p>
          <p className="text-xs text-stone-600">
            Serving Canberra &amp; surrounds
          </p>
        </div>
      </div>
    </footer>
  )
}
