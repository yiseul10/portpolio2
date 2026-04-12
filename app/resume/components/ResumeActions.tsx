'use client'

import { Download, Pencil, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
      {versionName && (
        <span className="text-sm text-neutral-500 self-center mr-2">
          {versionName}
        </span>
      )}
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
      <Button onClick={() => window.print()} variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        PDF 다운로드
      </Button>
    </>
  )
}
