import { ResumeTemplate } from './components/ResumeTemplate'
import { ResumeActions } from './components/ResumeActions'
import { defaultResumeData } from '@lib/types/resume'
import { createServerSupabase } from '@lib/supabase-server'

export const dynamic = 'force-dynamic'

export default async function ResumePage() {
  const supabase = await createServerSupabase()

  const { data: { session } } = await supabase.auth.getSession()

  const { data: resume } = await supabase
    .from('resume')
    .select('data')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  const raw = resume?.data || {}

  // 비인증 사용자: 민감정보 제거
  if (!session) {
    if (raw.profile) {
      delete raw.profile.phone
      delete raw.profile.photo
    }
    delete raw.education
    delete raw.customSections
  }

  const resumeData = {
    ...defaultResumeData,
    ...raw,
    profile: { ...defaultResumeData.profile, ...(raw.profile || {}) },
  }

  return (
    <section className="resume-page">
      {session && (
        <div className="print:hidden flex justify-end mb-6 gap-2">
          <ResumeActions />
        </div>
      )}
      <ResumeTemplate data={resumeData} authenticated={!!session} />
    </section>
  )
}
