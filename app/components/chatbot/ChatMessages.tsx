'use client'

import { useEffect, useRef } from 'react'
import { ChatBubble } from './ChatBubble'
import { ChatAvatar } from './ChatAvatar'
import type { UIMessage } from 'ai'

interface ChatMessagesProps {
  messages: UIMessage[]
  isLoading: boolean
}

const WELCOME_MESSAGE = '안녕하세요! 저는 이슬이에요 👋 프론트엔드 개발자로 일하고 있어요. 궁금한 거 편하게 물어보세요!'

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="px-3.5 py-3 flex flex-col gap-3">
      {/* 초기 인사 메시지 */}
      <div className="flex gap-2 items-start">
        <ChatAvatar />
        <div className="bg-neutral-100 dark:bg-zinc-800 px-3.5 py-2.5 rounded-tr-xl rounded-br-xl rounded-bl-xl text-sm max-w-[85%] leading-relaxed text-zinc-800 dark:text-zinc-200">
          {WELCOME_MESSAGE}
        </div>
      </div>

      {/* 대화 메시지 */}
      {messages.map((message) => (
        <ChatBubble
          key={message.id}
          message={message}
        />
      ))}

      {/* 로딩 인디케이터 */}
      {isLoading && messages[messages.length - 1]?.role === 'user' && (
        <div className="flex gap-2 items-start">
          <ChatAvatar />
          <div className="bg-gray-100 dark:bg-zinc-800 px-3.5 py-2.5 rounded-tr-xl rounded-br-xl rounded-bl-xl text-sm">
            <span className="inline-flex gap-1">
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
