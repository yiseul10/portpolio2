import type { CoverLetterData } from '@lib/types/cover-letter'
import type { Profile } from '@lib/types/resume'

interface CoverLetterTemplateProps {
  data: CoverLetterData
  profile?: Profile
}

const SECTION_LABEL =
  'resume-section-label text-sm font-bold tracking-wider uppercase text-neutral-900 border-b border-neutral-400 pb-1.5 mb-4'

export function CoverLetterTemplate({ data }: CoverLetterTemplateProps) {
  if (!data) return null

  const sections = Array.isArray(data.sections) ? data.sections.filter(s => s.content) : []
  if (sections.length === 0) return null

  return (
    <div className="cover-letter-content">
      {sections.map((section, i) => (
        <section key={i} className="mb-7 print:mb-6">
          {section.title && (
            <h2 className={SECTION_LABEL}>
              {section.title}
            </h2>
          )}
          <div
            className="cl-content text-[15px] leading-relaxed text-neutral-800 print:text-[12px]"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </section>
      ))}
    </div>
  )
}
