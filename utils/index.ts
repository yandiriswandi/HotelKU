import { NextResponse } from 'next/server'

export function indonesiaRupiah(value: number, withRupiah: boolean): string {
  const formatted = Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)

  if (!withRupiah) return formatted.replace('Rp', '')
  return formatted
}

export function formatRangeRupiah(min: number, max: number): string {
  return `${indonesiaRupiah(min, false)} - ${indonesiaRupiah(max, false)} IDR`
}

export function jsonResponse<T>({
  data,
  status = 200,
}: {
  data: T
  status?: number
}): NextResponse {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse({
  message = 'Something went wrong',
  status = 500,
  errors,
}: {
  message?: string
  status?: number
  errors?: unknown
}): NextResponse {
  return NextResponse.json({ success: false, message, errors }, { status })
}

// utils/reservationStatus.ts

type ReservationStatus =
  | '1' // unpaid
  | '2' // paid
  | '3' // checked_in
  | '4' // checked_out
  | '5' // cancelled
  | '6' // expired
  | '7' // refunded
  | '8' // no_show
  | '9'

export function getReservationStatusInfo(status: ReservationStatus) {
  const statusMap: Record<
    ReservationStatus,
    {
      label: string
      textColor: string
      bgColor: string
    }
  > = {
    '1': {
      label: 'Unpaid',
      textColor: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    '2': {
      label: 'Failed',
      textColor: 'text-red-700',
      bgColor: 'bg-red-200',
    },
    '3': {
      label: 'Paid',
      textColor: 'text-green-700',
      bgColor: 'bg-green-100',
    },
    '4': {
      label: 'Checked In',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-100',
    },
    '5': {
      label: 'Checked Out',
      textColor: 'text-gray-800',
      bgColor: 'bg-gray-200',
    },
    '6': {
      label: 'Cancelled',
      textColor: 'text-primary-700',
      bgColor: 'bg-primary-100',
    },
    '7': {
      label: 'Expired',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
    },
    '8': {
      label: 'Refunded',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-100',
    },
    '9': {
      label: 'No Show',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-100',
    },
  }

  return statusMap[status]
}
