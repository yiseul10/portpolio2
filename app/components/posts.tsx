'use client'

import { useEffect, useState, useCallback } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@lib/superbase'
import { Button } from '@/components/ui/button'
import { Eye, EyeClosed, ChevronLeft, ChevronRight } from 'lucide-react'
import { PostItem } from '@/app/components/post-item'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 10

interface BlogPostsProps {
  showFilter?: boolean
  showPagination?: boolean
}

type FilterType = 'published' | 'draft'

export function BlogPosts({
  showFilter = false,
  showPagination = false,
}: BlogPostsProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('published')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const fetchPosts = useCallback(async (currentSession: Session | null) => {
    setIsLoading(true)

    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (!currentSession) {
      query = query.eq('published', true)
    } else {
      if (filter === 'published') {
        query = query.eq('published', true)
      } else {
        query = query.eq('published', false)
      }
    }

    if (showPagination) {
      const from = page * PAGE_SIZE
      const to = from + PAGE_SIZE - 1
      query = query.range(from, to)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase error:', error.message)
      setPosts([])
      setTotalCount(0)
    } else {
      setPosts(data || [])
      setTotalCount(count || 0)
    }

    setIsLoading(false)
  }, [filter, page, showPagination])

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      await fetchPosts(session)
    }
    init()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setPage(0)
      fetchPosts(session)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    fetchPosts(session)
  }, [filter, page, fetchPosts])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  if (isLoading) {
    return <div className="text-sm text-neutral-600 dark:text-neutral-400">로딩 중...</div>
  }

  if (!Array.isArray(posts) || posts.length === 0) {
    return <div className="text-sm text-neutral-500 py-4">글이 없습니다.</div>
  }

  return (
    <div>
      {/* 필터 탭 */}
      {showFilter && session && (
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'published' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setFilter('published'); setPage(0) }}
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            공개
          </Button>
          <Button
            variant={filter === 'draft' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setFilter('draft'); setPage(0) }}
          >
            <EyeClosed className="w-3.5 h-3.5 mr-1" />
            비공개
          </Button>
        </div>
      )}

      {/* 포스트 목록 */}
      <div className="w-full flex flex-col gap-8">
        {posts.map((post) => (
          <PostItem key={post.slug} post={post} session={session} />
        ))}
      </div>

      {/* 페이징 */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-neutral-600 dark:text-neutral-400 tabular-nums">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
