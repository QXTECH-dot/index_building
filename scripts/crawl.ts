#!/usr/bin/env tsx
/**
 * Crawler for indexbuilding.com.au
 * Extracts content, downloads assets, produces /_content/site.json
 */

import { chromium } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import { URL } from 'url'

const BASE_URL = 'https://indexbuilding.com.au'
const CONTENT_DIR = path.join(process.cwd(), '_content')
const SNAPSHOTS_DIR = path.join(process.cwd(), '_source_snapshots')
const ASSETS_DIR = path.join(process.cwd(), 'public/assets/images')

// Ensure directories exist
for (const dir of [CONTENT_DIR, SNAPSHOTS_DIR, ASSETS_DIR]) {
  fs.mkdirSync(dir, { recursive: true })
}

type NavItem = { label: string; href: string }
type ImageAsset = { originalUrl: string; localPath: string; alt: string; width?: number; height?: number }
type PageContent = {
  url: string
  slug: string
  title: string
  metaDescription: string
  h1: string
  headings: { level: number; text: string }[]
  paragraphs: string[]
  images: ImageAsset[]
  navItems: NavItem[]
  footerLinks: NavItem[]
  footerText: string[]
  contactInfo: {
    phone?: string
    email?: string
    address?: string
  }
  services: { name: string; description: string }[]
  projects: { title: string; description: string; imageUrl: string; localImage?: string }[]
  rawHtml?: string
}

type SiteData = {
  crawledAt: string
  baseUrl: string
  pages: PageContent[]
  globalNav: NavItem[]
  globalFooter: { links: NavItem[]; text: string[]; contactInfo: { phone?: string; email?: string; address?: string } }
  allImages: ImageAsset[]
}

function urlToSlug(url: string): string {
  const u = new URL(url)
  const pathname = u.pathname.replace(/\/$/, '') || '/'
  if (pathname === '/') return 'home'
  return pathname.replace(/^\//, '').replace(/\//g, '-')
}

function hashUrl(url: string): string {
  return crypto.createHash('md5').update(url).digest('hex').slice(0, 8)
}

function getImageExtension(url: string, contentType?: string): string {
  if (contentType) {
    if (contentType.includes('jpeg') || contentType.includes('jpg')) return '.jpg'
    if (contentType.includes('png')) return '.png'
    if (contentType.includes('webp')) return '.webp'
    if (contentType.includes('gif')) return '.gif'
    if (contentType.includes('svg')) return '.svg'
  }
  const match = url.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?|$)/i)
  if (match) return '.' + match[1].toLowerCase().replace('jpeg', 'jpg')
  return '.jpg'
}

async function downloadImage(
  url: string,
  browser: ReturnType<typeof chromium.launch> extends Promise<infer T> ? T : never,
  slug: string
): Promise<string | null> {
  if (!url || url.startsWith('data:')) return null

  // Resolve relative URLs
  let absoluteUrl = url
  if (url.startsWith('//')) {
    absoluteUrl = 'https:' + url
  } else if (url.startsWith('/')) {
    absoluteUrl = BASE_URL + url
  } else if (!url.startsWith('http')) {
    absoluteUrl = BASE_URL + '/' + url
  }

  const hash = hashUrl(absoluteUrl)

  // Check if already downloaded
  const existingFiles = fs.readdirSync(ASSETS_DIR).filter(f => f.startsWith(hash))
  if (existingFiles.length > 0) {
    return `/assets/images/${existingFiles[0]}`
  }

  try {
    const context = await (await browser).newContext({ ignoreHTTPSErrors: true })
    const response = await context.request.get(absoluteUrl)

    if (!response.ok()) {
      await context.close()
      return null
    }

    const contentType = response.headers()['content-type'] || ''
    const ext = getImageExtension(absoluteUrl, contentType)
    const filename = `${hash}${ext}`
    const localPath = path.join(ASSETS_DIR, filename)

    const buffer = await response.body()
    fs.writeFileSync(localPath, buffer)
    await context.close()

    console.log(`  Downloaded: ${filename} (${Math.round(buffer.length/1024)}KB)`)
    return `/assets/images/${filename}`
  } catch (err) {
    console.warn(`  Failed to download ${absoluteUrl}:`, (err as Error).message)
    return null
  }
}

