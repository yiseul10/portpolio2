'use client'

import { useEffect, useState, useRef } from 'react'
import { useForm, FormProvider, useFieldArray, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertTriangle,
  Loader2,
  MoveLeft,
  Check,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ImagePlus,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@lib/superbase'
import { toast } from 'sonner'
import { revalidateResume } from '@/app/resume/actions'
import {
  resumeSchema,
  defaultResumeData,
  type ResumeData,
} from '@lib/types/resume'
import type { Session } from '@supabase/supabase-js'

// ─── Descriptions List ──────────────────────────────────
const LEVEL_CONFIG = [
  { symbol: '', indent: 0, label: '일반', next: 1 },
  { symbol: '•', indent: 0, label: '메인 (•)', next: 2 },
  { symbol: '◦', indent: 24, label: '서브 (◦)', next: 0 },
]

function DescriptionsList({ expIndex }: { expIndex: number }) {
  const { setValue, watch } = useFormContext<ResumeData>()
  const descriptions = watch(`experience.${expIndex}.descriptions`) || []

  const addItem = () => {
    setValue(`experience.${expIndex}.descriptions`, [
      ...descriptions,
      { text: '', level: 1 },
    ])
  }

  const removeItem = (i: number) => {
    setValue(
      `experience.${expIndex}.descriptions`,
      descriptions.filter((_: any, idx: number) => idx !== i)
    )
  }

  const updateText = (i: number, value: string) => {
    const updated = [...descriptions]
    updated[i] = { ...updated[i], text: value }
    setValue(`experience.${expIndex}.descriptions`, updated)
  }

  const cycleLevel = (i: number) => {
    const updated = [...descriptions]
    const current = updated[i].level ?? 1
    const config = LEVEL_CONFIG[current] || LEVEL_CONFIG[1]
    updated[i] = { ...updated[i], level: config.next }
    setValue(`experience.${expIndex}.descriptions`, updated)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">업무 내용</span>
        <Button type="button" variant="ghost" size="sm" onClick={addItem}>
          <Plus className="h-3 w-3 mr-1" /> 항목 추가
        </Button>
      </div>
      {descriptions.map((desc: any, i: number) => {
        const level = desc.level ?? 1
        const config = LEVEL_CONFIG[level] || LEVEL_CONFIG[1]
        return (
          <div key={i} className="flex items-start gap-2" style={{ paddingLeft: config.indent }}>
            <button
              type="button"
              className="w-4 text-center text-neutral-400 text-sm shrink-0 hover:text-neutral-700 cursor-pointer mt-2.5"
              title={`클릭하여 변경 (현재: ${config.label})`}
              onClick={() => cycleLevel(i)}
            >
              {config.symbol || '—'}
            </button>
            <Textarea
              className="flex-1 min-h-[36px] resize-none"
              rows={2}
              placeholder="업무 내용을 입력하세요"
              value={desc.text || ''}
              onChange={(e) => updateText(i, e.target.value)}
            />
            <Button type="button" variant="ghost" size="sm" className="mt-1" onClick={() => removeItem(i)}>
              <Trash2 className="h-3 w-3 text-red-500" />
            </Button>
          </div>
        )
      })}
      {descriptions.length === 0 && (
        <p className="text-xs text-neutral-400">항목 추가 버튼을 눌러 업무 내용을 추가하세요</p>
      )}
    </div>
  )
}

// ─── Reusable: Array item controls ──────────────────────
function ItemControls({
  index,
  total,
  onMove,
  onRemove,
}: {
  index: number
  total: number
  onMove: (from: number, to: number) => void
  onRemove: (i: number) => void
}) {
  return (
    <div className="flex gap-1">
      <Button type="button" variant="ghost" size="sm" disabled={index === 0} onClick={() => onMove(index, index - 1)}>
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="sm" disabled={index === total - 1} onClick={() => onMove(index, index + 1)}>
        <ChevronDown className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(index)}>
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  )
}

// ─── Experience Section ─────────────────────────────────
function ExperienceSection() {
  const { control } = useFormContext<ResumeData>()
  const { fields, append, remove, move } = useFieldArray({ control, name: 'experience' })

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitleInput name="sectionTitles.experience" />
        <Button type="button" variant="outline" size="sm" onClick={() => append({ company: '', role: '', startDate: '', endDate: '현재', descriptions: [] })}>
          <Plus className="h-4 w-4 mr-1" /> 추가
        </Button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-500">#{index + 1}</span>
            <ItemControls index={index} total={fields.length} onMove={move} onRemove={remove} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField control={control} name={`experience.${index}.company`} render={({ field }) => (
              <FormItem><FormLabel>회사명</FormLabel><FormControl><Input placeholder="회사명" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={control} name={`experience.${index}.role`} render={({ field }) => (
              <FormItem><FormLabel>직책</FormLabel><FormControl><Input placeholder="Frontend Developer" {...field} /></FormControl></FormItem>
            )} />
            <FormField control={control} name={`experience.${index}.startDate`} render={({ field }) => (
              <FormItem><FormLabel>시작일</FormLabel><FormControl><Input placeholder="2023.01" {...field} /></FormControl></FormItem>
            )} />
            <FormField control={control} name={`experience.${index}.endDate`} render={({ field }) => (
              <FormItem><FormLabel>종료일</FormLabel><FormControl><Input placeholder="현재" {...field} /></FormControl></FormItem>
            )} />
          </div>
          <DescriptionsList expIndex={index} />
        </div>
      ))}
    </section>
  )
}

