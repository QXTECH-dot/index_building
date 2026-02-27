'use client'

import { useEffect, useRef, type ReactNode, type ElementType } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
  as?: ElementType
}

export function SectionReveal({ children, className, delay = 0, as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

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

  // Use any to allow dynamic tag + ref combination
  const Comp = Tag as React.ElementType<{ ref: React.Ref<HTMLElement>; className: string }>
  return (
    <Comp ref={ref} className={cn('reveal', className)}>
      {children}
    </Comp>
  )
}
