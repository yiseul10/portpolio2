'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Bold, Italic, RemoveFormatting } from 'lucide-react'
import { useEffect } from 'react'

interface CoverLetterEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

const COLORS = [
  { value: '', label: '기본' },
  { value: '#111111', label: '검정' },
  { value: '#555555', label: '회색' },
  { value: '#1a56db', label: '파랑' },
  { value: '#0e9f6e', label: '초록' },
  { value: '#e3a008', label: '노랑' },
  { value: '#e02424', label: '빨강' },
  { value: '#7e3af2', label: '보라' },
]

export function CoverLetterEditor({ value, onChange, placeholder }: CoverLetterEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        code: false,
      }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: placeholder || '내용을 작성하세요',
      }),
    ],
    immediatelyRender: false,
    content: value || '',
    onUpdate({ editor }) {
      const html = editor.getHTML()
      onChange(html === '<p></p>' ? '' : html)
    },
  })

  useEffect(() => {
    if (!editor || editor.isFocused) return
    const current = editor.getHTML()
    const incoming = value || ''
    if (current !== incoming) {
      editor.commands.setContent(incoming || '')
    }
  }, [value, editor])

  if (!editor) return null

  const btn = (active: boolean) =>
    `p-1.5 rounded cursor-pointer transition-colors ${
      active
        ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900'
        : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
    }`

  const activeColor = COLORS.find(c => c.value && editor.isActive('textStyle', { color: c.value }))?.value || ''

  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 flex-wrap">
        {/* 텍스트 서식 */}
        <button type="button" className={btn(editor.isActive('bold'))}
          onClick={() => editor.chain().focus().toggleBold().run()} title="굵게 (Ctrl+B)">
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={btn(editor.isActive('italic'))}
          onClick={() => editor.chain().focus().toggleItalic().run()} title="기울임 (Ctrl+I)">
          <Italic className="h-3.5 w-3.5" />
        </button>

        <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-600 mx-1" />

        {/* 헤딩 */}
        <button type="button"
          className={btn(editor.isActive('heading', { level: 2 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="큰 제목">
          <span className="text-xs font-bold leading-none">H2</span>
        </button>
        <button type="button"
          className={btn(editor.isActive('heading', { level: 3 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="중간 제목">
          <span className="text-xs font-bold leading-none">H3</span>
        </button>

        <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-600 mx-1" />

        {/* 색상 팔레트 */}
        <div className="flex items-center gap-0.5">
          {COLORS.map(({ value: color, label }) => (
            <button
              key={label}
              type="button"
              title={label}
              onClick={() => {
                if (!color) {
                  editor.chain().focus().unsetColor().run()
                } else {
                  editor.chain().focus().setColor(color).run()
                }
              }}
              className={`w-4 h-4 rounded-full border cursor-pointer transition-all ${
                activeColor === color && color
                  ? 'ring-2 ring-offset-1 ring-neutral-400 scale-110'
                  : 'hover:scale-110'
              } ${!color ? 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-[8px] flex items-center justify-center font-bold text-neutral-500' : 'border-transparent'}`}
              style={color ? { backgroundColor: color } : {}}
            >
              {!color && '×'}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-600 mx-1" />

        {/* 서식 초기화 */}
        <button type="button" className={btn(false)}
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          title="서식 초기화">
          <RemoveFormatting className="h-3.5 w-3.5" />
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="cl-editor px-3 py-2 min-h-[100px] text-sm"
      />
    </div>
  )
}
