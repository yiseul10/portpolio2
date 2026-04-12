'use client'

import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// 폼 내부에서 cover_letter 필드를 다루는 섹션
export function CoverLetterSection() {
  const { control } = useFormContext()

  const sections = [
    { name: 'cover_letter.greeting', label: '인사말', titleName: 'cover_letter.sectionTitles.greeting', placeholder: '안녕하세요, ...로 시작하는 인사말을 작성하세요', rows: 3 },
    { name: 'cover_letter.motivation', label: '지원동기', titleName: 'cover_letter.sectionTitles.motivation', placeholder: '이 회사/포지션에 지원하게 된 동기를 작성하세요', rows: 5 },
    { name: 'cover_letter.experience', label: '관련 경험', titleName: 'cover_letter.sectionTitles.experience', placeholder: '이 포지션과 관련된 핵심 경험을 작성하세요', rows: 6 },
    { name: 'cover_letter.strengths', label: '강점', titleName: 'cover_letter.sectionTitles.strengths', placeholder: '차별화되는 강점이나 가치를 작성하세요', rows: 4 },
    { name: 'cover_letter.closing', label: '마무리', titleName: 'cover_letter.sectionTitles.closing', placeholder: '감사 인사 및 마무리를 작성하세요', rows: 3 },
  ]

  return (
    <section className="space-y-4 pt-2">
      <h3 className="text-base font-semibold">Cover Letter</h3>

      {/* 지원 대상 정보 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField control={control} name="cover_letter.targetCompany" render={({ field }) => (
          <FormItem>
            <FormLabel>지원 회사</FormLabel>
            <FormControl><Input placeholder="지원하는 회사명" {...field} /></FormControl>
          </FormItem>
        )} />
        <FormField control={control} name="cover_letter.targetPosition" render={({ field }) => (
          <FormItem>
            <FormLabel>지원 포지션</FormLabel>
            <FormControl><Input placeholder="Frontend Developer" {...field} /></FormControl>
          </FormItem>
        )} />
      </div>

      {/* 섹션별 편집 */}
      {sections.map(({ name, label, titleName, placeholder, rows }) => (
        <div key={name} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 space-y-2">
          <FormField control={control} name={titleName} render={({ field }) => (
            <Input
              className="text-sm font-semibold border-none p-0 h-auto focus-visible:ring-0 w-auto max-w-[200px]"
              placeholder={label}
              {...field}
            />
          )} />
          <FormField control={control} name={name} render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder={placeholder} rows={rows} {...field} />
              </FormControl>
            </FormItem>
          )} />
        </div>
      ))}
    </section>
  )
}
