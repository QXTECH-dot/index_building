#!/usr/bin/env tsx
/**
 * Downloads all known assets from Wayback Machine and writes site.json
 */
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'
import * as crypto from 'crypto'

const ASSETS_DIR = path.join(process.cwd(), 'public/assets/images')
const CONTENT_DIR = path.join(process.cwd(), '_content')
const SNAPSHOTS_DIR = path.join(process.cwd(), '_source_snapshots')
const WB_BASE = 'https://web.archive.org/web/20241002034710im_/https://indexbuilding.com.au'

for (const d of [ASSETS_DIR, CONTENT_DIR, SNAPSHOTS_DIR]) {
  fs.mkdirSync(d, { recursive: true })
}

function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      console.log(`  Already exists: ${path.basename(dest)}`)
      return resolve()
    }

    const proto = url.startsWith('https') ? https : http
    const req = proto.get(url, { timeout: 30000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location
        if (loc) {
          download(loc.startsWith('http') ? loc : new URL(loc, url).href, dest)
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
      const chunks: Buffer[] = []
      res.on('data', (c: Buffer) => chunks.push(c))
      res.on('end', () => {
        fs.writeFileSync(dest, Buffer.concat(chunks))
        console.log(`  ✓ ${path.basename(dest)} (${Math.round(Buffer.concat(chunks).length / 1024)}KB)`)
        resolve()
      })
      res.on('error', reject)
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')) })
  })
}

const IMAGES: { url: string; name: string; alt: string }[] = [
  { url: `${WB_BASE}/assets/images/logo.png`, name: 'logo.png', alt: 'Index Building logo' },
  { url: `${WB_BASE}/assets/images/bel.jpg`, name: 'bel.jpg', alt: 'Belconnen Fresh Market renovation' },
  { url: `${WB_BASE}/assets/images/house.jpg`, name: 'house.jpg', alt: 'House construction project' },
  { url: `${WB_BASE}/assets/images/con.jpg`, name: 'con.jpg', alt: 'Construction and flooring project' },
  { url: `${WB_BASE}/assets/images/about.jpg`, name: 'about.jpg', alt: 'Index Building team' },
  { url: `${WB_BASE}/assets/images/bg_header.jpg`, name: 'bg_header.jpg', alt: 'Index Building hero background' },
  { url: `${WB_BASE}/assets/images/portfolio/img1.jpg`, name: 'portfolio-img1.jpg', alt: 'Whitlam new project' },
  { url: `${WB_BASE}/assets/images/portfolio/img2.jpg`, name: 'portfolio-img2.jpg', alt: 'Construction project' },
  { url: `${WB_BASE}/assets/images/portfolio/img3.jpg`, name: 'portfolio-img3.jpg', alt: 'Belconnen Fresh Market project' },
  { url: `${WB_BASE}/assets/images/portfolio/img4.jpg`, name: 'portfolio-img4.jpg', alt: 'Denman project' },
  { url: `${WB_BASE}/assets/images/portfolio/img5.jpg`, name: 'portfolio-img5.jpg', alt: 'Renovation project' },
  { url: `${WB_BASE}/assets/images/portfolio/img6.jpg`, name: 'portfolio-img6.jpg', alt: 'Whitlam project construction start' },
  { url: `${WB_BASE}/assets/images/portfolio/img7.jpg`, name: 'portfolio-img7.jpg', alt: 'Building project' },
  { url: `${WB_BASE}/assets/images/portfolio/img8.jpg`, name: 'portfolio-img8.jpg', alt: 'Construction project' },
]

