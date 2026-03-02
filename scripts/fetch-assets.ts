#!/usr/bin/env tsx
/**
 * Crawls http://www.indexbuilding.com.au/ and:
 * - downloads referenced assets into /public/assets/www/** (preserving correct file types)
 * - saves HTML snapshots into /_source_snapshots
 * - writes structured JSON into /_content/site.json
 */
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'
import { chromium } from 'playwright'

const ORIGIN = 'http://www.indexbuilding.com.au'
const ASSETS_ROOT = path.join(process.cwd(), 'public/assets/www')
const CONTENT_DIR = path.join(process.cwd(), '_content')
const SNAPSHOTS_DIR = path.join(process.cwd(), '_source_snapshots')

const PAGES: { slug: 'home' | 'about' | 'projects' | 'contact'; path: string }[] = [
  { slug: 'home', path: '/' },
  { slug: 'about', path: '/about-us/' },
  { slug: 'projects', path: '/projects/' },
  { slug: 'contact', path: '/contact-us/' },
]

for (const d of [ASSETS_ROOT, CONTENT_DIR, SNAPSHOTS_DIR]) {
  fs.mkdirSync(d, { recursive: true })
}

type FetchResult = { buffer: Buffer; contentType: string | null }

function fetchUrl(url: string): Promise<FetchResult> {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http
    const req = proto.get(url, { timeout: 30000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location
        if (loc) {
          fetchUrl(loc.startsWith('http') ? loc : new URL(loc, url).href)
            .then(resolve).catch(reject)
        } else {
          reject(new Error('Redirect with no location'))
        }
        return
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`))
        return
      }
      const contentType = (res.headers['content-type'] || null) as string | null
      const chunks: Buffer[] = []
      res.on('data', (c: Buffer) => chunks.push(c))
      res.on('end', () => {
        resolve({ buffer: Buffer.concat(chunks), contentType })
      })
      res.on('error', reject)
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')) })
  })
}

function extFromContentType(contentType: string | null): string | null {
  if (!contentType) return null
  const t = contentType.split(';')[0].trim().toLowerCase()
  if (t === 'image/jpeg') return '.jpg'
  if (t === 'image/png') return '.png'
  if (t === 'image/webp') return '.webp'
  if (t === 'image/avif') return '.avif'
  if (t === 'image/gif') return '.gif'
  if (t === 'image/svg+xml') return '.svg'
  if (t === 'image/x-icon' || t === 'image/vnd.microsoft.icon') return '.ico'
  return null
}

function extFromBuffer(buffer: Buffer): string | null {
  // Magic numbers
  if (buffer.length >= 12) {
    // PNG
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return '.png'
    // JPEG
    if (buffer[0] === 0xff && buffer[1] === 0xd8) return '.jpg'
    // GIF
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return '.gif'
    // WEBP (RIFF....WEBP)
    if (
      buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
    ) return '.webp'
    // SVG (text)
    const head = buffer.subarray(0, Math.min(buffer.length, 200)).toString('utf8').trimStart()
    if (head.startsWith('<svg') || head.startsWith('<?xml')) return '.svg'
  }
  return null
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|section|article|header|footer|h1|h2|h3|h4|h5|h6|li)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function extractFirst(html: string, re: RegExp): string | null {
  const m = html.match(re)
  return m?.[1]?.trim() || null
}

function toLocalPathForAssetPath(
  assetPath: string,
  contentType: string | null,
  buffer: Buffer
): { localPath: string; destAbs: string } {
  // assetPath is URL path (starts with /)
  const baseDest = path.join(ASSETS_ROOT, assetPath.replace(/^\//, ''))
  const baseLocal = `/assets/www${assetPath}`

  const currentExt = path.extname(assetPath)
  const ext = extFromContentType(contentType) || extFromBuffer(buffer)

  if (!currentExt && ext) {
    return {
      localPath: `${baseLocal}${ext}`,
      destAbs: `${baseDest}${ext}`,
    }
  }

  // If the URL has an extension but the bytes say otherwise, prefer the content-type extension.
  if (currentExt && ext && currentExt.toLowerCase() !== ext) {
    const noExt = assetPath.slice(0, -currentExt.length)
    const destNoExt = baseDest.slice(0, -currentExt.length)
    return {
      localPath: `/assets/www${noExt}${ext}`,
      destAbs: `${destNoExt}${ext}`,
    }
  }

  return { localPath: baseLocal, destAbs: baseDest }
}

async function main() {
  console.log(`Crawling ${ORIGIN}...\n`)

  const htmlBySlug = new Map<string, string>()
  const pageDataBySlug = new Map<string, any>()
  const assetUrls = new Set<string>()

  const browser = await chromium.launch({ headless: true })

  for (const p of PAGES) {
    const url = `${ORIGIN}${p.path}`
    try {
      const page = await browser.newPage()
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
      // Images on the source site are lazy-loaded and can populate after `networkidle`.
      // Give the page a small grace period, longer on the Projects gallery.
      await page.waitForTimeout(p.slug === 'projects' ? 3000 : 1200)

      const html = await page.content()
      htmlBySlug.set(p.slug, html)
      fs.writeFileSync(path.join(SNAPSHOTS_DIR, `${p.slug}.html`), html, 'utf-8')

      const data = await page.evaluate(() => {
        const metaDescription =
          (document.querySelector('meta[name=\"description\"]') as HTMLMetaElement | null)?.content || ''

        const header = document.querySelector('header') || document.querySelector('.header') || document.querySelector('[data-widget=\"header\"]')
        const headerLogo = header?.querySelector('a.logo__link img') as HTMLImageElement | null
        const logoSrc = headerLogo ? (headerLogo.currentSrc || headerLogo.src) : ''

        const navLinks = header
          ? [...header.querySelectorAll('a')]
            .map((a) => ({ label: (a.textContent || '').trim(), href: (a as HTMLAnchorElement).href }))
            .filter((x) => x.label && x.href)
          : []

        const imgs = [...document.querySelectorAll('img')]
          .map((img) => ({
            src: (img as HTMLImageElement).currentSrc || (img as HTMLImageElement).src,
            alt: (img as HTMLImageElement).alt || '',
            w: (img as HTMLImageElement).naturalWidth || 0,
            h: (img as HTMLImageElement).naturalHeight || 0,
            className: (img as HTMLImageElement).className || '',
          }))
          .filter((i) => i.src)

        // Primary text blocks (best-effort: large headings + paragraphs)
        const headings = [...document.querySelectorAll('h1, h2, h3')]
          .map((h) => (h.textContent || '').trim())
          .filter(Boolean)

        const paragraphs = [...document.querySelectorAll('p')]
          .map((p) => (p.textContent || '').trim())
          .filter((t) => t.length >= 30)

        const emails = (document.body.textContent || '').match(/[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}/g) || []
        const phones =
          (document.body.textContent || '')
            .match(/(\\+?61[\\s\\-]?\\d[\\s\\-]?\\d{3,4}[\\s\\-]?\\d{3,4}|\\(0\\d\\)[\\s\\-]?\\d{4}[\\s\\-]?\\d{4}|0\\d{9})/g) || []

        return {
          title: document.title || '',
          metaDescription,
          headings,
          paragraphs,
          navLinks,
          logoSrc,
          imgs,
          emails: [...new Set(emails)],
          phones: [...new Set(phones)],
        }
      })

      pageDataBySlug.set(p.slug, data)
      console.log(`  ✓ Snapshot ${p.slug}`)
      await page.close()
    } catch (err) {
      console.warn(`  ✗ Snapshot ${p.slug}: ${(err as Error).message}`)
    }
  }

  await browser.close()

  // Build asset URL set from rendered pages (not raw HTML, which is a JS shell)
  for (const d of pageDataBySlug.values()) {
    const logoSrc = d.logoSrc as string
    if (logoSrc && logoSrc.startsWith(ORIGIN)) assetUrls.add(logoSrc)
    for (const img of d.imgs as { src: string; w: number; h: number }[]) {
      if (!img.src) continue
      if (!img.src.startsWith(ORIGIN)) continue
      assetUrls.add(img.src)
    }
  }

  console.log(`\nDownloading assets (${assetUrls.size})...\n`)

  const downloaded: { name: string; localPath: string; alt: string; originalUrl: string }[] = []
  const originalToLocal = new Map<string, string>()

  for (const url of [...assetUrls]) {
    try {
      const u = new URL(url)
      const assetPath = u.pathname
      const { buffer, contentType } = await fetchUrl(url)
      const { localPath, destAbs } = toLocalPathForAssetPath(assetPath, contentType, buffer)
      fs.mkdirSync(path.dirname(destAbs), { recursive: true })
      fs.writeFileSync(destAbs, buffer)
      originalToLocal.set(url, localPath)
      downloaded.push({
        name: path.basename(destAbs),
        localPath,
        alt: '',
        originalUrl: url,
      })
      console.log(`  ✓ ${assetPath}`)
    } catch (err) {
      console.warn(`  ✗ Failed ${url}: ${(err as Error).message}`)
    }
  }

  const home = pageDataBySlug.get('home') || {}
  const about = pageDataBySlug.get('about') || {}
  const projects = pageDataBySlug.get('projects') || {}
  const contact = pageDataBySlug.get('contact') || {}

  const email = (contact.emails?.[0] as string | undefined) || ''
  const phone = (contact.phones?.[0] as string | undefined) || ''

  // Use the header logo image as the canonical logo (matches the one users see).
  const logoUrl = (home.logoSrc as string | undefined) || ''
  const logoLocal = logoUrl ? originalToLocal.get(logoUrl) || null : null

  // Hero images: large, full-bleed desktop images on the home page (avoid the logo itself).
  const heroCandidates = (home.imgs as { src: string; w: number; h: number }[] | undefined || [])
    .filter((i) => i.src && i.src.startsWith(ORIGIN))
    .filter((i) => i.w >= 1000 && i.h >= 600)
    .filter((i) => !logoUrl || i.src !== logoUrl)
    .slice(0, 4)
    .map((i) => originalToLocal.get(i.src))
    .filter(Boolean) as string[]

  const heroImage = heroCandidates[0] || ''

  const aboutImage = ((about.imgs as { src: string; w: number; h: number }[] | undefined) || [])
    .filter((i) => i.src && i.src.startsWith(ORIGIN))
    .filter((i) => i.w >= 1000 && i.h >= 600)
    .filter((i) => !logoUrl || i.src !== logoUrl)
    .map((i) => originalToLocal.get(i.src))
    .filter(Boolean)[0] as (string | undefined)

  const contactImage = ((contact.imgs as { src: string; w: number; h: number }[] | undefined) || [])
    .filter((i) => i.src && i.src.startsWith(ORIGIN))
    .filter((i) => i.w >= 1000 && i.h >= 600)
    .filter((i) => !logoUrl || i.src !== logoUrl)
    .map((i) => originalToLocal.get(i.src))
    .filter(Boolean)[0] as (string | undefined)

  // Project images: large images on /projects/ (exclude the header logo).
  const projectImgs = (projects.imgs as { src: string }[] | undefined || [])
    .map((i) => i.src)
    .filter((src) => src && src.startsWith(ORIGIN))
    // The site serves project photos as /__static/<uuid>/image_laptop (no extension).
    .filter((src) => /\/__static\/[^/]+\/image_laptop$/.test(src))
    .filter((src) => !logoUrl || src !== logoUrl)
    .map((src) => originalToLocal.get(src))
    .filter(Boolean) as string[]

  const uniqueProjectImgs = [...new Set(projectImgs)].slice(0, 36)

  const projectItems = uniqueProjectImgs.map((localPath) => ({
    title: '',
    description: '',
    image: localPath,
  }))

  // About page on the source site doesn't expose stable long-form copy in the DOM (it largely repeats the feature blocks).
  // Keep this empty to avoid accidentally ingesting cookie banner text.
  const aboutParas: string[] = []

  const homeText = stripTags(htmlBySlug.get('home') || '')
  const tagline =
    extractFirst(homeText, /Built on Trust\.\s*Focused on You\./i) ||
    'Built on Trust. Focused on You.'

  // These four feature blocks are present on the source site. Keep them verbatim (no added claims).
  const featureItems = [
    { name: 'Client-First Approach', description: 'We treat every build like it’s our own. That means open communication, honest advice, and no shortcuts.' },
    { name: 'All Projects, Big or Small', description: 'From home extensions to new commercial builds, no job is too complex or too modest. If it matters to you, it matters to us.' },
    { name: 'Local Knowledge, Local Pride', description: 'As a locally owned and operated business, we understand the unique needs of our community and we’re proud to help shape it.' },
    { name: 'Professional Delivery, Every Time', description: 'Backed by a reliable team, licensed trades, and a fleet of heavy vehicles and equipment, we deliver with speed, precision, and care.' },
  ]

  const siteData = {
    crawledAt: new Date().toISOString(),
    baseUrl: ORIGIN,
    business: {
      name: 'Index Building Group',
      tagline,
      address: '',
      phone,
      email,
      hours: { weekdays: '', saturday: '', sunday: '' },
      area: 'Canberra and surrounding regions',
    },
    nav: [
      { label: 'Home', href: '/' },
      { label: 'About us', href: '/about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Contact us', href: '/contact' },
    ],
    pages: {
      home: {
        slug: 'home',
        title: (home.title as string | undefined) || 'Index Building Group',
        metaDescription: (home.metaDescription as string | undefined) || '',
        h1: 'Built on Trust. Focused on You.',
        heroImage,
        heroImages: heroCandidates,
      },
      about: {
        slug: 'about',
        title: (about.title as string | undefined) || 'About us',
        metaDescription: (about.metaDescription as string | undefined) || '',
        h1: 'About us',
        body: aboutParas.length ? aboutParas : [],
        image: aboutImage || null,
        testimonial: null,
      },
      services: {
        slug: 'services',
        title: 'Full service building solutions',
        metaDescription: '',
        h1: 'Full service building solutions',
        items: featureItems.map((f) => ({ ...f, image: null })),
      },
      projects: {
        slug: 'projects',
        title: 'Projects',
        metaDescription: '',
        h1: 'Projects',
        items: projectItems,
      },
      contact: {
        slug: 'contact',
        title: 'Contact us',
        metaDescription: '',
        h1: 'Contact us',
        image: contactImage || null,
      },
    },
    assets: {
      logo: logoLocal,
      images: downloaded,
    },
  }

  const outputPath = path.join(CONTENT_DIR, 'site.json')
  fs.writeFileSync(outputPath, JSON.stringify(siteData, null, 2))
  console.log(`\n✅ site.json written to ${outputPath}`)
  console.log(`   Assets referenced: ${downloaded.length}`)
}

main().catch(console.error)
