import { FeaturedPost } from '@/app/components/featured-post'
import { RecentPosts } from '@/app/components/recent-posts'

export default function Page() {
  return (
    <section className="w-full flex flex-col items-center">
      {/* Featured / About Card */}
      <FeaturedPost />

      {/* Post List */}
      <div className="w-full mt-8">
        <RecentPosts />
      </div>
    </section>
  )
}
