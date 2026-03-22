import { FeaturedPost } from '@/app/components/featured-post'
import { RecentPosts } from '@/app/components/recent-posts'
import { supabase } from '@lib/superbase'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const { data: resume } = await supabase
    .from('resume')
    .select('data')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  const keywords: string[] = resume?.data?.keywords || []

  return (
    <section className="w-full flex flex-col items-center">
      <FeaturedPost keywords={keywords} />
      <div className="w-full mt-8 px-1">
        <RecentPosts />
      </div>
    </section>
  )
}
