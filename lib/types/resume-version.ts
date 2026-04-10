import { z } from 'zod'
import { resumeSchema } from './resume'
import { coverLetterSchema } from './cover-letter'

export const resumeVersionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, '버전 이름을 입력하세요'),
  memo: z.string().default(''),
  resume_data: resumeSchema,
  cover_letter: coverLetterSchema.nullable().default(null),
  is_active: z.boolean().default(false),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export type ResumeVersion = z.infer<typeof resumeVersionSchema>
