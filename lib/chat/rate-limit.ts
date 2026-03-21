import { supabase } from '@lib/superbase'

const DAILY_LIMIT = 20

function getTodayStart(): string {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now.toISOString()
}

export async function checkRateLimit(ip: string): Promise<{
  allowed: boolean
  remaining: number
}> {
  const todayStart = getTodayStart()

  const { count, error } = await supabase
    .from('chat_logs')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', todayStart)

  if (error) {
    // DB 에러 시 허용 (로그 저장 실패해도 대화는 가능하게)
    console.error('Rate limit check failed:', error)
    return { allowed: true, remaining: DAILY_LIMIT }
  }

  const used = count ?? 0
  const remaining = Math.max(0, DAILY_LIMIT - used)

  return {
    allowed: used < DAILY_LIMIT,
    remaining,
  }
}

export async function getRemainingCount(ip: string): Promise<number> {
  const todayStart = getTodayStart()

  const { count, error } = await supabase
    .from('chat_logs')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', todayStart)

  if (error) {
    return DAILY_LIMIT
  }

  return Math.max(0, DAILY_LIMIT - (count ?? 0))
}
