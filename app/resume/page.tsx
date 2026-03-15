'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@lib/superbase'
import { ResumeTemplate } from './components/ResumeTemplate'
import { ResumeActions } from './components/ResumeActions'
import { defaultResumeData } from '@lib/types/resume'
import { Loader2 } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'
import Link from 'next/link'

export default function ResumePage() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState<any>(defaultResumeData)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)

      if (session) {
        const freshClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data: resume } = await freshClient
          .from('resume')
          .select('data')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single()

        const raw = resume?.data || {}
        setResumeData({
          ...defaultResumeData,
          ...raw,
          profile: { ...defaultResumeData.profile, ...(raw.profile || {}) },
        })
      }

      setIsLoading(false)
    }

    init()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) setIsLoading(false)
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

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-neutral-500">
        <p className="text-lg mb-4">로그인이 필요합니다.</p>
        <Link href="/login" className="text-sm underline hover:text-neutral-800 dark:hover:text-neutral-200">
          로그인하기
        </Link>
      </div>
    )
  }

  return (
    <section className="resume-page">
      <div className="print:hidden flex justify-end mb-6 gap-2">
        <ResumeActions />
      </div>
      <ResumeTemplate data={resumeData} />
    </section>
  )
}
