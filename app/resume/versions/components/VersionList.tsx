'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Pencil,
  Trash2,
  Copy,
  Star,
  StarOff,
} from 'lucide-react'
import { toast } from 'sonner'
import { setActiveVersion, deleteVersion, duplicateVersion } from '@/app/resume/actions'

interface Version {
  id: string
  name: string
  memo: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export function VersionList({ versions }: { versions: Version[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSetActive = async (id: string) => {
    setLoading(id)
    const { error } = await setActiveVersion(id)
    if (error) toast.error('활성화 실패')
    else {
      toast.success('활성 버전이 변경되었습니다.')
      router.refresh()
    }
    setLoading(null)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 버전을 삭제하시겠습니까?`)) return
    setLoading(id)
    const { error } = await deleteVersion(id)
    if (error) toast.error(error.message || '삭제 실패')
    else {
      toast.success('삭제되었습니다.')
      router.refresh()
    }
    setLoading(null)
  }

  const handleDuplicate = async (id: string, name: string) => {
    const newName = prompt('복제할 버전 이름:', `${name} (복사)`)
    if (!newName) return
    setLoading(id)
    const { error } = await duplicateVersion(id, newName)
    if (error) toast.error('복제 실패')
    else {
      toast.success('복제되었습니다.')
      router.refresh()
    }
    setLoading(null)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'short', day: 'numeric',
    })
  }

  return (
    <div className="space-y-3">
      {versions.map((v) => (
        <div
          key={v.id}
          className={`border rounded-lg p-4 flex items-center justify-between gap-4 ${
            v.is_active
              ? 'border-neutral-800 dark:border-neutral-200 bg-neutral-50 dark:bg-neutral-900'
              : 'border-neutral-200 dark:border-neutral-700'
          }`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{v.name}</span>
              {v.is_active && <Badge variant="secondary">공개 중</Badge>}
            </div>
            {v.memo && <p className="text-xs text-neutral-500 mt-1 truncate">{v.memo}</p>}
            <p className="text-xs text-neutral-400 mt-1">
              수정: {formatDate(v.updated_at)} / 생성: {formatDate(v.created_at)}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost" size="sm"
              title={v.is_active ? '현재 공개 중' : '이 버전을 공개'}
              disabled={v.is_active || loading === v.id}
              onClick={() => handleSetActive(v.id)}
            >
              {v.is_active ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost" size="sm"
              title="편집"
              onClick={() => router.push(`/resume/edit?v=${v.id}`)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" size="sm"
              title="복제"
              disabled={loading === v.id}
              onClick={() => handleDuplicate(v.id, v.name)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" size="sm"
              title="삭제"
              disabled={v.is_active || loading === v.id}
              onClick={() => handleDelete(v.id, v.name)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}

      {versions.length === 0 && (
        <p className="text-center text-neutral-400 py-8">버전이 없습니다. 새 버전을 만들어 보세요.</p>
      )}
    </div>
  )
}
