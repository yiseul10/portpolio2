'use client'

import { Download, Pencil, Layers } from 'lucide-react'
import { AuthButton } from '@/app/blog/[slug]/components/AuthButton'
import { useRouter } from 'next/navigation'

interface ResumeActionsProps {
  versionId?: string
  versionName?: string
}

export function ResumeActions({ versionId, versionName }: ResumeActionsProps) {
  const router = useRouter()

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
        icon={Download}
        label="PDF 다운로드"
        variant="outline"
        size="sm"
        onClick={() => window.print()}
      />
    </>
  )
}
