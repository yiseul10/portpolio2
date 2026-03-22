'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@lib/superbase'
import { ResumeTemplate } from './components/ResumeTemplate'
import { ResumeActions } from './components/ResumeActions'
import { defaultResumeData } from '@lib/types/resume'
import { Loader2 } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'

export default function ResumePage() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState<any>(defaultResumeData)

  const fetchResume = async (currentSession: Session | null) => {
    try {
      const { data: resume, error } = await supabase
        .from('resume')
        .select('data')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (error || !resume?.data) return

      const raw = resume.data

      // 비인증 사용자: 민감정보 제거
      if (!currentSession) {
        if (raw.profile) {
          delete raw.profile.phone
          delete raw.profile.photo
        }
        delete raw.education
        delete raw.customSections
      }

      setResumeData({
        ...defaultResumeData,
        ...raw,
        profile: { ...defaultResumeData.profile, ...(raw.profile || {}) },
      })
    } catch (e) {
      console.error('Resume fetch error:', e)
    }
  }

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      await fetchResume(session)
      setIsLoading(false)
    }

    init()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      fetchResume(session) // 로그인/로그아웃 시 다시 fetch (권한별 데이터 변경)
    })

    return () => { authListener?.subscription.unsubscribe() }
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <section className="resume-page">
      {session && (
        <div className="print:hidden flex justify-end mb-6 gap-2">
          <ResumeActions />
        </div>
      )}
      <ResumeTemplate data={resumeData} session={session} />
    </section>
  )
}
