'use client'
import Link from 'next/link'
import {formatDate} from "@/app/blog/utils/post.server";
import { useEffect, useState, useCallback } from 'react'
import {Card} from "@/components/ui/card";
import Image from 'next/image'
import {Session} from "@supabase/supabase-js";
import {supabase} from "@lib/superbase";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Eye, EyeClosed, ChevronLeft, ChevronRight, ArrowRight} from "lucide-react";

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 10

interface BlogPostsProps {
  limit?: number           // 메인페이지용: 최근 N개만
  showMoreLink?: boolean   // 메인페이지용: 더보기 링크
  showFilter?: boolean     // 블로그페이지용: 공개/비공개 필터
  showPagination?: boolean // 블로그페이지용: 페이징
}

type FilterType = 'published' | 'draft'

function PostCard({ post, session }: { post: any; session: Session | null }) {
  return (
    <Link
      key={post.slug}
      className="flex flex-col mb-3"
      href={`/blog/${post.slug}`}
    >
      <Card className="px-4">
        <div className="flex items-center justify-between">
          <div className="w-full flex flex-col space-x-0 md:space-x-2">
            <div className="flex gap-1 items-center justify-between">
              <p className="text-neutral-900 dark:text-neutral-100 font-bold text-[13px] hover:underline">
                {post.title}
              </p>
              {session && (
                !post.published ? (
                  <Badge variant="destructive" className="text-[11px] opacity-90">
                    <EyeClosed className="w-3 h-3" />
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[11px] opacity-90">
                    <Eye className="w-3 h-3" />
                  </Badge>
                )
              )}
            </div>
            <p className="text-neutral-600 text-xs font-semibold dark:text-neutral-400 min-w-[160px] tabular-nums">
              {formatDate(post.created_at, false)}
            </p>
          </div>
          {post?.image && (
            <div className="ml-4 shrink-0">
              <Image
                src={post.image}
                alt={post.title}
                width={140}
                height={80}
                className="rounded-md object-cover"
              />
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}

export function BlogPosts({
  limit,
  showMoreLink = false,
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

    // limit 모드 (메인 페이지): 공개글만 N개
    if (limit) {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range(0, limit - 1)

      if (error) {
        console.error('❌ Supabase error:', error.message)
        setPosts([])
      } else {
        setPosts(data || [])
      }
      setIsLoading(false)
      return
    }

    // 블로그 페이지: 필터 + 페이징
    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (!currentSession) {
      // 비로그인: 공개글만
      query = query.eq('published', true)
    } else {
      // 로그인: 필터에 따라
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
      console.error('❌ Supabase error:', error.message)
      setPosts([])
      setTotalCount(0)
    } else {
      setPosts(data || [])
      setTotalCount(count || 0)
    }

    setIsLoading(false)
  }, [limit, filter, page, showPagination])

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

  // 필터나 페이지 변경 시 다시 로드
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
        <div className="flex gap-2 mb-4">
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
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} session={session} />
      ))}

      {/* 더보기 링크 (메인 페이지) */}
      {showMoreLink && (
        <Link href="/blog" className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mt-2 transition-colors">
          더보기
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}

      {/* 페이징 (블로그 페이지) */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
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
