import type { CoverLetterData } from '@lib/types/cover-letter'
import type { Profile } from '@lib/types/resume'

interface CoverLetterTemplateProps {
  data: CoverLetterData
  profile?: Profile
}

export function CoverLetterTemplate({ data, profile }: CoverLetterTemplateProps) {
  if (!data) return null

  const sections = Array.isArray(data.sections) ? data.sections.filter(s => s.content) : []
  if (sections.length === 0) return null

  const last = sections.length - 1

  return (
    <div className="cover-letter-content">
      {sections.map((section, i) => (
        <section
          key={i}
          className={
            i === 0
              ? 'mb-9 pb-9 border-b border-neutral-200'   // 첫 섹션 아래 구분선
              : i === last
              ? 'mb-6 mt-9 pt-9 border-t border-neutral-200'  // 마지막 섹션 위 구분선
              : 'mb-6'
          }
        >
          {section.title && (
            <h2 className="text-[14px] -mb-2 tracking-[0.25rem] font-black text-neutral-300 print:text-sm">
              {section.title}
            </h2>
          )}
          <div
            className="cl-content text-sm leading-relaxed text-neutral-700"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </section>
      ))}
    </div>
  )
}
