import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold">
        About yiseul
      </h1>
      <p className="mb-4 text-sm">
        I focus on building scalable and efficient UI architectures, while deeply understanding the operational workflows of actual users.
I take initiative in solving problems and contributing to improvements that align closely with business and user needs.<br/>
I aim to identify issues quickly and deliver solutions that generate real,
          tangible value.<br/><br/>
          운영 효율성과 확장성을 최우선으로 고려한 UI 아키텍처 설계에 집중하며,<br/>
          {/*실제 사용자인 운영팀의 업무 흐름을 깊이 이해하고 문제 해결 과정에 자율적으로 참여합니다.<br/>*/}
          문제를 빠르게 파악하고, 실질적인 가치를 창출하는 솔루션 개발을 지향합니다.
      </p>
      <div className="my-10">
        <BlogPosts />
      </div>
    </section>
  )
}
