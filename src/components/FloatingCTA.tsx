'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL } from '@/lib/site-data'

const DISMISS_KEY = 'indexbuilding_floatingcta_dismissed'
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export function FloatingCTA() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const hasTriggered = useRef(false)

  useEffect(() => {
    // Check reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)

    // Check dismiss state
    try {
      const stored = localStorage.getItem(DISMISS_KEY)
      if (stored) {
        const ts = parseInt(stored, 10)
        if (Date.now() - ts < DISMISS_DURATION) {
          setDismissed(true)
          return
        }
      }
    } catch {}

    const onScroll = () => {
      if (hasTriggered.current) return
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total > 0 && scrolled / total > 0.6) {
        hasTriggered.current = true
        setVisible(true)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const dismiss = () => {
    setVisible(false)
    setDismissed(true)
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString())
    } catch {}
  }

  if (dismissed || !visible) return null

  return (
    <div
      role="complementary"
      aria-label="Get in touch"
      className={[
        'fixed bottom-6 right-4 sm:right-6 z-50',
        'flex items-center gap-3',
        'text-warm-900',
        'rounded-full shadow-xl pl-4 pr-2 py-2 bg-white border border-warm-200',
        'max-w-[calc(100vw-2rem)]',
        // Safe area for iOS
        'pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]',
        reducedMotion ? '' : 'animate-slideUp',
      ].join(' ')}
    >
      <Link
        href={PRIMARY_CTA_HREF}
        className="text-sm font-medium whitespace-nowrap text-warm-900 hover:text-brand-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent rounded"
        onClick={dismiss}
      >
        {PRIMARY_CTA_LABEL}
      </Link>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-warm-100 hover:bg-warm-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-accent text-warm-600"
      >
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
