'use client'

import { Download, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthButton } from '@/app/blog/[slug]/components/AuthButton'
import { useRouter } from 'next/navigation'

export function ResumeActions() {
  const router = useRouter()

  return (
    <>
      <AuthButton
        icon={Pencil}
        label="수정"
        variant="outline"
        size="sm"
        onClick={() => router.push('/resume/edit')}
      />
      <Button onClick={() => window.print()} variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        PDF 다운로드
      </Button>
    </>
  )
}
