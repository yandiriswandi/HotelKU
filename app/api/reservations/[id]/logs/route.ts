/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/lib/db'
// import { roomTable, jobApplicationsTable } from '@/lib/db/schema'
import { reservationLogsTable, reservationTable } from '@/lib/db/schema'
import { errorResponse, jsonResponse } from '@/utils'
import { desc, eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id
  try {
    const baseQuery = db
      .select()
      .from(reservationLogsTable)
      .where(eq(reservationLogsTable.reservation_id, id))
      .groupBy(reservationLogsTable.id)
      .orderBy(desc(reservationLogsTable.created_at))

    const result = await baseQuery

    return jsonResponse({ data: result })
  } catch (error) {
    return errorResponse({ message: 'Failed to fetch jobs' })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id
  const body = await req.json()
  try {
    const baseQuery = db
      .insert(reservationLogsTable)
      .values({
        reservation_id: id,
        status: body.status,
        note: body.note,
        created_at: new Date(),
      })
      .returning()

    await db
      .update(reservationTable)
      .set({
        status: body.status,
      })
      .where(eq(reservationTable.id, id))
      .returning()

    const result = await baseQuery

    return jsonResponse({ data: result })
  } catch (error) {
    return errorResponse({ message: 'Failed to fetch logs' })
  }
}