// ─── Skills Section ─────────────────────────────────────
function SkillsSection() {
  const { control } = useFormContext<ResumeData>()
  const { fields, append, remove, move } = useFieldArray({ control, name: 'skills' })

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitleInput name="sectionTitles.skills" />
        <Button type="button" variant="outline" size="sm" onClick={() => append({ category: '', items: '' })}>
          <Plus className="h-4 w-4 mr-1" /> 추가
        </Button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-500">#{index + 1}</span>
            <ItemControls index={index} total={fields.length} onMove={move} onRemove={remove} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField control={control} name={`skills.${index}.category`} render={({ field }) => (
              <FormItem><FormLabel>카테고리 (선택)</FormLabel><FormControl><Input placeholder="Frontend" {...field} /></FormControl></FormItem>
            )} />
            <FormField control={control} name={`skills.${index}.items`} render={({ field }) => (
              <FormItem><FormLabel>스킬 (쉼표로 구분)</FormLabel><FormControl><Input placeholder="React, Next.js, TypeScript" {...field} /></FormControl></FormItem>
            )} />
          </div>
        </div>
      ))}
    </section>
  )
}

// ─── Education Section ──────────────────────────────────
function EducationSection() {
  const { control } = useFormContext<ResumeData>()
  const { fields, append, remove, move } = useFieldArray({ control, name: 'education' })

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitleInput name="sectionTitles.education" />
        <Button type="button" variant="outline" size="sm" onClick={() => append({ school: '', major: '', startDate: '', endDate: '' })}>
          <Plus className="h-4 w-4 mr-1" /> 추가
        </Button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-500">#{index + 1}</span>
            <ItemControls index={index} total={fields.length} onMove={move} onRemove={remove} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField control={control} name={`education.${index}.school`} render={({ field }) => (
              <FormItem><FormLabel>학교명</FormLabel><FormControl><Input placeholder="학교명" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={control} name={`education.${index}.major`} render={({ field }) => (
              <FormItem><FormLabel>전공</FormLabel><FormControl><Input placeholder="전공" {...field} /></FormControl></FormItem>
            )} />
            <FormField control={control} name={`education.${index}.startDate`} render={({ field }) => (
              <FormItem><FormLabel>시작일</FormLabel><FormControl><Input placeholder="2017.03" {...field} /></FormControl></FormItem>
            )} />
            <FormField control={control} name={`education.${index}.endDate`} render={({ field }) => (
              <FormItem><FormLabel>종료일</FormLabel><FormControl><Input placeholder="2021.02" {...field} /></FormControl></FormItem>
            )} />
          </div>
        </div>
      ))}
    </section>
  )
}

// ─── Certifications Section ─────────────────────────────
function CertificationsSection() {
  const { control } = useFormContext<ResumeData>()
  const { fields, append, remove, move } = useFieldArray({ control, name: 'certifications' })

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitleInput name="sectionTitles.certifications" />
        <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', startDate: '', endDate: '' })}>
          <Plus className="h-4 w-4 mr-1" /> 추가
        </Button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <FormField control={control} name={`certifications.${index}.name`} render={({ field }) => (
            <FormItem className="flex-1"><FormControl><Input placeholder="자격증, 수상, 활동 등" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name={`certifications.${index}.startDate`} render={({ field }) => (
            <FormItem className="w-24"><FormControl><Input placeholder="날짜" {...field} /></FormControl></FormItem>
          )} />
          <FormField control={control} name={`certifications.${index}.endDate`} render={({ field }) => (
            <FormItem className="w-24"><FormControl><Input placeholder="날짜" {...field} /></FormControl></FormItem>
          )} />
          <div className="flex gap-1 shrink-0">
            <ItemControls index={index} total={fields.length} onMove={move} onRemove={remove} />
          </div>
        </div>
      ))}
    </section>
  )
}

