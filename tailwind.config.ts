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
        // Stone-grey palette — professional construction aesthetic
        warm: {
          50:  '#f8f6f3',  // lightest stone — body background
          100: '#f0ede8',  // light stone — alternate section bg
          200: '#e0dcd7',  // stone border / divider
          300: '#c6c1ba',  // stone sand
          400: '#a89f98',  // stone tan
          500: '#8c8279',  // stone medium — muted text
          600: '#6b6560',  // stone dark-mid
          700: '#4e4944',  // stone dark
          800: '#3a3530',  // stone very dark
          900: '#2d2926',  // charcoal — main dark bg / headings
          950: '#1a1714',  // deepest charcoal
        },
        brand: {
          DEFAULT: '#2d2926',       // charcoal
          surface: '#3a3530',       // dark stone surface
          light: '#4e4944',
          accent: '#c9a96e',        // gold — signature accent
          'accent-light': '#dfc08a',
          'accent-muted': 'rgba(201,169,110,0.15)',
        },
      },
      fontFamily: {
        // SF Pro on Apple devices, Inter as fallback — same strategy as apple.com
        sans: ['-apple-system', 'BlinkMacSystemFont', 'var(--font-inter)', 'system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', 'var(--font-inter)', 'system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(3rem,6vw,4.5rem)', { lineHeight: '1.02', letterSpacing: '-0.04em' }],
        'display-xl':  ['clamp(2.5rem,5vw,3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-lg':  ['clamp(2rem,4vw,2.75rem)',   { lineHeight: '1.1',  letterSpacing: '-0.025em' }],
        'display-md':  ['clamp(1.5rem,3vw,2rem)',    { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body-md': ['1rem',     { lineHeight: '1.7'  }],
      },
      maxWidth: {
        container: '1240px',
      },
      spacing: {
        section:    '7rem',
        'section-sm': '4.5rem',
      },
      borderRadius: {
        card: '0.25rem',
        btn:  '0.25rem',
      },
      boxShadow: {
        'card':      '0 2px 16px rgba(0,0,0,0.06)',
        'card-hover':'0 12px 40px rgba(0,0,0,0.13)',
        'gold':      '0 0 0 2px rgba(201,169,110,0.45)',
        'warm-dark': '0 4px 24px rgba(38,26,15,0.25)',
      },
      transitionDuration: {
        DEFAULT: '300ms',
        '150': '150ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heroFade: {
          '0%':    { opacity: '0' },
          '6%':    { opacity: '1' },
          '24%':   { opacity: '1' },
          '32%':   { opacity: '0' },
          '100%':  { opacity: '0' },
        },
        goldPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '1'   },
        },
        slideInRight: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutLeft: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        slideOutRight: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        fadeUp:       'fadeUp 500ms cubic-bezier(0.25,0.1,0.25,1) forwards',
        fadeIn:       'fadeIn 400ms ease-out forwards',
        slideUp:      'slideUp 500ms cubic-bezier(0.25,0.1,0.25,1) forwards',
        goldPulse:    'goldPulse 3s ease-in-out infinite',
        slideInRight: 'slideInRight 500ms cubic-bezier(0.25,0.1,0.25,1) forwards',
        slideInLeft:  'slideInLeft 500ms cubic-bezier(0.25,0.1,0.25,1) forwards',
        slideOutLeft: 'slideOutLeft 500ms cubic-bezier(0.25,0.1,0.25,1) forwards',
        slideOutRight:'slideOutRight 500ms cubic-bezier(0.25,0.1,0.25,1) forwards',
      },
    },
  },
  plugins: [],
}

export default config
