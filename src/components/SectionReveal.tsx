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

    // Reduced motion – leave content visible, skip animation entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // If the element is already in the viewport on mount, don't hide it
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight - 20) return

    // Element is below the fold – apply hide state via JS only (never SSR)
    el.style.opacity = '0'
    el.style.transform = 'translateY(10px)'
    el.style.transition = `opacity 160ms ease-out ${delay}ms, transform 160ms ease-out ${delay}ms`

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
            observer.unobserve(el)
          }
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  const Comp = Tag as React.ElementType<{ ref: React.Ref<HTMLElement>; className?: string }>
  return (
    <Comp ref={ref} className={cn(className)}>
      {children}
    </Comp>
  )
}
