'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  className?: string
  delay?: number // ms
  as?: keyof JSX.IntrinsicElements
}

export function SectionReveal({ children, className, delay = 0, as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect reduced motion - just show immediately
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      el.style.opacity = '1'
      el.style.transform = 'none'
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.classList.add('visible')
            }, delay)
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  const Comp = Tag as React.ElementType
  return (
    <Comp
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn('reveal', className)}
    >
      {children}
    </Comp>
  )
}
