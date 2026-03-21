import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { headers } from 'next/headers'
import { checkRateLimit, getRemainingCount } from '@lib/chat/rate-limit'
import { buildContext } from '@lib/chat/build-context'
import { getModel, DEFAULT_PROVIDER } from '@lib/chat/model-config'

export const runtime = 'nodejs'

async function getClientIP(): Promise<string> {
  const headersList = await headers()
  return (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown'
  )
}

export async function POST(req: Request) {
  // API 키 사전 검증
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: 'AI 서비스 설정에 문제가 있어요. 관리자에게 알려주세요.' },
      { status: 500 }
    )
  }

  const ip = await getClientIP()

  // Rate limit 체크
  const { allowed, remaining } = checkRateLimit(ip)
  if (!allowed) {
    return Response.json(
      { error: '오늘 사용 횟수를 모두 사용했어요. 내일 다시 물어봐주세요!' },
      {
        status: 429,
        headers: { 'X-RateLimit-Remaining': '0' },
      }
    )
  }

  const { messages }: { messages: UIMessage[] } = await req.json()

  // 시스템 프롬프트 조립
  const systemPrompt = await buildContext()

  // UIMessage → ModelMessage 변환
  const modelMessages = await convertToModelMessages(messages)

  // 스트리밍 호출
  const result = streamText({
    model: getModel(DEFAULT_PROVIDER),
    system: systemPrompt,
    messages: modelMessages,
    maxOutputTokens: 500,
  })

  return result.toUIMessageStreamResponse()
}

// 남은 횟수 조회용 GET 엔드포인트
export async function GET() {
  const ip = await getClientIP()
  const remaining = getRemainingCount(ip)

  return Response.json({ remaining })
}
