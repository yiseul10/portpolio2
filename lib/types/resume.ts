import { z } from 'zod'

// --- Zod Schemas ---

export const profileSchema = z.object({
  name: z.string().default(''),
  title: z.string().default(''),
  email: z.string().default(''),
  phone: z.string().default(''),
  linkedin: z.string().default(''),
  website: z.string().default(''),
  photo: z.string().default(''), // base64 또는 data URL
})

export const descriptionItemSchema = z.object({
  text: z.string().default(''),
  level: z.number().min(0).max(2).default(0), // 0: 일반(bullet 없음), 1: • 메인, 2: ◦ 서브
})

export const experienceItemSchema = z.object({
  company: z.string().min(1, '회사명을 입력하세요'),
  role: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default('현재'),
  descriptions: z.array(descriptionItemSchema).default([]),
})

export const skillGroupSchema = z.object({
  category: z.string().default(''), // 선택사항
  items: z.string().default(''),
})

export const educationItemSchema = z.object({
  school: z.string().min(1, '학교명을 입력하세요'),
  major: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
})

export const certificationItemSchema = z.object({
  name: z.string().min(1, '항목을 입력하세요'),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
})

// 커스텀 섹션
export const customSectionItemSchema = z.object({
  text: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
})

export const customSectionSchema = z.object({
  title: z.string().default(''),
  items: z.array(customSectionItemSchema).default([]),
})

export const resumeSchema = z.object({
  profile: profileSchema.default({
    name: '',
    title: '',
    email: '',
    phone: '',
    linkedin: '',
    website: '',
    photo: '',
  }),
  summary: z.string().default(''),
  keywords: z.array(z.string()).default([]), // 해시태그 키워드
  experience: z.array(experienceItemSchema).default([]),
  skills: z.array(skillGroupSchema).default([]),
  education: z.array(educationItemSchema).default([]),
  certifications: z.array(certificationItemSchema).default([]),
  // 섹션 타이틀 커스텀
  sectionTitles: z.object({
    summary: z.string().default('SUMMARY'),
    experience: z.string().default('EXPERIENCE'),
    skills: z.string().default('SKILLS'),
    education: z.string().default('EDUCATION'),
    certifications: z.string().default('CERTIFICATIONS & OTHER'),
  }).default({
    summary: 'SUMMARY',
    experience: 'EXPERIENCE',
    skills: 'SKILLS',
    education: 'EDUCATION',
    certifications: 'CERTIFICATIONS & OTHER',
  }),
  // 커스텀 섹션 (추가/삭제 가능)
  customSections: z.array(customSectionSchema).default([]),
})

// --- TypeScript Types ---

export type Profile = z.infer<typeof profileSchema>
export type DescriptionItem = z.infer<typeof descriptionItemSchema>
export type ExperienceItem = z.infer<typeof experienceItemSchema>
export type SkillGroup = z.infer<typeof skillGroupSchema>
export type EducationItem = z.infer<typeof educationItemSchema>
export type CertificationItem = z.infer<typeof certificationItemSchema>
export type CustomSection = z.infer<typeof customSectionSchema>
export type CustomSectionItem = z.infer<typeof customSectionItemSchema>
export type ResumeData = z.infer<typeof resumeSchema>

// --- Default Values ---

export const defaultResumeData: ResumeData = {
  profile: {
    name: '',
    title: '',
    email: '',
    phone: '',
    linkedin: '',
    website: '',
    photo: '',
  },
  summary: '',
  keywords: [],
  experience: [],
  skills: [],
  education: [],
  certifications: [],
  sectionTitles: {
    summary: 'SUMMARY',
    experience: 'EXPERIENCE',
    skills: 'SKILLS',
    education: 'EDUCATION',
    certifications: 'CERTIFICATIONS & OTHER',
  },
  customSections: [],
}
