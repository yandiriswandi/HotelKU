/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/lib/db'
// import { roomTable, jobApplicationsTable } from '@/lib/db/schema'
import { errorResponse, jsonResponse } from '@/utils'
import { formJobSchema, formRoomSchema } from '@/types/form-schema'
import { sql, eq, and, isNull, desc, isNotNull } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import {
  reservationLogsTable,
  reservationTable,
  roomImageTable,
  roomReviewTable,
  roomTable,
  roomVideosTable,
  usersTable,
} from '@/lib/db/schema'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id
  try {
    const baseQuery = db
      .select({
        id: reservationTable.id,
        code: reservationTable.code,
        user_id: reservationTable?.user_id || '',
        room_id: reservationTable.room_id || '',
        price: reservationTable.price || '0',
        discount: reservationTable.discount || '0',
        arrival: reservationTable.arrival,
        departure: reservationTable.departure,
        total_room: reservationTable.total_room,
        total_price: reservationTable.total_price,
        status: reservationTable.status,
        note: reservationTable.note,
        created_at: reservationTable.created_at,
        updated_at: reservationTable.updated_at,
        user: {
          id: usersTable.id,
          full_name: usersTable.full_name,
          phone: usersTable.phone,
          email: usersTable.email,
          address: usersTable.address,
        },
        review: {
          rating: roomReviewTable.rating,
          comment: roomReviewTable.comment,
        },
        room: {
          id: roomTable.id,
          code: roomTable.code,
          name: roomTable.name,
          price: roomTable.price,
          discount: reservationTable.discount || '0',
          // Aggregate images as array
          images: sql<
            Array<string>
          >`array_agg(DISTINCT ${roomImageTable.image_url})`.as('images'),
        },
      })
      .from(reservationTable)
      .leftJoin(roomTable, eq(roomTable.id, reservationTable.room_id))
      .leftJoin(usersTable, eq(usersTable.id, reservationTable.user_id))
      .leftJoin(roomImageTable, eq(roomImageTable.room_id, roomTable.id))
      .leftJoin(roomReviewTable, eq(roomReviewTable.reservation_id, id))
      .where(eq(reservationTable.id, id))
      .groupBy(
        reservationTable.id,
        usersTable.id,
        roomTable.id,
        roomReviewTable.id,
      )
      .orderBy(desc(reservationTable.created_at))

    const reservationLog = await db
      .select()
      .from(reservationLogsTable)
      .where(eq(reservationLogsTable.reservation_id, id))

    const [result] = await baseQuery

    return jsonResponse({ data: { ...result, reservationLog } })
  } catch (error) {
    return errorResponse({ message: 'Failed to fetch jobs' })
  }
}