async function crawlPage(
  url: string,
  browser: ReturnType<typeof chromium.launch> extends Promise<infer T> ? T : never
): Promise<PageContent> {
  const context = await (await browser).newContext({
    userAgent: 'Mozilla/5.0 (compatible; IndexBuildingCrawler/1.0)',
    ignoreHTTPSErrors: true,
  })
  const page = await context.newPage()

  console.log(`\nCrawling: ${url}`)

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(2000)

  const slug = urlToSlug(url)

  // Save HTML snapshot
  const html = await page.content()
  fs.writeFileSync(path.join(SNAPSHOTS_DIR, `${slug}.html`), html, 'utf-8')

  // Extract data
  const data = await page.evaluate(() => {
    // Title
    const title = document.title || ''

    // Meta description
    const metaDesc = (document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content || ''

    // H1
    const h1El = document.querySelector('h1')
    const h1 = h1El?.innerText?.trim() || ''

    // All headings
    const headings: { level: number; text: string }[] = []
    document.querySelectorAll('h1, h2, h3, h4').forEach(el => {
      const text = (el as HTMLElement).innerText?.trim()
      if (text) {
        const level = parseInt(el.tagName[1])
        headings.push({ level, text })
      }
    })

    // Paragraphs (meaningful ones only)
    const paragraphs: string[] = []
    document.querySelectorAll('p, .wp-block-paragraph').forEach(el => {
      const text = (el as HTMLElement).innerText?.trim()
      if (text && text.length > 20) {
        paragraphs.push(text)
      }
    })

    // Nav items
    const navItems: { label: string; href: string }[] = []
    const navSelectors = ['nav a', 'header a', '.nav a', '.menu a', '.navigation a', '[class*="menu"] a', '[class*="nav"] a']
    const navLinks = new Set<string>()
    for (const sel of navSelectors) {
      document.querySelectorAll(sel).forEach(el => {
        const a = el as HTMLAnchorElement
        const href = a.href
        const label = a.innerText?.trim()
        if (href && label && !navLinks.has(href)) {
          navLinks.add(href)
          navItems.push({ label, href })
        }
      })
      if (navItems.length > 0) break
    }

    // Footer
    const footerLinks: { label: string; href: string }[] = []
    const footerText: string[] = []
    const footer = document.querySelector('footer, .footer, [class*="footer"]')
    if (footer) {
      footer.querySelectorAll('a').forEach(a => {
        const label = a.innerText?.trim()
        const href = a.href
        if (label && href) footerLinks.push({ label, href })
      })
      footer.querySelectorAll('p, span, div').forEach(el => {
        const text = (el as HTMLElement).innerText?.trim()
        if (text && text.length > 5 && el.children.length === 0) {
          footerText.push(text)
        }
      })
    }

    // Contact info
    const fullText = document.body.innerText
    const phoneMatch = fullText.match(/(\+?61[\s\-]?\d[\s\-]?\d{4}[\s\-]?\d{4}|\(0\d\)[\s\-]?\d{4}[\s\-]?\d{4}|0\d{9}|\d{4}[\s\-]\d{3}[\s\-]\d{3})/g)
    const emailMatch = fullText.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g)

    // Address - look for address elements or common patterns
    const addressEl = document.querySelector('address, [class*="address"]')
    const address = addressEl ? (addressEl as HTMLElement).innerText?.trim() : undefined

    // All images
    const images: { src: string; alt: string }[] = []
    document.querySelectorAll('img').forEach(img => {
      const src = img.src || img.dataset.src || img.dataset.lazySrc || ''
      if (src && !src.includes('data:') && !src.includes('pixel') && img.width > 50) {
        images.push({ src, alt: img.alt || '' })
      }
    })

    // Background images from CSS
    const bgImages: { src: string; alt: string }[] = []
    document.querySelectorAll('[style*="background-image"]').forEach(el => {
      const style = (el as HTMLElement).style.backgroundImage
      const match = style.match(/url\(['"]?([^'")\s]+)['"]?\)/)
      if (match && match[1] && !match[1].includes('data:')) {
        bgImages.push({ src: match[1], alt: '' })
      }
    })

    // Services - look for service-like content
    const services: { name: string; description: string }[] = []
    const serviceSelectors = [
      '[class*="service"] h2, [class*="service"] h3',
      '[class*="Service"] h2, [class*="Service"] h3',
      '.services h3, .services h2',
    ]
    for (const sel of serviceSelectors) {
      document.querySelectorAll(sel).forEach(el => {
        const name = (el as HTMLElement).innerText?.trim()
        const desc = el.parentElement?.querySelector('p')?.innerText?.trim() || ''
        if (name) services.push({ name, description: desc })
      })
    }

    // Projects
    const projects: { title: string; description: string; imageUrl: string }[] = []
    const projectSelectors = [
      '[class*="project"]',
      '[class*="Project"]',
      '.portfolio-item',
      '[class*="gallery"] article',
    ]
    for (const sel of projectSelectors) {
      document.querySelectorAll(sel).forEach(el => {
        const titleEl = el.querySelector('h2, h3, h4, .title, [class*="title"]')
        const title = titleEl ? (titleEl as HTMLElement).innerText?.trim() : ''
        const descEl = el.querySelector('p')
        const description = descEl ? descEl.innerText?.trim() : ''
        const img = el.querySelector('img')
        const imageUrl = img?.src || img?.dataset.src || ''
        if (title || imageUrl) {
          projects.push({ title: title || '', description: description || '', imageUrl })
        }
      })
      if (projects.length > 0) break
    }

    return {
      title,
      metaDesc,
      h1,
      headings,
      paragraphs,
      navItems,
      footerLinks,
      footerText,
      phone: phoneMatch?.[0],
      email: emailMatch?.[0],
      address,
      images: [...images, ...bgImages],
      services,
      projects,
    }
  })

  // Download images
  const imageAssets: ImageAsset[] = []
  const imageUrls = new Set<string>()

  for (const img of data.images) {
    if (!img.src || imageUrls.has(img.src)) continue
    imageUrls.add(img.src)

    const localPath = await downloadImage(img.src, browser, slug)
    if (localPath) {
      imageAssets.push({
        originalUrl: img.src,
        localPath,
        alt: img.alt || '',
      })
    }
  }

  await context.close()

  return {
    url,
    slug,
    title: data.title,
    metaDescription: data.metaDesc,
    h1: data.h1,
    headings: data.headings,
    paragraphs: [...new Set(data.paragraphs)],
    images: imageAssets,
    navItems: data.navItems,
    footerLinks: data.footerLinks,
    footerText: [...new Set(data.footerText)],
    contactInfo: {
      phone: data.phone,
      email: data.email,
      address: data.address,
    },
    services: data.services,
    projects: data.projects,
  }
}

