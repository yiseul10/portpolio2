import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { baseUrl } from 'app/sitemap'
import { supabase } from "@lib/superbase";
import type { Metadata } from 'next'
import {formatDate} from "@/app/blog/utils/post.server";
import {PostActions} from "@/app/blog/[slug]/components/PostActions";
import {createServerClient} from "@supabase/ssr";
import {cookies} from "next/headers";
import {PostGuard} from "@/app/blog/[slug]/components/PostGuard";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from('posts')
    .select('slug')
    .eq('published', true)

  return posts?.filter(post => post.slug !== 'supplier_system')
      .map((post) => ({
        slug: post.slug,
      })) ?? []
}

export async function generateMetadata({ params }): Promise<Metadata | undefined> {
    // 일단 모든 포스트를 가져옴
    const { data: post } = await supabase
        .from('posts')
        .select('title, description, image, created_at, slug, published')
        .eq('slug', params.slug)
        .single()

    // 포스트가 없으면 undefined 반환
    if (!post) return undefined

    // 공개된 포스트만 메타데이터 생성 (비공개는 크롤링 방지)
    if (!post.published) {
        return {
            title: 'Private Post',
            robots: {
                index: false,
                follow: false,
            }
        }
    }

  const {
    title,
    description,
    image,
    created_at: publishedTime,
    slug,
  } = post

  const ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Blog({ params }) {
    // 일단 published 체크 없이 포스트를 가져옴
    const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', params.slug)
        .single()

    if (!post) {
        notFound()
    }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            datePublished: post.created_at,
            dateModified: post.created_at,
            description: post.description,
            image: post.image
              ? `${baseUrl}${post.image}`
              : `/og?title=${encodeURIComponent(post.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'My Portfolio',
            },
          }),
        }}
      />

        <PostGuard published={post.published}>
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="title font-semibold text-2xl tracking-tighter font-serif">
                        {post.title}
                    </h1>
                    <div className="flex justify-between items-center mt-2 mb-8 text-sm">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {formatDate(post.created_at)}
                        </p>
                    </div>
                </div>
                <PostActions slug={post.slug} postId={post.id} />
            </div>
            <article className="prose">
                <CustomMDX source={post.mdx_content} />
            </article>
        </PostGuard>
    </section>
  )
}
