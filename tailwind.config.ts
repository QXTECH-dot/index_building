import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        brand: {
          DEFAULT: '#1a1a1a',
          light: '#2d2d2d',
          accent: '#c9a96e', // warm gold accent
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem,5vw,3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem,4vw,2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.5rem,3vw,2rem)', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body-md': ['1rem', { lineHeight: '1.7' }],
      },
      maxWidth: {
        container: '1240px',
      },
      spacing: {
        section: '6rem',
        'section-sm': '4rem',
      },
      borderRadius: {
        card: '1rem',
        btn: '0.375rem',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 150ms ease-out forwards',
        fadeIn: 'fadeIn 150ms ease-out forwards',
        slideUp: 'slideUp 180ms ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
