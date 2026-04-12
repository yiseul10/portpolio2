import { readFileSync } from 'fs'
import { join } from 'path'
import { supabase } from '@lib/superbase'
import { getBlogPosts } from '@/app/blog/utils/post.server'

function loadProfileMarkdown(): string {
  try {
    const filePath = join(process.cwd(), 'app', 'data', 'profile.md')
    return readFileSync(filePath, 'utf-8')
  } catch {
    return '프로필 정보를 불러올 수 없습니다.'
  }
}

async function fetchResumeData(): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('resume_versions')
      .select('resume_data')
      .eq('is_active', true)
      .single()

    if (error || !data) return '이력서 정보를 불러올 수 없습니다.'

    const resume = data.resume_data
    const parts: string[] = []

    if (resume.profile) {
      parts.push(`이름: ${resume.profile.name || ''}`)
      parts.push(`직함: ${resume.profile.title || ''}`)
    }

    if (resume.summary) {
      parts.push(`\n자기소개:\n${resume.summary}`)
    }

    if (resume.keywords?.length) {
      parts.push(`\n키워드: ${resume.keywords.join(', ')}`)
    }

    if (resume.skills?.length) {
      parts.push('\n기술 스택:')
      resume.skills.forEach((group: { category: string; items: string }) => {
        parts.push(`- ${group.category}: ${group.items}`)
      })
    }

    if (resume.experience?.length) {
      parts.push('\n경력:')
      resume.experience.forEach((exp: { company: string; role: string; startDate: string; endDate: string; descriptions?: { text: string }[] }) => {
        parts.push(`- ${exp.company} | ${exp.role} (${exp.startDate} ~ ${exp.endDate})`)
        exp.descriptions?.forEach((desc) => {
          if (desc.text) parts.push(`  - ${desc.text}`)
        })
      })
    }

    return parts.join('\n')
  } catch {
    return '이력서 정보를 불러올 수 없습니다.'
  }
}

async function fetchBlogSummary(): Promise<string> {
  try {
    const posts = await getBlogPosts()
    if (!posts.length) return '블로그 글이 없습니다.'

    const summaries = posts.slice(0, 10).map((post) => {
      return `- "${post.title}" (${post.category || '미분류'}) - ${post.summary || '요약 없음'}`
    })

    return '블로그 글 목록:\n' + summaries.join('\n')
  } catch {
    return '블로그 정보를 불러올 수 없습니다.'
  }
}

export async function buildContext(): Promise<string> {
  const [profile, resume, blog] = await Promise.all([
    loadProfileMarkdown(),
    fetchResumeData(),
    fetchBlogSummary(),
  ])

  return `너는 "이슬"이야. 프론트엔드 개발자이고, 이 포트폴리오 사이트의 주인이야.
방문자가 너에 대해 궁금한 걸 물어보면 1인칭으로 친근하게 답변해.

규칙:
- 반말이 아닌 존댓말 사용 (but 딱딱하지 않게)
- 모르는 건 솔직하게 "그건 아직 잘 모르겠어요"라고 말해
- 포트폴리오/이력서/블로그에 없는 정보를 지어내지 마
- 기술적인 질문에는 구체적으로 답변해
- 너무 길지 않게, 2-3문장 정도로 간결하게
- 한국어로 답변해

아래는 너에 대한 정보야:

---
${profile}
---
${resume}
---
${blog}
---`
}
