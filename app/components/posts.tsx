'use client'
import Link from 'next/link'
import {formatDate} from "@/app/blog/utils/post.server";
import { useEffect, useState } from 'react'
import {Card} from "@/components/ui/card";
import Image from 'next/image'
import {Session} from "@supabase/supabase-js";
import {supabase} from "@lib/superbase";
import {Badge} from "@/components/ui/badge";
import {Eye, EyeClosed} from "lucide-react";

export const dynamic = 'force-dynamic'

export function BlogPosts() {
  const [allBlogs, setAllBlogs] = useState<any[]>([])
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 세션 확인 및 블로그 데이터 로드
    const loadData = async () => {
      setIsLoading(true)

      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)

      let query = supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })

      // 인증되지 않은 경우만 published=true 조건 추가
      if (!session) {
        query = query.eq('published', true)
      }

      const { data, error } = await query

      if (error) {
        console.error('❌ Supabase error:', error.message)
        setAllBlogs([])
      } else {
        setAllBlogs(data || [])
      }

      setIsLoading(false)
    }

    loadData()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      // 인증 상태가 변경되면 데이터 다시 로드
      loadData()
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  if (isLoading) {
    return <div className="text-sm text-neutral-600 dark:text-neutral-400">로딩 중...</div>
  }

  if (!Array.isArray(allBlogs)) {
    return <div>블로그 글을 불러올 수 없습니다.</div>
  }

  return (
    <>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.created_at) > new Date(b.created_at)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => (
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
              {(!post.published && session) ? (
                  <Badge variant="destructive" className="text-[11px] opacity-90">
                    <EyeClosed className="w-3 h-3"/>
                  </Badge>
              ) : <Badge variant="secondary" className="text-[11px] opacity-90">
                <Eye className="w-3 h-3"/>
              </Badge>}
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
        ))}
    </>
  )
}
