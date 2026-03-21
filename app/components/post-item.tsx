import Link from 'next/link'
import { formatDate } from '@/app/blog/utils/post.server'
import { Session } from '@supabase/supabase-js'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeClosed } from 'lucide-react'

interface PostItemProps {
  post: any
  session?: Session | null
  showDescription?: boolean
  showBorder?: boolean
}

export function PostItem({ post, session, showDescription = true, showBorder = true }: PostItemProps) {
  return (
    <article className={`flex flex-col justify-between items-start ${showBorder ? 'border-b-2 border-neutral-100 dark:border-neutral-800 py-4' : ''}`}>
      <div className="w-full">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-bold leading-tight font-serif">
            <Link
              href={`/blog/${post.slug}`}
              className="post-title-hover"
            >
              {post.title}
            </Link>
          </h3>
          {session && (
            !post.published ? (
              <Badge variant="destructive" className="text-[11px] opacity-90 shrink-0">
                <EyeClosed className="w-3 h-3" />
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[11px] opacity-90 shrink-0">
                <Eye className="w-3 h-3" />
              </Badge>
            )
          )}
        </div>
        {showDescription && post.description && (
          <p className="mt-1 mb-2 text-gray-600 dark:text-neutral-400 leading-relaxed text-sm line-clamp-1">
            {post.description}
          </p>
        )}
        <div className="mt-1 text-xs text-gray-500 dark:text-neutral-500 font-medium tracking-wide">
          <span>{formatDate(post.created_at, false)}</span>
          {post.tags && post.tags.length > 0 && (
            <>
              <span className="mx-1">·</span>
              <span>{post.tags.join(', ')}</span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
