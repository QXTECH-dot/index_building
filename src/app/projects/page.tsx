import type { Metadata } from 'next'
import { PrimaryCTA } from '@/components/PrimaryCTA'
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
  return (
    <>
      {/* Page header */}
      <div className="bg-stone-900 pt-32 pb-16">
        <div className="container-site">
          <SectionReveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
              Portfolio
            </p>
            <h1 className="font-display font-semibold text-display-xl text-white tracking-tight">
              {projectsPage.h1}
            </h1>
            <p className="text-stone-400 text-body-lg mt-4 max-w-xl">
              A curated selection of construction and renovation projects completed across Canberra, ACT.
            </p>
          </SectionReveal>
        </div>
      </div>

      {/* Gallery */}
      <section className="section-py bg-stone-50" aria-label="Project gallery">
        <div className="container-site">
          <GalleryEditorial projects={projectsPage.items} />
        </div>
      </section>

      {/* Project list */}
      <section className="section-py bg-white" aria-labelledby="project-list-heading">
        <div className="container-site">
          <SectionReveal>
            <h2 id="project-list-heading" className="h-card text-stone-900 mb-8">
              All Projects
            </h2>
          </SectionReveal>
          <ul className="divide-y divide-stone-100" role="list">
            {projectsPage.items.map((project, i) => (
              <SectionReveal key={project.title} as="li" delay={i * 30}>
                <div className="py-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-stone-900 mb-1">{project.title}</h3>
                    {project.description && (
                      <p className="text-stone-500 text-sm">{project.description}</p>
                    )}
                  </div>
                  <span className="flex-shrink-0 text-xs text-stone-400 mt-0.5">
                    Canberra, ACT
                  </span>
                </div>
              </SectionReveal>
            ))}
          </ul>
        </div>
      </section>

      <PrimaryCTA
        heading="Have a Project in Mind?"
        body="We'd love to add your project to our portfolio. Contact us to discuss your construction or renovation needs."
      />
    </>
  )
}
