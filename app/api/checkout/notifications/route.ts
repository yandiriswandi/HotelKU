import { db } from '@/lib/db' // sesuaikan dengan setup drizzle kamu
import {
  reservationLogsTable,
  reservationTable,
  roomTable,
} from '@/lib/db/schema' // sesuaikan dengan schema
import { eq } from 'drizzle-orm'
import midtransClient from 'midtrans-client'
import { NextRequest, NextResponse } from 'next/server'
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { roomTable, jobApplicationsTable } from '@/lib/db/schema'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.MIDTRANS_CLIENT_KEY!,
  })

  try {
    const statusResponse = await core.transaction.notification(body)

    const { transaction_status, fraud_status, order_id, payment_type } =
      statusResponse
    const firstPart = order_id.split('-')[0]

    // Ambil reservation berdasarkan order_id
    const [reservation] = await db
      .select()
      .from(reservationTable)
      .where(eq(reservationTable.code, firstPart))

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 },
      )
    }

    // Jika pembayaran berhasil
    if (
      transaction_status === 'capture' ||
      transaction_status === 'settlement'
    ) {
      // Update status reservation
      const status = 3
      await db
        .update(reservationTable)
        .set({ status: status })
        .where(eq(reservationTable.code, firstPart))

      // Kurangi jumlah room yang tersedia
      // 1. Ambil data room dulu
      const room = await db
        .select()
        .from(roomTable)
        .where(eq(roomTable.id, reservation.room_id))
        .then((res) => res[0])

      if (!room) {
        throw new Error('Room tidak ditemukan')
      }

      // 2. Hitung total_room baru
      const newTotalRoom = room.total_room - reservation.total_room

      // 3. Update room
      await db
        .update(roomTable)
        .set({ total_room: newTotalRoom })
        .where(eq(roomTable.id, reservation.room_id))

      await db
        .insert(reservationLogsTable)
        .values({
          reservation_id: reservation.id,
          status: status,
          note: payment_type,
          created_at: new Date(),
        })
        .returning()

      return NextResponse.json({ message: 'Success update after payment' })
    }

    // Jika gagal
    if (
      transaction_status === 'cancel' ||
      transaction_status === 'deny' ||
      transaction_status === 'expire'
    ) {
      const status = 2
      await db
        .update(reservationTable)
        .set({ status: status })
        .where(eq(reservationTable.code, firstPart))

      await db
        .insert(reservationLogsTable)
        .values({
          reservation_id: reservation.id,
          status: status,
          note: payment_type,
          created_at: new Date(),
        })
        .returning()

      return NextResponse.json({ message: 'Payment failed or cancelled' })
    }

    return NextResponse.json({ message: 'Unhandled transaction status' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Callback error' }, { status: 500 })
  }
}
