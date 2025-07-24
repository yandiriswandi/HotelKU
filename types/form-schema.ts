import { jobStatusArray } from '@/constants'
import { z } from 'zod'

export const formJobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  min_salary_offered: z.string().min(1),
  max_salary_offered: z.string().min(1),
  is_open: z.boolean().default(true),
})

export const formSignupSchema = z.object({
  full_name: z.string().min(3),
  phone: z.string().min(10),
  summary: z.string().min(10),
  min_salary_expectation: z.string().min(1),
  max_salary_expectation: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(5),
})

export const formJobApplicationSchema = z.object({
  status: z.enum(jobStatusArray),
})

export const formProfileSchema = z
  .object({
    full_name: z.string().min(3, 'Full name minimal 3 karakter'),
    phone: z.string().min(10, 'Nomor HP minimal 10 angka'),
    email: z.string().email('Email tidak valid'),
    password: z.string().optional(),

    min_salary_expectation: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Minimal gaji harus berupa angka dan lebih dari 0',
      }),

    max_salary_expectation: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Maksimal gaji harus berupa angka dan lebih dari 0',
      }),

    summary: z.string().min(10, 'Summary minimal 10 karakter'),
  })
  .refine(
    (data) => {
      const min = Number(data.min_salary_expectation)
      const max = Number(data.max_salary_expectation)
      return max >= min
    },
    {
      path: ['max_salary_expectation'],
      message: 'Maksimal gaji tidak boleh lebih kecil dari minimal gaji',
    },
  )
