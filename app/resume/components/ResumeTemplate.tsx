import { Mail, Phone, Linkedin, Globe, FileText } from 'lucide-react'
import { InlineMarkdown, BlockMarkdown } from './Markdown'

const SECTION_LABEL =
  'resume-section-label text-sm font-bold tracking-wider uppercase text-neutral-900 border-b border-neutral-400 pb-1.5 mb-4'

export function ResumeTemplate({ data, authenticated = false }: { data: any; authenticated?: boolean }) {
  const profile = data?.profile || {}
  const summary = data?.summary || ''
  const summaryHeadline = data?.summaryHeadline || ''
  const keywords: string[] = Array.isArray(data?.keywords) ? data.keywords : []
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const skills = Array.isArray(data?.skills) ? data.skills : []
  const education = Array.isArray(data?.education) ? data.education : []
  const certifications = Array.isArray(data?.certifications) ? data.certifications : []
  const customSections = Array.isArray(data?.customSections) ? data.customSections : []

  const titles = {
    summary: 'SUMMARY',
    experience: 'EXPERIENCE',
    skills: 'SKILLS',
    education: 'EDUCATION',
    certifications: 'CERTIFICATIONS & OTHER',
    ...(data?.sectionTitles || {}),
  }

  const hasProfile = profile.name || profile.title
  const hasContent = hasProfile || summary || summaryHeadline || experience.length > 0 || skills.length > 0 || education.length > 0 || certifications.length > 0 || customSections.length > 0

  if (!hasContent) {
    return (
      <div className="resume-content flex flex-col items-center justify-center py-20 text-neutral-400">
        <FileText className="w-12 h-12 mb-4 text-neutral-300 dark:text-neutral-600" />
        <p className="text-lg font-medium">이력서가 아직 작성되지 않았습니다.</p>
        <p className="text-sm mt-2">상단의 수정 버튼을 눌러 이력서를 작성해 보세요.</p>
      </div>
    )
  }

  return (
    <div className="resume-content">
      {/* 헤더 */}
      {hasProfile && (
        <header className="mb-7 print:mb-6 border-b-2 border-neutral-900 pb-3">
          <div className="flex justify-between items-start gap-6">
            <div className="flex-1 min-w-0">
              {profile.name && (
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 print:text-[24px]">
                  {profile.name}
                </h1>
              )}
              {profile.title && (
                <p className="text-base font-semibold tracking-wide uppercase text-neutral-600 mt-1 print:text-[13px]">
                  {profile.title}
                </p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm font-medium text-neutral-700">
                {profile.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="hidden print:inline">{profile.email}</span>
                    <a href={`mailto:${profile.email}`} className="print:hidden underline-offset-2 hover:underline">
                      이메일
                    </a>
                  </span>
                )}
                {authenticated && profile.phone && (
                  <span className="inline-flex items-center gap-1.5 tabular-nums">
                    <Phone className="w-3.5 h-3.5" />
                    {profile.phone.replace(/[^0-9]/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1·$2·$3')}
                  </span>
                )}
                {profile.linkedin && (
                  <span className="inline-flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5" />
                    <a href={profile.linkedin} className="underline-offset-2 hover:underline">
                      LinkedIn
                    </a>
                  </span>
                )}
                {profile.website && (
                  <span className="inline-flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <a href={profile.website} className="underline-offset-2 hover:underline">
                      포트폴리오
                    </a>
                  </span>
                )}
              </div>
            </div>
            {authenticated && profile.photo && (
              <div className="shrink-0">
                <img
                  src={profile.photo}
                  alt="Profile"
                  className="w-28 h-28 object-cover rounded-lg print:w-24 print:h-24"
                />
              </div>
            )}
          </div>
        </header>
      )}

      {/* 소개 */}
      {(summaryHeadline || summary || keywords.length > 0) && (
        <section className="resume-section mb-7 print:mb-6">
          {summaryHeadline && (
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-3 print:text-[20px]">
              {summaryHeadline}
            </h2>
          )}
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {keywords.map((kw: string, i: number) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-900 text-white print:bg-transparent print:text-neutral-900 print:border print:border-neutral-700"
                >
                  #{kw}
                </span>
              ))}
            </div>
          )}
          {summary && (
            <div className="text-[15px] leading-relaxed text-neutral-800 print:text-[12px]">
              <BlockMarkdown>{summary}</BlockMarkdown>
            </div>
          )}
        </section>
      )}

      {/* 기술 스택 */}
      {skills.length > 0 && (
        <section className="resume-section mb-7 print:mb-6">
          <h2 className={SECTION_LABEL}>{titles.skills}</h2>
          <div className="space-y-2">
            {skills.map((group: any, i: number) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-x-4 gap-y-1">
                {group.category && (
                  <h3 className="sm:w-32 shrink-0 text-sm font-semibold text-neutral-900 print:text-[11px]">
                    {group.category}
                  </h3>
                )}
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {(typeof group.items === 'string' ? group.items.split(',') : []).map((item: string, j: number) => (
                    <span
                      key={j}
                      className="text-xs px-2 py-0.5 rounded bg-neutral-200 text-neutral-900 print:bg-neutral-100 print:border print:border-neutral-300"
                    >
                      {item.trim()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 경력 */}
      {experience.length > 0 && (
        <section className="resume-section mb-7 print:mb-6">
          <h2 className={SECTION_LABEL}>{titles.experience}</h2>
          <div className="space-y-6 print:space-y-5">
            {experience.map((exp: any, i: number) => (
              <div key={i} className="experience-item">
                <div className="flex justify-between items-baseline gap-4">
                  <h3 className="text-base font-black text-neutral-900 print:text-[14px]">{exp.company}</h3>
                  <span className="text-xs text-neutral-500 shrink-0 tabular-nums tracking-wide">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                {exp.role && (
                  <p className="text-[13px] font-semibold tracking-wide uppercase text-neutral-700 mt-0.5 print:text-[11px]">
                    {exp.role}
                  </p>
                )}
                {exp.subtitle && (
                  <p className="text-[15px] font-bold text-neutral-900 mt-3 leading-snug print:text-[12.5px]">
                    {exp.subtitle}
                  </p>
                )}
                {Array.isArray(exp.descriptions) && exp.descriptions.length > 0 && (
                  <ul className="text-[13.5px] leading-relaxed text-neutral-800 mt-3 print:text-[11.5px] print:mt-2">
                    {exp.descriptions.map((desc: any, j: number) => {
                      const item = typeof desc === 'string'
                        ? { text: desc, level: 1, bold: false, italic: false }
                        : desc
                      if (!item.text) return null
                      const level = item.level ?? 0

                      const depth = Math.floor(level / 2)
                      const hasBullet = level % 2 === 1

                      const indentClass = depth === 0 ? '' : depth === 1 ? 'ml-5' : 'ml-10'
                      const bulletClass = depth === 0 ? 'list-disc' : depth === 1 ? 'list-[circle]' : 'list-["‣"]'
                      const textStyle = `${item.bold ? 'font-bold' : ''} ${item.italic ? 'italic' : ''}`.trim()

                      const spacingClass = j === 0
                        ? ''
                        : depth === 0
                          ? 'mt-2.5'
                          : depth === 1
                            ? 'mt-1'
                            : 'mt-0.5'

                      if (!hasBullet) {
                        return (
                          <li key={j} className={`list-none ${indentClass} ${spacingClass} ${depth === 0 ? 'font-semibold text-neutral-900' : ''} ${textStyle}`}>
                            <InlineMarkdown>{item.text}</InlineMarkdown>
                          </li>
                        )
                      }
                      return (
                        <li key={j} className={`${bulletClass} ${depth === 0 ? 'ml-5' : depth === 1 ? 'ml-10' : 'ml-14'} ${spacingClass} ${textStyle}`}>
                          <InlineMarkdown>{item.text}</InlineMarkdown>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 학력 */}
      {authenticated && education.length > 0 && (
        <section className="resume-section mb-7 print:mb-6">
          <h2 className={SECTION_LABEL}>{titles.education}</h2>
          <div className="space-y-3">
            {education.map((edu: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline gap-4">
                  <h3 className="text-sm font-bold text-neutral-900">{edu.school}</h3>
                  {(edu.startDate || edu.endDate) && (
                    <span className="text-xs text-neutral-500 shrink-0 tabular-nums tracking-wide">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  )}
                </div>
                {edu.major && (
                  <p className="text-sm text-neutral-600 mt-0.5">{edu.major}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 자격증 / 기타 */}
      {authenticated && certifications.length > 0 && (
        <section className="resume-section mb-7 print:mb-6">
          <h2 className={SECTION_LABEL}>{titles.certifications}</h2>
          <div className="space-y-2">
            {certifications.map((cert: any, i: number) => (
              <div key={i} className="flex justify-between items-baseline gap-4">
                <h3 className="text-sm font-semibold text-neutral-900">{cert.name}</h3>
                {(cert.startDate || cert.endDate) && (
                  <span className="text-xs text-neutral-500 shrink-0 tabular-nums tracking-wide">
                    {cert.startDate}{cert.startDate && cert.endDate && ' - '}{cert.endDate}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 커스텀 섹션 */}
      {authenticated && customSections.map((section: any, i: number) => {
        const items = Array.isArray(section.items) ? section.items : []
        const layout = section.layout || 'simple'
        if (!section.title && items.length === 0) return null
        return (
          <section key={i} className="resume-section mb-7 print:mb-6">
            <h2 className={SECTION_LABEL}>
              {section.title || '(제목 없음)'}
            </h2>
            <div className="space-y-3">
              {items.map((item: any, j: number) =>
                layout === 'detailed' ? (
                  <div key={j}>
                    <div className="flex justify-between items-baseline gap-4">
                      <h3 className="text-sm font-bold text-neutral-900">{item.text}</h3>
                      {(item.startDate || item.endDate) && (
                        <span className="text-xs text-neutral-500 shrink-0 tabular-nums tracking-wide">
                          {item.startDate}{item.startDate && item.endDate && ' - '}{item.endDate}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="text-sm text-neutral-600 mt-0.5">{item.subtitle}</p>
                    )}
                  </div>
                ) : (
                  <div key={j} className="flex justify-between items-baseline gap-4 text-sm text-neutral-800">
                    <span>{item.text}</span>
                    {(item.startDate || item.endDate) && (
                      <span className="text-xs text-neutral-500 shrink-0 tabular-nums tracking-wide">
                        {item.startDate}{item.startDate && item.endDate && ' - '}{item.endDate}
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
