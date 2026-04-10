import { z } from 'zod'

export const coverLetterSchema = z.object({
  targetCompany: z.string().default(''),
  targetPosition: z.string().default(''),
  greeting: z.string().default(''),
  motivation: z.string().default(''),
  experience: z.string().default(''),
  strengths: z.string().default(''),
  closing: z.string().default(''),
  sectionTitles: z.object({
    greeting: z.string().default('인사말'),
    motivation: z.string().default('지원동기'),
    experience: z.string().default('관련 경험'),
    strengths: z.string().default('강점'),
    closing: z.string().default('마무리'),
  }).default({}),
})

export type CoverLetterData = z.infer<typeof coverLetterSchema>

export const defaultCoverLetterData: CoverLetterData = {
  targetCompany: '',
  targetPosition: '',
  greeting: '',
  motivation: '',
  experience: '',
  strengths: '',
  closing: '',
  sectionTitles: {
    greeting: '인사말',
    motivation: '지원동기',
    experience: '관련 경험',
    strengths: '강점',
    closing: '마무리',
  },
}
