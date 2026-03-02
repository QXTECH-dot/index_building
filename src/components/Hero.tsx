'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getBusiness, PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL } from '@/lib/site-data'

interface HeroProps {
  h1: string
  subtitle?: string
  imageSrc: string
  imageSrcs?: string[]
  imageAlt: string
}

const business = getBusiness()
const INTERVAL_MS = 3000

export function Hero({ h1, subtitle, imageSrc, imageSrcs = [], imageAlt }: HeroProps) {
  const images = Array.from(new Set([imageSrc, ...imageSrcs])).filter(Boolean) as string[]
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const busyRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const goTo = useCallback(
    (next: number, dir: 'left' | 'right') => {
      if (busyRef.current || next === current) return
      busyRef.current = true
      setDirection(dir)
      setPrev(current)
      setCurrent(next)
      setTimeout(() => {
        setPrev(null)
        busyRef.current = false
      }, 500)
    },
    [current],
  )

  const next = useCallback(() => {
    goTo((current + 1) % images.length, 'right')
  }, [current, images.length, goTo])

  const prevSlide = useCallback(() => {
    goTo((current - 1 + images.length) % images.length, 'left')
  }, [current, images.length, goTo])

  // Auto-advance
  useEffect(() => {
    if (images.length <= 1 || reducedMotion.current) return
    timerRef.current = setInterval(next, INTERVAL_MS)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [next, images.length])

  // Pause on hover
  const pause = () => { if (timerRef.current) clearInterval(timerRef.current) }
  const resume = () => {
    if (images.length <= 1 || reducedMotion.current) return
    timerRef.current = setInterval(next, INTERVAL_MS)
  }

  if (images.length === 0) return null

  return (
    <section
      className="relative flex items-center overflow-hidden"
      style={{ height: 'calc(100dvh - 3.5rem)', backgroundColor: '#2d2926' }}
      aria-label="Hero"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* ── Slides ── */}
      <div className="absolute inset-0 z-0">
        {images.map((src, idx) => {
          const isCurrent = idx === current
          const isPrev = idx === prev

          if (!isCurrent && !isPrev) return null

          let animClass = ''
          if (isCurrent && prev !== null) {
            animClass = direction === 'right' ? 'animate-slideInRight' : 'animate-slideInLeft'
          } else if (isPrev) {
            animClass = direction === 'right' ? 'animate-slideOutLeft' : 'animate-slideOutRight'
          }

          return (
            <div
              key={src + idx}
              className={`absolute inset-0 ${isCurrent ? 'z-10' : 'z-0'} ${animClass}`}
              aria-hidden={!isCurrent}
            >
              <Image
                src={src}
                alt={idx === 0 ? imageAlt : ''}
                fill
                className="object-cover object-center"
                priority={idx === 0}
                sizes="100vw"
                quality={90}
                loading={idx === 0 ? undefined : 'lazy'}
              />
            </div>
          )
        })}

        {/* Warm cinematic overlay */}
        <div
          className="absolute inset-0 z-20"
          style={{
            background:
              'linear-gradient(105deg, rgba(29,23,20,0.82) 0%, rgba(29,23,20,0.55) 52%, rgba(29,23,20,0.18) 100%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-48 z-20"
          style={{ background: 'linear-gradient(to top, rgba(29,23,20,0.50) 0%, transparent 100%)' }}
          aria-hidden="true"
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-30 container-site py-20">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-8 h-px bg-brand-accent flex-shrink-0" aria-hidden="true" />
            <p className="eyebrow text-brand-accent/90">{business.area}</p>
          </div>

          <h1 className="h-display text-white mb-6">{h1}</h1>

          {subtitle && (
            <p className="text-warm-300/90 text-[1.05rem] md:text-[1.1rem] leading-relaxed mb-10 max-w-[500px] font-light">
              {subtitle}
            </p>
          )}

          <div className="flex flex-wrap gap-4">
            <Link href={PRIMARY_CTA_HREF} className="btn-gold">{PRIMARY_CTA_LABEL}</Link>
            <Link href="/projects" className="btn-ghost">View Our Work</Link>
          </div>
        </div>
      </div>

      {/* ── Prev / Next arrows ── */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-sm transition-all duration-300 hover:bg-brand-accent hover:border-brand-accent hover:text-warm-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-sm transition-all duration-300 hover:bg-brand-accent hover:border-brand-accent hover:text-warm-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* ── Dot indicators ── */}
      {images.length > 1 && (
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2"
          role="tablist"
          aria-label="Slide indicators"
        >
          {images.map((_, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={idx === current}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => goTo(idx, idx > current ? 'right' : 'left')}
              className={[
                'transition-all duration-300 rounded-full',
                idx === current
                  ? 'w-6 h-1.5 bg-brand-accent'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70',
              ].join(' ')}
            />
          ))}
        </div>
      )}
    </section>
  )
}
