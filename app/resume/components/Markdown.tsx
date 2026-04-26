'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * 단일 라인 줄바꿈을 markdown hard break로 보존.
 */
const preserveBreaks = (text: string) => text.replace(/(?<!\n)\n(?!\n)/g, '  \n')

/**
 * 인라인 마크다운 — bold/italic/code/link만 지원, p 태그 래핑 안 함.
 * 경력 description 한 줄 안에서 `**숫자**`, `[링크](url)` 강조용.
 */
export function InlineMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <>{children}</>,
        a: ({ href, children }) => (
          <a href={href} className="underline underline-offset-2 hover:text-neutral-950" target="_blank" rel="noreferrer">
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="px-1 py-0.5 bg-neutral-100 rounded text-[0.9em] font-mono text-neutral-800 print:bg-neutral-100">
            {children}
          </code>
        ),
        strong: ({ children }) => <strong className="font-bold text-neutral-900">{children}</strong>,
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

/**
 * 블록 마크다운 — summary/긴 설명용. 단락·목록·표 지원.
 */
export function BlockMarkdown({ children }: { children: string }) {
  const text = preserveBreaks(children)
  return (
    <div className="md-block">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
          a: ({ href, children }) => (
            <a href={href} className="underline underline-offset-2 hover:text-neutral-950" target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-bold text-neutral-900">{children}</strong>,
          ul: ({ children }) => <ul className="list-disc ml-5 my-2 space-y-0.5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal ml-5 my-2 space-y-0.5">{children}</ol>,
          table: ({ children }) => (
            <div className="md-table-wrap my-3 overflow-x-auto">
              <table className="md-table w-full border-collapse text-[0.95em]">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="border-b border-neutral-400">{children}</thead>,
          th: ({ children }) => <th className="text-left font-semibold py-1.5 px-2 align-top">{children}</th>,
          td: ({ children }) => <td className="py-1.5 px-2 align-top border-b border-neutral-200">{children}</td>,
          code: ({ children }) => (
            <code className="px-1 py-0.5 bg-neutral-100 rounded text-[0.9em] font-mono text-neutral-800">
              {children}
            </code>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}
