// app/api/applicant/profile/route.ts
import { db } from '@/lib/db'
import { usersTable } from '@/lib/db/schema'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!session?.id)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const [user] = await db
    .select({
      email: usersTable.email,
      full_name: usersTable.full_name,
      phone: usersTable.phone,
      address: usersTable.address,
      image_url: usersTable.image_url,
    })
    .from(usersTable)

  if (!user) return NextResponse.json({ message: 'Not found' }, { status: 404 })

  return NextResponse.json({ data: user })
}

export async function PATCH(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!session?.id)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { full_name, phone, email, password, address, image_url } =
    await req.json()

  await db
    .update(usersTable)
    .set({
      email,
      full_name,
      phone,
      address,
      image_url,
      ...(password ? { password: await bcrypt.hash(password, 12) } : {}),
      updated_at: new Date(),
    })
    .where(eq(usersTable.id, session.id))

  return NextResponse.json({ message: 'Profile updated' })
}
