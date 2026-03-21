'use client'

import type { UIMessage } from 'ai'
import { ChatAvatar } from './ChatAvatar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatBubbleProps {
  message: UIMessage
}

function getTextContent(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('')
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const content = getTextContent(message)

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3.5 py-2.5 rounded-tl-xl rounded-bl-xl rounded-br-xl text-sm max-w-[75%] leading-relaxed">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2 items-start">
      <ChatAvatar />
      <div className="bg-gray-100 dark:bg-zinc-800 px-3.5 py-2.5 rounded-tr-xl rounded-br-xl rounded-bl-xl text-sm max-w-[85%] leading-relaxed text-zinc-800 dark:text-zinc-200">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            ul: ({ children }) => <ul className="list-disc pl-4 my-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-4 my-1">{children}</ol>,
            li: ({ children }) => <li className="my-0.5">{children}</li>,
            p: ({ children }) => <p className="my-1 first:mt-0 last:mb-0">{children}</p>,
            code: ({ children }) => (
              <code className="bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded text-xs">{children}</code>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
