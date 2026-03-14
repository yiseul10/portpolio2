import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold">
        About yiseul
      </h1>
        <div className="flex flex-col ">
      <span className="mb-4 text-sm font-medium">
          사용자 중심의 확장 가능한 UI를 만듭니다.<br/>
          문제의 본질을 빠르게 파악하고, 비즈니스 가치로 이어지는 솔루션을 지향합니다.</span>
            <span className="text-sm">
       I build user-centered, scalable UIs.<br/>
       I identify core problems quickly and create solutions that drive business value.<br/><br/>
      </span>
        </div>
      <div className="mt-4 mb-10">
        <BlogPosts limit={3} showMoreLink />
      </div>
    </section>
  )
}
