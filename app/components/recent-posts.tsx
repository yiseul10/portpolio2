'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@lib/superbase'
import { CubeCluster } from '@/app/components/icons/cube-cluster'
import { PostItem } from '@/app/components/post-item'

export function RecentPosts() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .eq('category', 'experience')
        .order('created_at', { ascending: false })
        .range(0, 1)

      if (data) setPosts(data)
    }
    fetch()
  }, [])

  if (posts.length === 0) return null


  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex items-center gap-1 -mb-6">
        <span className="px-2.5 py-1 rounded-sm text-xs font-medium bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900">
          Recent
        </span>
        <span className="px-2.5 py-1 rounded-sm text-xs font-medium bg-[#efe4bb]/80 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
          Experience
        </span>
      </div>
      {posts.map((post, index) => (
        <div
          key={post.slug}
          className={`border-b-2 border-neutral-100 dark:border-neutral-800 py-4 ${index === 0 ? 'flex items-center gap-4' : ''}`}
        >
          <div className="flex-1 min-w-0">
            <PostItem post={post} showBorder={false} />
          </div>
          {index === 0 && (
            <div className="hidden min-[480px]:block w-32 flex-shrink-0">
              <CubeCluster className="w-full h-auto object-contain opacity-80 text-neutral-400 dark:text-neutral-600" />
            </div>
          )}
        </div>
      ))}

      <div className="pb-4">
        <Link
          href="/work"
          className="text-base font-serif font-semibold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors tracking-wide"
        >
          All works →
        </Link>
      </div>
    </div>
  )
}
