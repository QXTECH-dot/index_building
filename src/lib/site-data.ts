import siteJson from '../../_content/site.json'
import type { SiteData } from '@/types/site'

export const siteData = siteJson as unknown as SiteData

export function getBusiness() {
  return siteData.business
}

export function getNav() {
  return siteData.nav
}

export function getHomePage() {
  return siteData.pages.home
}

export function getAboutPage() {
  return siteData.pages.about
}

export function getServicesPage() {
  return siteData.pages.services
}

export function getProjectsPage() {
  return siteData.pages.projects
}

export function getContactPage() {
  return siteData.pages.contact
}

export function getLogo() {
  return siteData.assets.logo
}

export const SITE_URL = siteData.baseUrl
export const PRIMARY_CTA_LABEL = 'Contact us'
export const PRIMARY_CTA_HREF = '/contact'
