import { db } from '@/lib/db'
import { reservationTable, roomTable, usersTable } from '@/lib/db/schema'
import { eq, inArray, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const GET = async () => {
  try {
    const totalCustomers = await db
      .select({ count: sql<number>`count(*)` })
      .from(usersTable)
      .where(eq(usersTable.role, 'customer'))
      .then((res) => res[0].count)

    const totalRooms = await db
      .select({ count: sql<number>`count(*)` })
      .from(roomTable)
      .then((res) => res[0].count)

    const totalReservations = await db
      .select({ count: sql<number>`count(*)` })
      .from(reservationTable)
      .then((res) => res[0].count)

    const GrandTotal = await db
      .select({
        grand_total: sql<number>`SUM(${reservationTable.total_price})`,
      })
      .from(reservationTable)
      .where(
        inArray(reservationTable?.status, [3, 4, 5]), // ← status sebagai string
      )
      .then((res) => res[0].grand_total)

    return NextResponse.json({
      totalCustomers,
      totalRooms,
      totalReservations,
      GrandTotal,
    })
  } catch (error) {
    console.error('Failed to fetch dashboard reports:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
