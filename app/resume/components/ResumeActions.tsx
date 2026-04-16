'use client'

import { useState } from 'react'
import { Download, Pencil, Layers, FileText, Files } from 'lucide-react'
import { AuthButton } from '@/app/blog/[slug]/components/AuthButton'
import { useRouter } from 'next/navigation'

interface ResumeActionsProps {
  versionId?: string
  versionName?: string
}

export function ResumeActions({ versionId, versionName }: ResumeActionsProps) {
  const router = useRouter()
  const [includeCoverLetter, setIncludeCoverLetter] = useState(true)

  const handlePrint = () => {
    const cl = document.getElementById('cover-letter-section')
    const resumeContent = document.querySelector('.resume-content') as HTMLElement | null

    if (!includeCoverLetter && cl && resumeContent) {
      cl.style.display = 'none'
      resumeContent.style.pageBreakAfter = 'auto'
      window.print()
      cl.style.display = ''
      resumeContent.style.pageBreakAfter = ''
    } else {
      window.print()
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
