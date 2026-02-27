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
    const handler = () => setScrolled(window.scrollY > 24)
    handler() // run on mount
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 will-change-[height,background]',
        scrolled
          ? 'bg-white/96 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)] h-16'
          : 'bg-transparent h-20'
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
              className={cn(
                'h-8 w-auto object-contain transition-all duration-300',
                !scrolled && 'brightness-0 invert'
              )}
              loading="lazy"
            />
          ) : (
            <span className={cn(
              'font-display font-semibold text-lg tracking-tight transition-colors duration-300',
              scrolled ? 'text-stone-900' : 'text-white'
            )}>
              Index Building
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navItems.filter(i => i.href !== '/').map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative text-sm font-medium transition-colors duration-150 py-1',
                  'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:rounded',
                  'after:transition-all after:duration-150',
                  isActive
                    ? (scrolled ? 'text-stone-900 after:bg-stone-900' : 'text-white after:bg-white')
                    : (scrolled ? 'text-stone-500 hover:text-stone-900 after:bg-transparent hover:after:bg-stone-200' : 'text-white/70 hover:text-white after:bg-transparent hover:after:bg-white/40')
                )}
              >
                {item.label}
              </Link>
            )
          })}
          <Link
            href={PRIMARY_CTA_HREF}
            className={cn(
              'btn-primary text-sm px-5 py-2.5 transition-all duration-150',
              !scrolled && 'bg-white text-stone-900 hover:bg-stone-100'
            )}
          >
            {PRIMARY_CTA_LABEL}
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className={cn(
            'md:hidden p-2 -mr-2 transition-colors',
            scrolled ? 'text-stone-600 hover:text-stone-900' : 'text-white hover:text-white/70'
          )}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-controls="mobile-menu"
        >
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
        <nav
          id="mobile-menu"
          className="md:hidden bg-white border-t border-stone-100 shadow-lg"
          aria-label="Mobile navigation"
        >
          <div className="container-site py-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-stone-100 text-stone-900'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link href={PRIMARY_CTA_HREF} className="btn-primary mt-2 text-center text-sm">
              {PRIMARY_CTA_LABEL}
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
