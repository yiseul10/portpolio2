import { getBlogPages } from '@/app/blog/utils/mdx.server'
import { siteUrl } from '@lib/site'

export const baseUrl = siteUrl

export default async function sitemap() {
  let blogs = getBlogPages().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  let routes = ['', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}