// Also try xhs images
const XHS_IMAGES = [
  {
    url: `https://web.archive.org/web/20241002034716im_/https://indexbuilding.com.au/assets/images/xhs/%E4%B8%9C%E5%B7%B4%E9%93%81%20%E4%B9%9F%E6%98%AF%E5%B7%B4%E9%93%81%F0%9F%98%84%20whitlam%20%E6%96%B0%E6%88%BF_1_%E5%A0%AA%E5%9F%B9%E6%8B%89Stephen%20Zhou_%E6%9D%A5%E8%87%AA%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88.jpg`,
    name: 'xhs-whitlam-1.jpg',
    alt: 'Whitlam new home project'
  },
  {
    url: `https://web.archive.org/web/20241002034720im_/https://indexbuilding.com.au/assets/images/xhs/%E5%A0%AA%E5%9F%B9%E6%8B%89%20belconnen%20fresh%20market_2_%E5%A0%AA%E5%9F%B9%E6%8B%89Stephen%20Zhou_%E6%9D%A5%E8%87%AA%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88.jpg`,
    name: 'xhs-belconnen-2.jpg',
    alt: 'Belconnen Fresh Market, Canberra'
  },
  {
    url: `https://web.archive.org/web/20241002034721im_/https://indexbuilding.com.au/assets/images/xhs/%E5%BA%94%E8%AF%A5%E6%98%AFdenman%20%E4%BA%8C%E6%9C%9F%E7%AC%AC%E4%B8%80%E4%B8%AA%E9%80%9A%E7%94%B5%E7%9A%84%E6%88%BF%E5%AD%90%F0%9F%98%84_1_%E5%A0%AA%E5%9F%B9%E6%8B%89Stephen%20Zhou_%E6%9D%A5%E8%87%AA%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88.jpg`,
    name: 'xhs-denman-1.jpg',
    alt: 'First house in Denman Phase II to be electrified'
  },
  {
    url: `https://web.archive.org/web/20241002034722im_/https://indexbuilding.com.au/assets/images/xhs/%E8%BD%A6%E5%BA%93%E9%97%A8%20resize%EF%BC%8C%E5%A0%AA%E5%9F%B9%E6%8B%89%E5%BB%BA%E7%AD%91%F0%9F%98%8A_1_%E5%A0%AA%E5%9F%B9%E6%8B%89Stephen%20Zhou_%E6%9D%A5%E8%87%AA%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88.jpg`,
    name: 'xhs-garage-door.jpg',
    alt: 'Garage door installation, Canberra'
  },
  {
    url: `https://web.archive.org/web/20241002034723im_/https://indexbuilding.com.au/assets/images/xhs/%F0%9F%98%84whitlam%20%E5%BC%80%E5%B7%A5%20%E5%92%B1%E4%BB%AC%E4%B9%9F%E6%9D%A5%E6%B2%BE%E4%B8%80%E6%B2%BE%E5%A5%BD%E8%BF%90%E5%90%A7_1_%E5%A0%AA%E5%9F%B9%E6%8B%89Stephen%20Zhou_%E6%9D%A5%E8%87%AA%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88.jpg`,
    name: 'xhs-whitlam-groundbreaking.jpg',
    alt: 'Whitlam project groundbreaking ceremony'
  },
  {
    url: `https://web.archive.org/web/20241002034723im_/https://indexbuilding.com.au/assets/images/xhs/img3.jpg`,
    name: 'xhs-img3.jpg',
    alt: 'Building project Canberra'
  },
]

