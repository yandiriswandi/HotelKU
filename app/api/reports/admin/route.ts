import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  applicantsTable,
  jobsTable,
  jobApplicationsTable,
} from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export const GET = async () => {
  try {
    const totalApplicants = await db
      .select({ count: sql<number>`count(*)` })
      .from(applicantsTable)
      .then((res) => res[0].count)

    const totalJobs = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobsTable)
      .where(eq(jobsTable.is_open, true))
      .then((res) => res[0].count)

    const totalJobApplications = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobApplicationsTable)
      .then((res) => res[0].count)

    return NextResponse.json({
      totalApplicants,
      totalJobs,
      totalJobApplications,
    })
  } catch (error) {
    console.error('Failed to fetch dashboard reports:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
