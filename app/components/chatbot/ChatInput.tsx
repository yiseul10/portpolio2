'use client'

import { type FormEvent, useRef, useEffect } from 'react'

interface ChatInputProps {
  input: string
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}

export function ChatInput({ input, isLoading, onInputChange, onSubmit }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 자동 높이 조절
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px'
    }
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) {
        onSubmit(e as unknown as FormEvent<HTMLFormElement>)
      }
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="px-3.5 py-3 border-t border-gray-100 dark:border-zinc-800 flex gap-2 items-end"
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={onInputChange}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요..."
        disabled={isLoading}
        rows={1}
        className="flex-1 px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm outline-none resize-none disabled:opacity-50 placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="w-9 h-9 bg-zinc-900 dark:bg-zinc-100 rounded-xl flex items-center justify-center text-white dark:text-zinc-900 text-sm flex-shrink-0 disabled:opacity-30 hover:opacity-80 transition-opacity"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </form>
  )
}
