import { addDays, format } from 'date-fns'

export const noteByStatus = {
  in_progress: 'Application is being processed.',
  not_selected: 'Candidate was not selected.',
  interview: 'Interview scheduled.',
  under_review: 'Application under review.',
  offer_made: 'Job offer has been made.',
  rejected: 'Application was rejected.',
  hired: 'Candidate has been hired.',
} as const

export const jobStatusArray = [
  'in_progress',
  'not_selected',
  'interview',
  'under_review',
  'offer_made',
  'rejected',
  'hired',
] as const

export const drawerArray = ['edit', 'view', 'create', 'delete'] as const

export const defaultValueJob = {
  title: '',
  description: '',
  min_salary_offered: '0',
  max_salary_offered: '0',
  is_open: true,
} as const

export const defaultValueRoom = {
  code: '',
  name: '',
  description: '',
  price: '',
  discount: '',
  total_room: '',
  images: [],
  videos: [],
}

export const defaultValueReservation = {
  code: '',
  room_id: '',
  user_id: '',
  date_range: {
    from: format(new Date(), 'yyyy-MM-dd'), // hari ini
    to: format(addDays(new Date(), 1), 'yyyy-MM-dd'), // besok
  },
  price: '',
  discount: '',
  total_room: '',
  total_price: '',
  status: '1',
}

export const defaultValueProfile = {
  full_name: '',
  phone: '',
  email: '',
  password: '',
}
