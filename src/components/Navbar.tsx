'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getNav, getLogo, PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL } from '@/lib/site-data'

const navItems = getNav()
const logo = getLogo()

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-sm h-16'
          : 'bg-white/80 backdrop-blur-sm h-20'
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
              width={140}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          ) : (
            <span className="font-display font-semibold text-lg tracking-tight text-stone-900">
              Index Building
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors duration-150',
                pathname === item.href
                  ? 'text-stone-900'
                  : 'text-stone-500 hover:text-stone-900'
              )}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link href={PRIMARY_CTA_HREF} className="btn-primary text-sm px-5 py-2.5">
            {PRIMARY_CTA_LABEL}
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 -mr-2 text-stone-600 hover:text-stone-900 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-controls="mobile-menu"
        >
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
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
        <div
          id="mobile-menu"
          className="md:hidden bg-white border-t border-stone-100 shadow-md"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <nav className="container-site py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-stone-100 text-stone-900'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                )}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={PRIMARY_CTA_HREF}
              className="btn-primary mt-2 text-center text-sm"
            >
              {PRIMARY_CTA_LABEL}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
