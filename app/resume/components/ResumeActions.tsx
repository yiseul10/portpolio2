'use client'

import { useState } from 'react'
import { Download, Pencil, Layers, FileText, Files } from 'lucide-react'
import { AuthButton } from '@/app/blog/[slug]/components/AuthButton'
import { useRouter } from 'next/navigation'

interface ResumeActionsProps {
  versionId?: string
  versionName?: string
  profileName?: string
}

const sanitizePrintTitle = (value: string) =>
  value.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '').trim()

export function ResumeActions({ versionId, versionName, profileName }: ResumeActionsProps) {
  const router = useRouter()
  const [includeCoverLetter, setIncludeCoverLetter] = useState(true)

  const handlePrint = () => {
    const cl = document.getElementById('cover-letter-section')
    const resumeContent = document.querySelector('.resume-content') as HTMLElement | null
    const originalTitle = document.title
    const name = sanitizePrintTitle(profileName || '김이슬') || '김이슬'
    const printTitle = includeCoverLetter
      ? `${name}_이력서_경력기술서`
      : `${name}_이력서`

    let restored = false
    const restorePrintState = () => {
      if (restored) return
      restored = true
      document.title = originalTitle
      if (cl && resumeContent) {
        cl.style.display = ''
        resumeContent.style.pageBreakAfter = ''
      }
      window.removeEventListener('afterprint', restorePrintState)
      window.removeEventListener('focus', restorePrintState)
    }

    document.title = printTitle
    window.addEventListener('afterprint', restorePrintState)
    window.addEventListener('focus', restorePrintState)

    if (!includeCoverLetter && cl && resumeContent) {
      cl.style.display = 'none'
      resumeContent.style.pageBreakAfter = 'auto'
    }

    try {
      window.print()
    } catch (error) {
      restorePrintState()
      throw error
    }
  }

  return (
    <>
      <AuthButton
        icon={Layers}
        label="버전 관리"
        variant="outline"
        size="sm"
        onClick={() => router.push('/resume/versions')}
      />
      <AuthButton
        icon={Pencil}
        label="수정"
        variant="outline"
        size="sm"
        onClick={() => router.push(versionId ? `/resume/edit?v=${versionId}` : '/resume/edit')}
      />
      <AuthButton
        icon={includeCoverLetter ? Files : FileText}
        label={includeCoverLetter ? '이력서 + 커버레터' : '이력서만'}
        variant="ghost"
        size="sm"
        onClick={() => setIncludeCoverLetter(prev => !prev)}
      />
      <AuthButton
        icon={Download}
        label="PDF 다운로드"
        variant="outline"
        size="sm"
        onClick={handlePrint}
      />
    </>
  )
}
