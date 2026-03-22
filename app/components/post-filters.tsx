'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeClosed } from 'lucide-react'

interface PostFiltersProps {
  showCategoryFilter?: boolean
  authenticated?: boolean
}

export function PostFilters({ showCategoryFilter = false, authenticated = false }: PostFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category') || 'all'
  const currentFilter = searchParams.get('filter') || null

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    // 필터 변경 시 페이지 초기화
    params.delete('page')
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      {showCategoryFilter && (['all', 'study', 'diary'] as const).map((cat) => (
        <button
          key={cat}
          className={`px-3 py-1 rounded-sm text-xs font-medium transition-colors ${
            currentCategory === cat
              ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900'
              : 'bg-[#efe4bb]/50 text-neutral-600 hover:bg-[#efe4bb] dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
          }`}
          onClick={() => updateParams({ category: cat === 'all' ? null : cat })}
        >
          {cat === 'all' ? 'All' : cat === 'study' ? 'Study' : 'Diary'}
        </button>
      ))}
      {authenticated && (
        <>
          {showCategoryFilter && <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-700 mx-1" />}
          <button
            className={`px-3 py-1 rounded-sm text-xs font-medium transition-colors flex items-center gap-1.5 ${
              currentFilter === 'published'
                ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900'
                : 'bg-[#efe4bb]/50 text-neutral-600 hover:bg-[#efe4bb] dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
            }`}
            onClick={() => updateParams({ filter: currentFilter === 'published' ? null : 'published' })}
          >
            <Eye className="w-3.5 h-3.5" />
            공개
          </button>
          <button
            className={`px-3 py-1 rounded-sm text-xs font-medium transition-colors flex items-center gap-1.5 ${
              currentFilter === 'draft'
                ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900'
                : 'bg-[#efe4bb]/50 text-neutral-600 hover:bg-[#efe4bb] dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
            }`}
            onClick={() => updateParams({ filter: currentFilter === 'draft' ? null : 'draft' })}
          >
            <EyeClosed className="w-3.5 h-3.5" />
            비공개
          </button>
        </>
      )}
    </div>
  )
}
