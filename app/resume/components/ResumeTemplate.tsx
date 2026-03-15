export function ResumeTemplate({ data }: { data: any }) {
  const profile = data?.profile || {}
  const summary = data?.summary || ''
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
  const hasContent = hasProfile || summary || experience.length > 0 || skills.length > 0 || education.length > 0 || certifications.length > 0 || customSections.length > 0

  if (!hasContent) {
    return (
      <div className="resume-content text-center py-20 text-neutral-400">
        <p className="text-lg">이력서가 아직 작성되지 않았습니다.</p>
        <p className="text-sm mt-2">로그인 후 수정 버튼을 눌러 작성하세요.</p>
      </div>
    )
  }

  return (
    <div className="resume-content">
      {/* 헤더 */}
      {hasProfile && (
        <header className="mb-8 border-b border-neutral-200 dark:border-neutral-700 pb-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {profile.name && (
                <h1 className="text-3xl font-bold tracking-tight print:text-2xl">
                  {profile.name}
                </h1>
              )}
              {profile.title && (
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mt-1 print:text-base">
                  {profile.title}
                </p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                {profile.email && <span>📧 {profile.email}</span>}
                {profile.phone && <span>📱 {profile.phone}</span>}
                {profile.linkedin && (
                  <span>
                    🔗{' '}
                    <a href={profile.linkedin} className="underline hover:text-neutral-800 dark:hover:text-neutral-200">
                      LinkedIn
                    </a>
                  </span>
                )}
                {profile.website && (
                  <span>
                    🌐{' '}
                    <a href={profile.website} className="underline hover:text-neutral-800 dark:hover:text-neutral-200">
                      Portfolio
                    </a>
                  </span>
                )}
              </div>
            </div>
            {/* 증명사진 */}
            {profile.photo && (
              <div className="shrink-0 ml-6">
                <img
                  src={profile.photo}
                  alt="Profile"
                  className="w-28 h-28 object-cover   print:w-28 print:h-28"
                />
              </div>
            )}
          </div>
        </header>
      )}

      {/* 소개 */}
      {summary && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3 border-b border-neutral-100 dark:border-neutral-800 pb-1">
            {titles.summary}
          </h2>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
            {summary}
          </p>
          {/* 해시태그 키워드 */}
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {keywords.map((kw: string, i: number) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 print:border print:border-neutral-300 print:bg-transparent"
                >
                  #{kw}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 경력 */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3 border-b border-neutral-100 dark:border-neutral-800 pb-1">
            {titles.experience}
          </h2>
          <div className="space-y-6">
            {experience.map((exp: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium">{exp.company}</h3>
                  <span className="text-xs text-neutral-500 shrink-0 ml-4">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                {exp.role && (
                  <p className="text-sm text-neutral-500 mb-2">{exp.role}</p>
                )}
                {Array.isArray(exp.descriptions) && exp.descriptions.length > 0 && (
                  <div className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
                    {exp.descriptions.map((desc: any, j: number) => {
                      const item = typeof desc === 'string'
                        ? { text: desc, level: 1 }
                        : desc
                      if (!item.text) return null
                      const level = item.level ?? 1

                      if (level === 0) {
                        return (
                          <p key={j} className="font-medium mt-2 first:mt-0">
                            {item.text}
                          </p>
                        )
                      }
                      if (level === 1) {
                        return (
                          <li key={j} className="list-disc ml-5">
                            {item.text}
                          </li>
                        )
                      }
                      return (
                        <li key={j} className="list-[circle] ml-9">
                          {item.text}
                        </li>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 기술 스택 */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3 border-b border-neutral-100 dark:border-neutral-800 pb-1">
            {titles.skills}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {skills.map((group: any, i: number) => (
              <div key={i}>
                {group.category && (
                  <h3 className="font-medium text-neutral-800 dark:text-neutral-200 mb-1">
                    {group.category}
                  </h3>
                )}
                <p className="text-neutral-600 dark:text-neutral-400">
                  {group.items}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 학력 */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3 border-b border-neutral-100 dark:border-neutral-800 pb-1">
            {titles.education}
          </h2>
          <div className="space-y-3">
            {education.map((edu: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-sm">{edu.school}</h3>
                  {(edu.startDate || edu.endDate) && (
                    <span className="text-xs text-neutral-500 shrink-0 ml-4">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  )}
                </div>
                {edu.major && (
                  <p className="text-sm text-neutral-500">{edu.major}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 자격증 / 기타 */}
      {certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3 border-b border-neutral-100 dark:border-neutral-800 pb-1">
            {titles.certifications}
          </h2>
          <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            {certifications.map((cert: any, i: number) => (
              <div key={i} className="flex justify-between items-baseline">
                <span>{cert.name}</span>
                {(cert.startDate || cert.endDate) && (
                  <span className="text-xs text-neutral-500 shrink-0 ml-4">
                    {cert.startDate}{cert.startDate && cert.endDate && ' - '}{cert.endDate}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 커스텀 섹션들 */}
      {customSections.map((section: any, i: number) => {
        const items = Array.isArray(section.items) ? section.items : []
        if (!section.title && items.length === 0) return null
        return (
          <section key={i} className="mb-8">
            <h2 className="text-lg font-semibold mb-3 border-b border-neutral-100 dark:border-neutral-800 pb-1">
              {section.title || '(제목 없음)'}
            </h2>
            <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
              {items.map((item: any, j: number) => (
                <div key={j} className="flex justify-between items-baseline">
                  <span>{item.text}</span>
                  {(item.startDate || item.endDate) && (
                    <span className="text-xs text-neutral-500 shrink-0 ml-4">
                      {item.startDate}{item.startDate && item.endDate && ' - '}{item.endDate}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
