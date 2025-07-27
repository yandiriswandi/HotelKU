import { jobStatusArray } from '@/constants'
import { z } from 'zod'

export const formJobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  min_salary_offered: z.string().min(1),
  max_salary_offered: z.string().min(1),
  is_open: z.boolean().default(true),
})

export const formRoomSchema = z.object({
  code: z.string().optional(), // optional, bisa kosong
  name: z.string().min(1),
  description: z.string(),
  price: z.string().min(1), // input string, nanti di-convert ke Number
  discount: z.string().optional(), // optional, bisa kosong
  total_room: z.string().optional(), // optional, default ke 1 jika kosong
  images: z.array(z.string()).optional(),
  videos: z
    .array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        video_url: z.string().url(),
      }),
    )
    .optional(),
})

export const formReservationSchema = z.object({
  code: z.string().optional(), // optional, bisa kosong
  room_id: z.string(),
  user_id: z.string(),
  date_range: z.object({
    from: z.string(),
    to: z.string(),
  }),
  price: z.string(), // input string, nanti di-convert ke Number
  discount: z.string().optional(), // optional, bisa kosong
  total_room: z.string().optional(),
  total_price: z.string().optional(),
  note: z.string().optional(),
  status: z.string().optional(), // optional, default ke 1 jika kosong
})

export const formSignupSchema = z.object({
  full_name: z.string().min(3),
  phone: z.string().min(10),
  address: z.string(),
  image_url: z.string(),
  email: z.string().email(),
  password: z.string().min(5),
})

export const formJobApplicationSchema = z.object({
  status: z.enum(jobStatusArray),
})

export const formProfileSchema = z.object({
  full_name: z.string().min(3, 'Full name minimal 3 karakter'),
  phone: z.string().min(10, 'Nomor HP minimal 10 angka'),
  email: z.string().email('Email tidak valid'),
  password: z.string().optional(),
  image_url: z.string().optional(),
  address: z.string().optional(),
})
