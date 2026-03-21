import { openai } from '@ai-sdk/openai'

export type ModelProvider = 'openai' | 'anthropic'

export function getModel(provider: ModelProvider = 'openai') {
  switch (provider) {
    case 'openai':
      return openai('gpt-4o-mini')
    case 'anthropic':
      // @ai-sdk/anthropic 설치 후 활성화
      // import { anthropic } from '@ai-sdk/anthropic'
      // return anthropic('claude-3-5-haiku-20241022')
      throw new Error('Anthropic provider not yet configured')
    default:
      return openai('gpt-4o-mini')
  }
}

export const DEFAULT_PROVIDER: ModelProvider =
  (process.env.AI_PROVIDER as ModelProvider) || 'openai'
