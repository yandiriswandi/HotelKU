// app/api/applicant/profile/route.ts
import { getToken } from 'next-auth/jwt'
import { db } from '@/lib/db'
import { applicantsTable, usersTable } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  console.log('session=>', session)

  if (!session?.id)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const [applicant] = await db
    .select({
      full_name: applicantsTable.full_name,
      phone: applicantsTable.phone,
      email: usersTable.email,
    })
    .from(applicantsTable)
    .innerJoin(usersTable, eq(applicantsTable.user_id, usersTable.id))
    .where(eq(applicantsTable.user_id, session.id))

  if (!applicant)
    return NextResponse.json({ message: 'Not found' }, { status: 404 })

  return NextResponse.json({ data: applicant })
}

// app/api/applicant/profile/route.ts (PATCH)

export async function PATCH(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!session?.id)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const {
    full_name,
    phone,
    email,
    password,
    min_salary_expectation,
    max_salary_expectation,
    summary,
  } = await req.json()

  await db
    .update(usersTable)
    .set({
      email,
      ...(password ? { password: await bcrypt.hash(password, 12) } : {}),
    })
    .where(eq(usersTable.id, session.id))

  await db
    .update(applicantsTable)
    .set({
      full_name,
      phone,
      min_salary_expectation: Number(min_salary_expectation),
      max_salary_expectation: Number(max_salary_expectation),
      summary,
    })
    .where(eq(applicantsTable.user_id, session.id))

  return NextResponse.json({ message: 'Profile updated' })
}
