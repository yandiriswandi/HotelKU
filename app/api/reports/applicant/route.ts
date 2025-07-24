import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { applicantsTable, jobApplicationsTable } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { getToken } from 'next-auth/jwt'
import { errorResponse, jsonResponse } from '@/utils'

// GET /api/applicant/dashboard-reports?user_id=xxxxx
export async function GET(req: NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const userId = session?.id || ''

  try {
    const [existing] = await db
      .select()
      .from(applicantsTable)
      .where(eq(applicantsTable.user_id, userId))

    if (!existing?.id) {
      return errorResponse({ message: 'Applicant data not found', status: 404 })
    }

    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobApplicationsTable)
      .where(eq(jobApplicationsTable.applicant_id, existing.id))

    return jsonResponse({ data: { totalApplications: result.count } })
  } catch (error) {
    console.error(error)
    return errorResponse({ message: 'Internal Server Error', status: 500 })
  }
}