async function main() {
  console.log('Downloading assets...\n')

  const downloaded: { name: string; localPath: string; alt: string; originalUrl: string }[] = []

  for (const img of [...IMAGES, ...XHS_IMAGES]) {
    const dest = path.join(ASSETS_DIR, img.name)
    try {
      await download(img.url, dest)
      downloaded.push({
        name: img.name,
        localPath: `/assets/images/${img.name}`,
        alt: img.alt,
        originalUrl: img.url,
      })
    } catch (err) {
      console.warn(`  ✗ Failed ${img.name}: ${(err as Error).message}`)
    }
  }

  // Save HTML snapshots
  const pages = ['', 'about.html', 'projects.html', 'contact.html']
  const snapshots: Record<string, string> = {}
  for (const p of pages) {
    const slug = p.replace('.html', '') || 'home'
    const snapPath = path.join(SNAPSHOTS_DIR, `${slug}.html`)
    if (!fs.existsSync(snapPath)) {
      const url = `https://web.archive.org/web/20241002034710/${p ? 'https://indexbuilding.com.au/' + p : 'https://indexbuilding.com.au/'}`
      try {
        await download(url, snapPath)
        snapshots[slug] = snapPath
      } catch (err) {
        console.warn(`  ✗ Snapshot ${slug}: ${(err as Error).message}`)
      }
    } else {
      snapshots[slug] = snapPath
    }
  }

  // Build site.json from extracted data
  const downloadedMap = new Map(downloaded.map(d => [d.name, d]))

  const siteData = {
    crawledAt: new Date().toISOString(),
    baseUrl: 'https://indexbuilding.com.au',
    business: {
      name: 'Index Building',
      tagline: 'Canberra\'s trusted construction and renovation specialists',
      address: '12/233 Flemington Road, Franklin ACT 2913',
      phone: '+61 416 217 919',
      email: 'stephen@indexbuilding.com.au',
      hours: {
        weekdays: '09:00 AM – 6:30 PM',
        saturday: 'Closed',
        sunday: 'Closed',
      },
      area: 'Canberra, ACT, Australia',
    },
    nav: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Contact', href: '/contact' },
    ],
    pages: {
      home: {
        slug: 'home',
        title: 'Index Building – Canberra Construction & Renovation',
        metaDescription: 'Index Building is Canberra\'s trusted construction and renovation firm. We specialize in house construction, shop renovation, flooring installation, and repairs across the ACT.',
        h1: 'Quality Construction & Renovation in Canberra',
        heroImage: downloadedMap.get('bg_header.jpg')?.localPath || '/assets/images/house.jpg',
        heroImages: [
          downloadedMap.get('bg_header.jpg')?.localPath,
          downloadedMap.get('house.jpg')?.localPath,
          downloadedMap.get('bel.jpg')?.localPath,
          downloadedMap.get('con.jpg')?.localPath,
        ].filter(Boolean),
      },
      about: {
        slug: 'about',
        title: 'About Us – Index Building Canberra',
        metaDescription: 'Learn about Index Building – a premier construction and renovation firm based in Canberra dedicated to quality craftsmanship and customer satisfaction.',
        h1: 'About Us',
        body: [
          'Building Index is a premier construction and renovation firm based in Canberra, dedicated to transforming residential spaces with precision and care. With a strong focus on quality and customer satisfaction, we specialize in house construction, renovations, flooring installations, and comprehensive house repairs.',
          'Our team of skilled professionals brings years of experience and a deep commitment to excellence in every project we undertake. We work closely with our clients to understand their vision and ensure that every detail reflects their personal style and needs.',
          'At Building Index, we focus on creating functional, stylish, and durable living spaces that reflect our clients\' unique needs and tastes. With a commitment to excellence and attention to detail, we ensure every project is completed to the highest standards.',
          'Trust us to be your partner in building and enhancing your home, providing solutions that stand the test of time.',
        ],
        image: downloadedMap.get('about.jpg')?.localPath || null,
        testimonial: {
          quote: 'Thank you IndexBuilding, you are dedicated, professional and efficient. Thank you for your hard work.',
          attribution: 'A customer from Canberra',
        },
      },
      services: {
        slug: 'services',
        title: 'Our Services – Index Building Canberra',
        metaDescription: 'Index Building offers expert shop renovation, house construction, flooring installation, and house repair services across Canberra, ACT.',
        h1: 'Our Services',
        items: [
          {
            name: 'Shop Renovation',
            description: 'We specialize in transforming commercial spaces into modern, functional, and aesthetically pleasing environments. Our expert team handles every aspect of the renovation process, from initial design consultation to the final touches. We ensure that your shop reflects your brand\'s identity while creating an inviting atmosphere for customers.',
            image: downloadedMap.get('bel.jpg')?.localPath || null,
          },
          {
            name: 'House Construction',
            description: 'We specialize in building custom homes that blend quality craftsmanship with innovative design. From the initial planning and architectural design to the final construction, our experienced team is committed to delivering your dream home on time and within budget. We work closely with you to understand your vision and ensure that every detail reflects your personal style and needs.',
            image: downloadedMap.get('house.jpg')?.localPath || null,
          },
          {
            name: 'Flooring Installation',
            description: 'We offer professional flooring installation and renovation services to enhance the beauty and functionality of your home or commercial space. Whether you\'re looking for hardwood, laminate, tile, or vinyl flooring, our expert team provides high-quality craftsmanship and attention to detail.',
            image: downloadedMap.get('con.jpg')?.localPath || null,
          },
          {
            name: 'House Repairs',
            description: 'From minor fixes to major structural repairs, our team handles all aspects of residential maintenance and repair. We ensure your property remains safe, functional, and well-maintained with quality workmanship on every job.',
            image: downloadedMap.get('house.jpg')?.localPath || null,
          },
        ],
      },
      projects: {
        slug: 'projects',
        title: 'Our Projects – Index Building Canberra',
        metaDescription: 'Explore Index Building\'s portfolio of completed projects in Canberra – house construction, commercial renovations, flooring, and more.',
        h1: 'Our Projects',
        items: [
          {
            title: 'Whitlam New Project – Anna and Tony\'s House',
            description: 'New home construction in the Whitlam estate, Canberra.',
            image: downloadedMap.get('xhs-whitlam-1.jpg')?.localPath || downloadedMap.get('portfolio-img1.jpg')?.localPath || null,
          },
          {
            title: 'Belconnen Fresh Market',
            description: 'Commercial shop renovation at Belconnen Fresh Market, Canberra.',
            image: downloadedMap.get('xhs-belconnen-2.jpg')?.localPath || downloadedMap.get('bel.jpg')?.localPath || null,
          },
          {
            title: 'Downer Granny Flat',
            description: 'Granny flat construction in Downer, Canberra.',
            image: downloadedMap.get('house.jpg')?.localPath || null,
          },
          {
            title: 'Denman Phase II – First Electrified Home',
            description: 'The first fully electrified house in Denman Phase II, Canberra.',
            image: downloadedMap.get('xhs-denman-1.jpg')?.localPath || downloadedMap.get('portfolio-img4.jpg')?.localPath || null,
          },
          {
            title: 'Kaleen Granny Flat',
            description: 'Backyard granny flat addition in Kaleen, Canberra.',
            image: downloadedMap.get('portfolio-img5.jpg')?.localPath || null,
          },
          {
            title: 'Whitlam Project Groundbreaking',
            description: 'Construction commencement for a new residential build in Whitlam.',
            image: downloadedMap.get('xhs-whitlam-groundbreaking.jpg')?.localPath || null,
          },
          {
            title: 'Garage Door Installation',
            description: 'Residential garage door installation, Canberra.',
            image: downloadedMap.get('xhs-garage-door.jpg')?.localPath || null,
          },
          {
            title: 'Decking Construction',
            description: 'Outdoor decking construction and renovation.',
            image: downloadedMap.get('con.jpg')?.localPath || null,
          },
        ].filter(p => p.image !== null),
      },
      contact: {
        slug: 'contact',
        title: 'Contact Us – Index Building Canberra',
        metaDescription: 'Get in touch with Index Building for your construction and renovation project in Canberra. Call +61 416 217 919 or email stephen@indexbuilding.com.au.',
        h1: 'Contact Us',
      },
    },
    assets: {
      logo: downloadedMap.get('logo.png')?.localPath || null,
      images: downloaded.map(d => ({
        name: d.name,
        localPath: d.localPath,
        alt: d.alt,
      })),
    },
  }

  const outputPath = path.join(CONTENT_DIR, 'site.json')
  fs.writeFileSync(outputPath, JSON.stringify(siteData, null, 2))
  console.log(`\n✅ site.json written to ${outputPath}`)
  console.log(`   Assets downloaded: ${downloaded.length}`)
}

main().catch(console.error)
