import type { Metadata } from 'next'
import { GalleryEditorial } from '@/components/GalleryEditorial'
import { SectionReveal } from '@/components/SectionReveal'
import { getProjectsPage, SITE_URL } from '@/lib/site-data'

const projectsPage = getProjectsPage()

export const metadata: Metadata = {
  title: projectsPage.title,
  description: projectsPage.metaDescription,
  alternates: { canonical: `${SITE_URL}/projects` },
  openGraph: {
    title: projectsPage.title,
    description: projectsPage.metaDescription,
    url: `${SITE_URL}/projects`,
  },
}

export default function ProjectsPage() {
  const groups = projectsPage.groups ?? []

  return (
    <>
      {/* Page header */}
      <div className="bg-warm-50 pt-14 pb-16 border-b border-warm-200">
        <div className="container-site">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-brand-accent flex-shrink-0" aria-hidden="true" />
              <p className="eyebrow">Our Work</p>
            </div>
            <h1 className="font-display font-semibold text-display-xl text-warm-900 tracking-tight max-w-2xl mb-4">
              {projectsPage.h1}
            </h1>
            {projectsPage.metaDescription && (
              <p className="text-warm-600 text-base max-w-xl leading-relaxed">
                {projectsPage.metaDescription}
              </p>
            )}
          </SectionReveal>
        </div>
      </div>

      {/* Project groups */}
      {groups.map((group, groupIdx) => (
        <section
          key={group.name}
          className={`section-py ${groupIdx % 2 === 0 ? 'bg-white' : 'bg-warm-50'}`}
          aria-label={group.name}
        >
          <div className="container-site">
            <SectionReveal>
              <div className="flex items-end justify-between gap-6 mb-10">
                <div className="max-w-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="block w-6 h-px bg-brand-accent flex-shrink-0" aria-hidden="true" />
                    <p className="eyebrow text-warm-400">Project 0{groupIdx + 1}</p>
                  </div>
                  <h2 className="h-card text-warm-900 mb-2">{group.name}</h2>
                  {group.location && (
                    <p className="text-warm-500 text-sm mb-3">{group.location}</p>
                  )}
                  {group.description && (
                    <p className="text-warm-600 text-sm leading-relaxed max-w-md">
                      {group.description}
                    </p>
                  )}
                </div>
                <div className="hidden md:flex items-center gap-4 shrink-0">
                  <div className="h-px w-16 bg-brand-accent/20" aria-hidden="true" />
                  <p className="eyebrow text-warm-400 whitespace-nowrap">
                    {group.items.filter(p => p.image).length} Photos
                  </p>
                </div>
              </div>
            </SectionReveal>

            <GalleryEditorial projects={group.items} />
          </div>
        </section>
      ))}
    </>
  )
}
