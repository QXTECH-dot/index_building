import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 pt-20">
      <div className="text-center max-w-md">
        <p className="text-stone-300 font-display font-semibold text-8xl mb-6 tracking-tight">
          404
        </p>
        <h1 className="font-display font-semibold text-2xl text-stone-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-stone-500 text-base mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
