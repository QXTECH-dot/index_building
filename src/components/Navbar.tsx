'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getNav, getLogo, getServicesPage } from '@/lib/site-data'

const navItems = getNav()
const logo = getLogo()
const services = getServicesPage().items.filter(s => s.slug)

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 32)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMenuOpen(false); setServicesOpen(false) }, [pathname])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isServicesActive = pathname.startsWith('/services')

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 will-change-[height,background,box-shadow]',
        scrolled
          ? 'bg-white shadow-[0_1px_0_0_rgba(201,169,110,0.18),0_2px_16px_rgba(38,26,15,0.07)] h-12'
          : 'bg-white shadow-[0_1px_0_0_rgba(201,169,110,0.10)] h-14'
      )}
      role="banner"
    >
      <div className="container-site h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Index Building – Home"
          className="flex items-center gap-2 flex-shrink-0"
        >
          {logo ? (
            <Image
              src={logo}
              alt="Index Building"
              width={160}
              height={40}
              className="h-8 w-auto object-contain"
              loading="lazy"
            />
          ) : (
            <span className="font-display font-semibold text-[1.05rem] tracking-tight text-warm-900 transition-colors duration-300 hover:text-brand-accent">
              Index Building
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navItems.map((item) => {
            const isServices = item.href === '/services'
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

            if (isServices) {
              return (
                <div key={item.href} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setServicesOpen(v => !v)}
                    onMouseEnter={() => setServicesOpen(true)}
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    className={cn(
                      'relative flex items-center gap-1 text-[0.8125rem] font-medium tracking-wide transition-colors duration-300 py-1',
                      'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:rounded-full',
                      'after:transition-all after:duration-300',
                      isServicesActive
                        ? 'text-brand-accent after:bg-brand-accent'
                        : 'text-warm-600 hover:text-warm-900 after:bg-transparent hover:after:bg-brand-accent/50'
                    )}
                  >
                    {item.label}
                    <svg
                      className={cn('w-3.5 h-3.5 transition-transform duration-200', servicesOpen && 'rotate-180')}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown panel */}
                  {servicesOpen && (
                    <div
                      onMouseLeave={() => setServicesOpen(false)}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-card shadow-card-hover border border-warm-200 overflow-hidden z-50"
                    >
                      <div className="p-2">
                        <Link
                          href="/services"
                          className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold tracking-widest uppercase text-warm-400 hover:text-brand-accent hover:bg-warm-50 transition-colors mb-1"
                        >
                          All Services
                        </Link>
                        <div className="h-px bg-warm-200 mx-3 mb-2" />
                        {services.map(s => (
                          <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            className={cn(
                              'flex flex-col px-3 py-2.5 rounded-md transition-all duration-200 group',
                              pathname === `/services/${s.slug}`
                                ? 'bg-warm-50 text-brand-accent'
                                : 'text-warm-700 hover:bg-warm-50 hover:text-warm-900'
                            )}
                          >
                            <span className="text-sm font-medium group-hover:text-brand-accent transition-colors">{s.name}</span>
                            <span className="text-xs text-warm-400 mt-0.5 line-clamp-1">{s.description}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative text-[0.8125rem] font-medium tracking-wide transition-colors duration-300 py-1',
                  'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:rounded-full',
                  'after:transition-all after:duration-300',
                  isActive
                    ? 'text-brand-accent after:bg-brand-accent'
                    : 'text-warm-600 hover:text-warm-900 after:bg-transparent hover:after:bg-brand-accent/50'
                )}
              >
                {item.label}
              </Link>
            )
          })}

          {/* CTA Button */}
          <Link
            href="/contact"
            className={cn(
              'ml-2 inline-flex items-center justify-center gap-1.5',
              'px-5 py-2 rounded-btn',
              'bg-brand-accent text-warm-900 text-[0.75rem] font-semibold tracking-[0.1em] uppercase',
              'transition-all duration-300',
              'hover:bg-brand-accent-light hover:shadow-[0_4px_16px_rgba(201,169,110,0.4)] hover:-translate-y-px',
              'active:translate-y-0 active:scale-[0.99]',
            )}
          >
            Get a Quote
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 -mr-2 transition-colors text-warm-600 hover:text-warm-900"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-controls="mobile-menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav id="mobile-menu" className="md:hidden bg-white border-t border-warm-200/60" aria-label="Mobile navigation">
          <div className="container-site py-5 flex flex-col gap-1">
            {navItems.map((item) => {
              const isServices = item.href === '/services'
              const isActive = pathname === item.href

              if (isServices) {
                return (
                  <div key={item.href}>
                    <button
                      onClick={() => setMobileServicesOpen(v => !v)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-3 text-sm font-medium transition-colors',
                        isServicesActive ? 'text-brand-accent' : 'text-warm-600 hover:text-warm-900'
                      )}
                    >
                      {item.label}
                      <svg
                        className={cn('w-4 h-4 transition-transform duration-200', mobileServicesOpen && 'rotate-180')}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {mobileServicesOpen && (
                      <div className="ml-4 border-l-2 border-warm-200 pl-3 mb-1 space-y-0.5">
                        <Link
                          href="/services"
                          className="block px-2 py-1.5 text-xs font-semibold tracking-widest uppercase text-warm-400 hover:text-brand-accent transition-colors"
                        >
                          All Services
                        </Link>
                        {services.map(s => (
                          <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            className={cn(
                              'block px-2 py-2 text-sm transition-colors rounded',
                              pathname === `/services/${s.slug}`
                                ? 'text-brand-accent font-medium'
                                : 'text-warm-600 hover:text-warm-900'
                            )}
                          >
                            {s.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'px-3 py-3 text-sm font-medium transition-colors',
                    isActive ? 'text-brand-accent' : 'text-warm-600 hover:text-warm-900'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}

            <Link href="/contact" className="mt-3 btn-gold w-full text-center">
              Get a Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
