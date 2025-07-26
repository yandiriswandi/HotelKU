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
  roomTable,
  roomVideosTable,
  usersTable,
} from '@/lib/db/schema'

export async function POST(req: NextRequest) {
  const body = await req.json()

  try {
    const totalRooms = await db.select().from(reservationTable)
    const count = totalRooms.length + 1

    // 2. Buat kode unik
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const number = String(count).padStart(5, '0')
    const code = `RV/${year}/${month}/${day}/${number}`

    const [newReservation] = await db
      .insert(reservationTable)
      .values({
        code,
        user_id: body?.user_id || '',
        room_id: body.room_id || '',
        price: body.price || '0',
        discount: body.discount || '0',
        arrival: new Date(body.arrival),
        departure: new Date(body.departure),
        total_room: body.total_room,
        total_price: body.total_price,
        status: body.status,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning()

    await db
      .insert(reservationLogsTable)
      .values({
        reservation_id: newReservation.id,
        status: body.status,
        note: body.status,
        created_at: new Date(),
      })
      .returning()

    return jsonResponse({ data: newReservation })
  } catch (error) {
    console.log(error)
    return errorResponse({ message: 'Failed to update room' })
  }
}

export async function GET(req: NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  try {
    const baseQuery = await db
      .select({
        id: reservationTable.id,
        code: reservationTable.code,
        user_id: reservationTable.user_id,
        room_id: reservationTable.room_id,
        price: reservationTable.price,
        discount: reservationTable.discount,
        arrival: reservationTable.arrival,
        departure: reservationTable.departure,
        total_room: reservationTable.total_room,
        total_price: reservationTable.total_price,
        status: reservationTable.status,
        created_at: reservationTable.created_at,
        updated_at: reservationTable.updated_at,

        // 👤 USER sebagai object
        user: sql`json_build_object(
      'id', ${usersTable.id},
      'full_name', ${usersTable.full_name},
      'phone', ${usersTable.phone},
      'email', ${usersTable.email}
      )`.as('user'),
        // 🏨 ROOM sebagai object dengan array image
        room: sql`json_build_object(
      'id', ${roomTable.id},
      'code', ${roomTable.code},
      'name', ${roomTable.name},
      'price', ${roomTable.price},
      'discount', ${reservationTable.discount},
      'images', array_agg(DISTINCT ${roomImageTable.image_url})
    )`.as('room'),
      })
      .from(reservationTable)
      .leftJoin(roomTable, eq(roomTable.id, reservationTable.room_id))
      .leftJoin(usersTable, eq(usersTable.id, reservationTable.user_id))
      .leftJoin(roomImageTable, eq(roomImageTable.room_id, roomTable.id))
      .groupBy(reservationTable.id, usersTable.id, roomTable.id)
      .orderBy(desc(reservationTable.created_at))

    // if (session?.role === 'customer') {
    //   baseQuery.where(eq(reservationTable.user_id, session.id))
    // }

    const result = await baseQuery

    return jsonResponse({ data: result })
  } catch (error) {
    console.log('error=>', error)
    return errorResponse({ message: 'Failed to fetch reservations' })
  }
}
