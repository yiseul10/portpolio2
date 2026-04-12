'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { CoverLetterEditor } from './CoverLetterEditor'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMemo } from 'react'

function SortableSection({
  id,
  index,
  section,
  onUpdate,
  onRemove,
}: {
  id: string
  index: number
  section: { title: string; content: string }
  onUpdate: (field: 'title' | 'content', value: string) => void
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 space-y-2 bg-background"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-600 shrink-0"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <Input
          className="flex-1 text-sm font-semibold border-none p-0 h-auto focus-visible:ring-0"
          placeholder="섹션 제목"
          value={section.title}
          onChange={(e) => onUpdate('title', e.target.value)}
        />
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
      <CoverLetterEditor
        value={section.content}
        onChange={(html) => onUpdate('content', html)}
        placeholder="내용을 작성하세요"
      />
    </div>
  )
}

export function CoverLetterSection() {
  const { setValue, watch } = useFormContext()
  const sections: { title: string; content: string }[] = watch('cover_letter.sections') || []

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // DnD는 안정적인 id가 필요하므로 index 기반 id 사용
  const ids = useMemo(() => sections.map((_, i) => `cl-section-${i}`), [sections.length])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = ids.indexOf(active.id as string)
    const newIndex = ids.indexOf(over.id as string)
    setValue('cover_letter.sections', arrayMove(sections, oldIndex, newIndex))
  }

  const addSection = () => {
    setValue('cover_letter.sections', [...sections, { title: '', content: '' }])
  }

  const removeSection = (i: number) => {
    setValue('cover_letter.sections', sections.filter((_, idx) => idx !== i))
  }

  const updateSection = (i: number, field: 'title' | 'content', value: string) => {
    const updated = [...sections]
    updated[i] = { ...updated[i], [field]: value }
    setValue('cover_letter.sections', updated)
  }

  return (
    <section className="space-y-4 pt-2">
      <h3 className="text-base font-semibold">Cover Letter</h3>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sections.map((section, i) => (
              <SortableSection
                key={ids[i]}
                id={ids[i]}
                index={i}
                section={section}
                onUpdate={(field, value) => updateSection(i, field, value)}
                onRemove={() => removeSection(i)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button type="button" variant="outline" size="sm" onClick={addSection}>
        <Plus className="h-4 w-4 mr-1" /> 섹션 추가
      </Button>
    </section>
  )
}
