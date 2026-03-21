'use client'

import { useState, useEffect, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import Image from 'next/image'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import {Bot} from "lucide-react";
import { toast } from 'sonner'

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [rateLimitError, setRateLimitError] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const {
    messages,
    status,
    sendMessage,
    setMessages,
    error,
  } = useChat({
    onError(error) {
      console.error('Chat error:', error)
      if (error.message.includes('429') || error.message.includes('제한')) {
        setRateLimitError(true)
        setRemaining(0)
      } else {
        toast.error('답변을 생성하는 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.')
      }
    },
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  // 남은 횟수 초기 조회
  const fetchRemaining = useCallback(async () => {
    try {
      const res = await fetch('/api/chat')
      const data = await res.json()
      setRemaining(data.remaining)
      setRateLimitError(data.remaining <= 0)
    } catch {
      // 무시
    }
  }, [])

  useEffect(() => {
    if (isOpen && remaining === null) {
      fetchRemaining()
    }
  }, [isOpen, remaining, fetchRemaining])

  // 메시지 전송 후 남은 횟수 업데이트
  useEffect(() => {
    if (status === 'ready' && messages.length > 0) {
      fetchRemaining()
    }
  }, [status, messages.length, fetchRemaining])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const text = inputValue
    setInputValue('')
    await sendMessage({ text })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }

  const toggleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* 채팅 패널 */}
      <div
        className={`cursor-pointer fixed bottom-20 right-8 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] max-h-[calc(100vh-7rem)] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-zinc-800 z-50 transition-all duration-300 origin-bottom-right ${
          isOpen
            ? 'scale-100 opacity-100 pointer-events-auto'
            : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {/* 헤더 */}
        <div className="px-4 py-3.5 bg-zinc-900 dark:bg-zinc-800 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-zinc-700 rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src="/images/avatar.png"
                alt="이슬"
                width={26}
                height={26}
                className="object-contain"
              />
            </div>
            <div>
              <div className="font-semibold text-sm">이슬이에게 물어보세요</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">
                무엇이든 물어보세요?!
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 bg-white/10 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/20 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3L11 11M3 11L11 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 메시지 영역 */}
        <ChatMessages messages={messages} isLoading={isLoading} />

        {/* Rate limit 에러 메시지 */}
        {rateLimitError ? (
          <div className="px-3.5 py-3 border-t border-gray-100 dark:border-zinc-800 text-center text-sm text-zinc-500">
            오늘은 여기까지! 내일 다시 물어봐주세요 😊
          </div>
        ) : (
          <ChatInput
            input={inputValue}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        )}

        {/* 남은 횟수 */}
        {remaining !== null && (
          <div className="text-center pb-2 text-[10px] text-zinc-400">
            오늘 남은 횟수: {remaining}/20
          </div>
        )}
      </div>

      {/* FAB 버튼 */}
      <button
        onClick={toggleOpen}
        className="cursor-pointer fixed bottom-8 right-8 w-14 h-14 bg-neutral-800 shadow-xl shadow-amber-200/50  dark:bg-zinc-100 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-200 z-50 print:hidden"
        aria-label="챗봇 열기/닫기"
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white dark:text-zinc-900">
            <path d="M5 5L15 15M5 15L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center">
            <Bot className="text-white font-serif font-black text-xl"/>
          </div>
        )}
      </button>
    </>
  )
}
