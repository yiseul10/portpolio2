import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  // 1. resume 데이터 가져오기
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: resume, error } = await supabase
    .from('resume')
    .select('data')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !resume?.data) {
    return NextResponse.json({ data: null }, { status: 404 })
  }

  // 2. 인증 확인
  const cookieStore = await cookies()
  const serverSupabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: { session } } = await serverSupabase.auth.getSession()

  // 3. 비인증 사용자: 민감정보 제거
  if (!session) {
    const safeData = { ...resume.data }

    // profile에서 민감정보 제거
    if (safeData.profile) {
      safeData.profile = { ...safeData.profile }
      delete safeData.profile.phone
      delete safeData.profile.photo
    }

    // 학력 제거
    delete safeData.education

    // customSections 제거 (자격증/기타경력)
    delete safeData.customSections

    return NextResponse.json({ data: safeData, authenticated: false })
  }

  // 4. 인증된 사용자: 전체 데이터
  return NextResponse.json({ data: resume.data, authenticated: true })
}
