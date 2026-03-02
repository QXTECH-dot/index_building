export interface BusinessInfo {
  name: string
  tagline: string
  address: string
  phone: string
  email: string
  hours: {
    weekdays: string
    saturday: string
    sunday: string
  }
  area: string
}

export interface NavItem {
  label: string
  href: string
}

export interface ImageAsset {
  name: string
  localPath: string
  alt: string
  originalUrl?: string
}

export interface ServiceItem {
  name: string
  slug: string
  description: string
  image: string | null
  features?: string[]
  body?: string[]
}

export interface ProjectItem {
  title: string
  description: string
  image: string | null
}

export interface Testimonial {
  quote: string
  attribution: string
}

export interface HomePage {
  slug: string
  title: string
  metaDescription: string
  h1: string
  heroImage: string
  heroImages: string[]
}

export interface AboutPage {
  slug: string
  title: string
  metaDescription: string
  h1: string
  body: string[]
  image: string | null
  testimonial?: Testimonial | null
}

export interface ServicesPage {
  slug: string
  title: string
  metaDescription: string
  h1: string
  items: ServiceItem[]
}

export interface ProjectGroup {
  name: string
  location?: string
  description?: string
  items: ProjectItem[]
}

export interface ProjectsPage {
  slug: string
  title: string
  metaDescription: string
  h1: string
  items: ProjectItem[]
  groups?: ProjectGroup[]
}

export interface ContactPage {
  slug: string
  title: string
  metaDescription: string
  h1: string
  image?: string | null
}

export interface SiteData {
  crawledAt: string
  baseUrl: string
  business: BusinessInfo
  nav: NavItem[]
  pages: {
    home: HomePage
    about: AboutPage
    services: ServicesPage
    projects: ProjectsPage
    contact: ContactPage
  }
  assets: {
    logo: string | null
    images: ImageAsset[]
  }
}