// ─── Custom Sections ────────────────────────────────────
function CustomSectionsEditor() {
  const { control, setValue, watch } = useFormContext<ResumeData>()
  const { fields, append, remove, move } = useFieldArray({ control, name: 'customSections' })

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">추가 섹션</h3>
        <Button type="button" variant="outline" size="sm" onClick={() => append({ title: '', items: [] })}>
          <Plus className="h-4 w-4 mr-1" /> 섹션 추가
        </Button>
      </div>
      {fields.map((field, sectionIndex) => (
        <div key={field.id} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <FormField control={control} name={`customSections.${sectionIndex}.title`} render={({ field }) => (
              <FormItem className="flex-1"><FormControl><Input placeholder="섹션 제목 (예: PROJECTS)" className="font-semibold" {...field} /></FormControl></FormItem>
            )} />
            <ItemControls index={sectionIndex} total={fields.length} onMove={move} onRemove={remove} />
          </div>
          <CustomSectionItems sectionIndex={sectionIndex} />
        </div>
      ))}
    </section>
  )
}

function CustomSectionItems({ sectionIndex }: { sectionIndex: number }) {
  const { setValue, watch } = useFormContext<ResumeData>()
  const items = watch(`customSections.${sectionIndex}.items`) || []

  const addItem = () => {
    setValue(`customSections.${sectionIndex}.items`, [...items, { text: '', startDate: '', endDate: '' }])
  }
  const removeItem = (i: number) => {
    setValue(`customSections.${sectionIndex}.items`, items.filter((_: any, idx: number) => idx !== i))
  }
  const updateField = (i: number, field: string, value: string) => {
    const updated = [...items]
    updated[i] = { ...updated[i], [field]: value }
    setValue(`customSections.${sectionIndex}.items`, updated)
  }

  return (
    <div className="space-y-2">
      {items.map((item: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <Input className="flex-1" placeholder="내용" value={item.text || ''} onChange={(e) => updateField(i, 'text', e.target.value)} />
          <Input className="w-24" placeholder="날짜" value={item.startDate || ''} onChange={(e) => updateField(i, 'startDate', e.target.value)} />
          <Input className="w-24" placeholder="날짜" value={item.endDate || ''} onChange={(e) => updateField(i, 'endDate', e.target.value)} />
          <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(i)}>
            <Trash2 className="h-3 w-3 text-red-500" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={addItem}>
        <Plus className="h-3 w-3 mr-1" /> 항목 추가
      </Button>
    </div>
  )
}

// ─── Section Title Input ────────────────────────────────
function SectionTitleInput({ name }: { name: string }) {
  const { control } = useFormContext<ResumeData>()
  return (
    <FormField
      control={control}
      name={name as any}
      render={({ field }) => (
        <Input
          className="text-base font-semibold border-none p-0 h-auto focus-visible:ring-0 w-auto max-w-[200px]"
          {...field}
        />
      )}
    />
  )
}

// ─── Keywords Input ─────────────────────────────────────
function KeywordsInput() {
  const { setValue, watch } = useFormContext<ResumeData>()
  const keywords = watch('keywords') || []
  const [input, setInput] = useState('')

  const addKeyword = () => {
    const trimmed = input.trim()
    if (trimmed && !keywords.includes(trimmed)) {
      setValue('keywords', [...keywords, trimmed])
      setInput('')
    }
  }

  const removeKeyword = (i: number) => {
    setValue('keywords', keywords.filter((_: string, idx: number) => idx !== i))
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">키워드 (해시태그)</span>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw: string, i: number) => (
          <span key={i} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
            #{kw}
            <button type="button" onClick={() => removeKeyword(i)} className="hover:text-red-500 cursor-pointer">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="키워드 입력 후 추가"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword() } }}
        />
        <Button type="button" variant="outline" size="sm" onClick={addKeyword}>추가</Button>
      </div>
    </div>
  )
}

