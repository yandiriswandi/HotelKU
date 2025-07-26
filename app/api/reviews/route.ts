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
  roomImageTable,
  roomReviewTable,
  roomTable,
  roomVideosTable,
} from '@/lib/db/schema'

export async function POST(req: Request) {
  const body = await req.json()

  try {
    await db
      .delete(roomReviewTable)
      .where(eq(roomReviewTable.reservation_id, body.reservation_id))
    // 1. Simpan room utama
    const [newRoom] = await db
      .insert(roomReviewTable)
      .values({
        room_id: body.room_id,
        reservation_id: body.reservation_id,
        comment: body.comment,
        user_id: body.user_id,
        rating: body.rating,
        created_at: new Date(),
      })
      .returning()
    // 2. Simpan images
    return jsonResponse({ data: newRoom })
  } catch (error) {
    return errorResponse({ message: 'Failed to create room' })
  }
}
