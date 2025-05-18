'use client'
import Link from 'next/link'
import {formatDate, getBlogPosts} from "@/app/blog/utils/post.server";
import { useEffect, useState } from 'react'
import {Card} from "@/components/ui/card";
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export function BlogPosts() {
  const [allBlogs, setAllBlogs] = useState<any[]>([])

  useEffect(() => {
    getBlogPosts().then(setAllBlogs)
  }, [])

  if (!Array.isArray(allBlogs)) {
    return <div>블로그 글을 불러올 수 없습니다.</div>
  }

  console.log(allBlogs)
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
              <p className="text-neutral-900 dark:text-neutral-100 font-bold text-[13px] hover:underline">
                {post.title}
              </p>
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
