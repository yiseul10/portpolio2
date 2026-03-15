import { createClient } from '@supabase/supabase-js'
import { ResumeTemplate } from './components/ResumeTemplate'
import { ResumeActions } from './components/ResumeActions'
import { defaultResumeData } from '@lib/types/resume'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ResumePage() {
  // 서버 컴포넌트에서 매 요청마다 새 클라이언트 생성 (캐시 방지)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: resume } = await supabase
    .from('resume')
    .select('data')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  const raw = resume?.data || {}
  const resumeData = {
    ...defaultResumeData,
    ...raw,
    profile: { ...defaultResumeData.profile, ...(raw.profile || {}) },
  }

  return (
    <section className="resume-page">
      {/* 액션 버튼 - 인쇄 시 숨김 */}
      <div className="print:hidden flex justify-end mb-6 gap-2">
        <ResumeActions />
      </div>

      {/* 이력서 본문 */}
      <ResumeTemplate data={resumeData} />
    </section>
  )
}
