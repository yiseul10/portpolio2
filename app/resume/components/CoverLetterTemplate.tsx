import type { CoverLetterData } from '@lib/types/cover-letter'
import type { Profile } from '@lib/types/resume'

interface CoverLetterTemplateProps {
  data: CoverLetterData
  profile?: Profile
}

export function CoverLetterTemplate({ data, profile }: CoverLetterTemplateProps) {
  if (!data) return null

  const titles = data.sectionTitles || {}
  const hasContent = data.greeting || data.motivation || data.experience || data.strengths || data.closing

  if (!hasContent) return null

  const sections = [
    { key: 'greeting', title: titles.greeting, content: data.greeting },
    { key: 'motivation', title: titles.motivation, content: data.motivation },
    { key: 'experience', title: titles.experience, content: data.experience },
    { key: 'strengths', title: titles.strengths, content: data.strengths },
    { key: 'closing', title: titles.closing, content: data.closing },
  ].filter(s => s.content)

  return (
    <div className="cover-letter-content">
      {/* 헤더: 지원 대상 */}
      {(data.targetCompany || data.targetPosition) && (
        <header className="mb-8 border-b-2 border-neutral-700 pb-1">
          {data.targetCompany && (
            <h1 className="text-2xl font-bold tracking-tight print:text-xl">
              {data.targetCompany}
            </h1>
          )}
          {data.targetPosition && (
            <p className="text-base font-semibold text-neutral-500 mt-0.5 print:text-sm">
              {data.targetPosition} 지원
            </p>
          )}
          {profile?.name && (
            <p className="text-sm text-neutral-600 mt-2 print:text-xs">
              지원자: {profile.name}
            </p>
          )}
        </header>
      )}

      {/* 본문 섹션들 */}
      {sections.map(({ key, title, content }) => (
        <section key={key} className="mb-6">
          {title && (
            <h2 className="text-base font-semibold mb-2 text-neutral-800 print:text-sm">
              {title}
            </h2>
          )}
          <p className="text-sm leading-relaxed text-neutral-700 whitespace-pre-line print:text-base">
            {content}
          </p>
        </section>
      ))}
    </div>
  )
}