async function main() {
  console.log('Starting crawler for', BASE_URL)

  const browser = await chromium.launch({ headless: true, args: ['--ignore-certificate-errors'] })

  // First crawl the home page to get all nav links
  const homePage = await crawlPage(BASE_URL, browser)

  // Collect all unique URLs to crawl from nav
  const urlsToCrawl = new Set<string>([BASE_URL])

  // Add nav URLs
  for (const item of homePage.navItems) {
    const href = item.href
    if (href && href.includes('indexbuilding.com.au') && !href.includes('#')) {
      // Normalize URL
      const cleanUrl = href.replace(/\/$/, '')
      urlsToCrawl.add(cleanUrl)
    }
  }

  // Also try common pages
  const commonPaths = ['', '/about', '/about-us', '/services', '/projects', '/gallery', '/contact', '/contact-us']
  for (const p of commonPaths) {
    urlsToCrawl.add(BASE_URL + p)
  }

  console.log(`\nURLs to crawl: ${[...urlsToCrawl].join(', ')}`)

  const pages: PageContent[] = [homePage]
  const crawledUrls = new Set([BASE_URL, BASE_URL + '/'])

  for (const url of urlsToCrawl) {
    if (url === BASE_URL || url === BASE_URL + '/' || crawledUrls.has(url)) continue
    crawledUrls.add(url)

    try {
      const pageData = await crawlPage(url, browser)
      pages.push(pageData)
    } catch (err) {
      console.warn(`  Failed to crawl ${url}:`, (err as Error).message)
    }
  }

  await browser.close()

  // Build global nav from home page
  const globalNav = homePage.navItems.filter(item =>
    item.href && (item.href.includes('indexbuilding.com.au') || item.href.startsWith('/'))
  )

  // Build global footer from home page
  const globalFooter = {
    links: homePage.footerLinks,
    text: homePage.footerText,
    contactInfo: homePage.contactInfo,
  }

  // Collect all images
  const allImagesMap = new Map<string, ImageAsset>()
  for (const page of pages) {
    for (const img of page.images) {
      allImagesMap.set(img.originalUrl, img)
    }
  }

  const siteData: SiteData = {
    crawledAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    pages,
    globalNav,
    globalFooter,
    allImages: [...allImagesMap.values()],
  }

  // Write site.json
  const outputPath = path.join(CONTENT_DIR, 'site.json')
  fs.writeFileSync(outputPath, JSON.stringify(siteData, null, 2), 'utf-8')

  console.log(`\n✅ Crawl complete!`)
  console.log(`   Pages crawled: ${pages.length}`)
  console.log(`   Images downloaded: ${allImagesMap.size}`)
  console.log(`   Output: ${outputPath}`)

  // Print summary
  for (const page of pages) {
    console.log(`\n  ${page.slug}:`)
    console.log(`    Title: ${page.title}`)
    console.log(`    H1: ${page.h1}`)
    console.log(`    Paragraphs: ${page.paragraphs.length}`)
    console.log(`    Images: ${page.images.length}`)
    console.log(`    Services: ${page.services.length}`)
    console.log(`    Projects: ${page.projects.length}`)
  }
}

main().catch(console.error)
