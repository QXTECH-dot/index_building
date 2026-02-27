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
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
      {withImages.map((project, i) => (
        <SectionReveal key={project.title} delay={i * 50} className="break-inside-avoid mb-4">
          <GalleryItem project={project} index={i} />
        </SectionReveal>
      ))}
    </div>
  )
}

function GalleryItem({ project, index }: { project: ProjectItem; index: number }) {
  // Vary aspect ratios for editorial masonry feel
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
    <article className="group relative overflow-hidden rounded-card bg-stone-100">
      <div className={`relative w-full ${aspect}`}>
        <Image
          src={project.image!}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient overlay on hover */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        />

        {/* Caption on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-medium text-sm leading-snug">
            {project.title}
          </h3>
          {project.description && (
            <p className="text-stone-300 text-xs mt-1 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
