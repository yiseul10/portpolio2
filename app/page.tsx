import { FeaturedPost } from '@/app/components/featured-post'
import { RecentPosts } from '@/app/components/recent-posts'

export default function Page() {
  return (
    <section className="w-full flex flex-col items-center">
      {/* Page Title */}
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-8 w-full tracking-tight font-serif">
        Archive
      </h1>

      {/* Featured / About Card */}
      <FeaturedPost />

      {/* Post List */}
      <div className="w-full mt-8">
        <RecentPosts />
      </div>
    </section>
  )
}
