import Image from 'next/image'
import { SectionReveal } from './SectionReveal'
import type { ProjectItem } from '@/types/site'

interface GalleryEditorialProps {
  projects: ProjectItem[]
  limit?: number
}

export function GalleryEditorial({ projects, limit }: GalleryEditorialProps) {
  const items = limit ? projects.slice(0, limit) : projects
  const withImages = items.filter((p) => p.image)

  if (withImages.length === 0) return null

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 lg:gap-6">
      {withImages.map((project, i) => (
        <SectionReveal key={project.title} delay={i * 60} className="break-inside-avoid mb-5 lg:mb-6">
          <GalleryItem project={project} index={i} />
        </SectionReveal>
      ))}
    </div>
  )
}

function GalleryItem({ project, index }: { project: ProjectItem; index: number }) {
  const aspectClasses = [
    'aspect-[4/3]',
    'aspect-[3/4]',
    'aspect-[4/3]',
    'aspect-[16/9]',
    'aspect-[3/4]',
    'aspect-[4/3]',
    'aspect-square',
    'aspect-[4/3]',
  ]
  const aspect = aspectClasses[index % aspectClasses.length]

  return (
    <article
      className="group relative overflow-hidden rounded-card shadow-card transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-card-hover hover:-translate-y-[3px]"
      style={{ backgroundColor: '#3e2d1e' }}
    >
      {/* Gold crown line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-brand-accent z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className={`relative w-full ${aspect}`}>
        <Image
          src={project.image!}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-safe:group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />

        {(project.title || project.description) && (
          <>
            {/* Subtle always-on warm base overlay */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(28,14,4,0.55) 0%, transparent 55%)' }}
              aria-hidden="true"
            />

            {/* Deeper warm overlay on hover */}
            <div
              className="absolute inset-0 opacity-0 motion-safe:group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'linear-gradient(to top, rgba(28,14,4,0.88) 0%, rgba(28,14,4,0.25) 55%, transparent 100%)' }}
              aria-hidden="true"
            />

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-3 opacity-0 motion-safe:group-hover:translate-y-0 motion-safe:group-hover:opacity-100 transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
              {/* Gold rule */}
              <div className="w-7 h-px bg-brand-accent mb-3" aria-hidden="true" />

              {project.title && (
                <h3 className="text-white font-semibold text-[0.9375rem] leading-snug mb-1">
                  {project.title}
                </h3>
              )}
              {project.description && (
                <p className="text-warm-300/80 text-xs leading-relaxed">
                  {project.description}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </article>
  )
}
