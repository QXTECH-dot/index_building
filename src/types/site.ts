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
}

export interface ServiceItem {
  name: string
  description: string
  image: string | null
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
  testimonial: Testimonial
}

export interface ServicesPage {
  slug: string
  title: string
  metaDescription: string
  h1: string
  items: ServiceItem[]
}

export interface ProjectsPage {
  slug: string
  title: string
  metaDescription: string
  h1: string
  items: ProjectItem[]
}

export interface ContactPage {
  slug: string
  title: string
  metaDescription: string
  h1: string
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