// ─── Photo Upload ───────────────────────────────────────
function PhotoUpload() {
  const { setValue, watch } = useFormContext<ResumeData>()
  const photo = watch('profile.photo') || ''
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // 2MB 제한
    if (file.size > 2 * 1024 * 1024) {
      toast.error('이미지는 2MB 이하만 가능합니다.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setValue('profile.photo', reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    setValue('profile.photo', '')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">증명사진</span>
      {photo ? (
        <div className="relative inline-block">
          <img src={photo} alt="Profile" className="w-28 h-36 object-cover border border-neutral-200 dark:border-neutral-700 rounded" />
          <button
            type="button"
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 cursor-pointer"
            onClick={removePhoto}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="w-28 h-36 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded flex flex-col items-center justify-center text-neutral-400 hover:border-neutral-400 cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <ImagePlus className="h-6 w-6 mb-1" />
          <span className="text-xs">사진 추가</span>
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <p className="text-xs text-neutral-400">2MB 이하 JPG/PNG 권장</p>
    </div>
  )
}

// ─── Main Edit Page ─────────────────────────────────────
export default function ResumeEditPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [resumeId, setResumeId] = useState<string | null>(null)

  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema) as any,
    defaultValues: defaultResumeData,
  })

  useEffect(() => {
    checkAuthAndLoad()
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) router.push('/login')
    })
    return () => { authListener?.subscription.unsubscribe() }
  }, [])

  const checkAuthAndLoad = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setSession(null); setIsLoading(false); router.push('/login'); return }
      setSession(session)

      const { data: resume, error } = await supabase
        .from('resume').select('*').order('updated_at', { ascending: false }).limit(1).single()

      if (error) console.error('Resume fetch error:', error)

      if (resume) {
        setResumeId(resume.id)
        const raw = resume.data || {}
        const migratedExperience = (raw.experience || []).map((exp: any) => ({
          ...exp,
          descriptions: (exp.descriptions || []).map((d: any) =>
            typeof d === 'string' ? { text: d, level: 1 } : d
          ),
        }))
        // certifications 마이그레이션 (날짜 필드 추가)
        const migratedCerts = (raw.certifications || []).map((c: any) => ({
          name: c.name || '',
          startDate: c.startDate || '',
          endDate: c.endDate || '',
        }))
        const merged = {
          ...defaultResumeData,
          ...raw,
          profile: { ...defaultResumeData.profile, ...(raw.profile || {}) },
          sectionTitles: { ...defaultResumeData.sectionTitles, ...(raw.sectionTitles || {}) },
          experience: migratedExperience,
          certifications: migratedCerts,
          keywords: raw.keywords || [],
          customSections: raw.customSections || [],
        }
        form.reset(merged)
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setIsLoading(false)
    }
  }

  const onSubmit = async (values: ResumeData) => {
    setIsSaving(true)
    const cleanedValues = {
      ...values,
      experience: values.experience.map((exp) => ({
        ...exp,
        descriptions: exp.descriptions.filter(
          (d: any) => (typeof d === 'string' ? d.trim() !== '' : d.text?.trim() !== '')
        ),
      })),
    }

    const query = resumeId
      ? supabase.from('resume').update({ data: cleanedValues, updated_at: new Date().toISOString() }).eq('id', resumeId)
      : supabase.from('resume').upsert({ data: cleanedValues, updated_at: new Date().toISOString() })

    const { error } = await query
    if (error) {
      toast.error('저장 실패: ' + error.message)
    } else {
      toast.success('이력서가 저장되었습니다.')
      await revalidateResume()
      setTimeout(() => { router.push('/resume'); router.refresh() }, 1000)
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="w-full mx-auto max-w-xl p-6 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="w-full mx-auto max-w-xl p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>접근 권한 없음</AlertTitle>
          <AlertDescription>이 페이지에 접근할 권한이 없습니다.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="editor-page w-full mx-auto">
      <Card className="p-6">
        <CardHeader><CardTitle>이력서 편집</CardTitle></CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 text-left">

              {/* === Profile === */}
              <section className="space-y-3">
                <h3 className="text-base font-semibold">Profile</h3>
                <div className="flex gap-6">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField control={form.control} name="profile.name" render={({ field }) => (
                      <FormItem><FormLabel>이름</FormLabel><FormControl><Input placeholder="이름" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="profile.title" render={({ field }) => (
                      <FormItem><FormLabel>직함</FormLabel><FormControl><Input placeholder="Frontend Developer" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="profile.email" render={({ field }) => (
                      <FormItem><FormLabel>이메일</FormLabel><FormControl><Input placeholder="email@example.com" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="profile.phone" render={({ field }) => (
                      <FormItem><FormLabel>연락처</FormLabel><FormControl><Input placeholder="010-0000-0000" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="profile.linkedin" render={({ field }) => (
                      <FormItem><FormLabel>LinkedIn</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="profile.website" render={({ field }) => (
                      <FormItem><FormLabel>Portfolio</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                  <PhotoUpload />
                </div>
              </section>

              {/* === Summary + Keywords === */}
              <section className="space-y-3">
                <SectionTitleInput name="sectionTitles.summary" />
                <FormField control={form.control} name="summary" render={({ field }) => (
                  <FormItem><FormControl><Textarea placeholder="자기소개를 작성하세요" rows={4} {...field} /></FormControl></FormItem>
                )} />
                <KeywordsInput />
              </section>

              {/* === Array Sections === */}
              <ExperienceSection />
              <SkillsSection />
              <EducationSection />
              <CertificationsSection />
              <CustomSectionsEditor />

              {/* === Actions === */}
              <div className="flex items-center justify-between mt-4">
                <Button type="button" className="cursor-pointer" variant="secondary" onClick={() => router.back()}>
                  <MoveLeft className="h-4 w-4" /> Back
                </Button>
                <Button type="submit" className="cursor-pointer" disabled={isSaving}>
                  <Check className="h-4 w-4" /> {isSaving ? '저장 중...' : '저장'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  )
}
