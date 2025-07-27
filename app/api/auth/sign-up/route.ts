/* eslint-disable @typescript-eslint/no-unused-vars */
import { hashPassword } from '@/helpers'
import { db } from '@/lib/db'
import { usersTable } from '@/lib/db/schema'
import { formSignupSchema } from '@/types/form-schema'
import { errorResponse, jsonResponse } from '@/utils'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  const body = await req.json()
  const parse = formSignupSchema.safeParse(body)

  if (!parse.success) {
    return errorResponse({
      message: 'Validation error',
      errors: parse.error.flatten().fieldErrors,
      status: 400,
    })
  }

  try {
    // check if email is exist
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, parse.data.email))
    if (!!existing.length) {
      return errorResponse({
        message: 'Email is already registered',
        status: 400,
      })
    }

    const result = await db.transaction(async (tx) => {
      // create new user
      const [newUser] = await tx
        .insert(usersTable)
        .values({
          full_name: parse.data.full_name,
          email: parse.data.email,
          password: await hashPassword(parse.data.password),
          image_url: parse.data.image_url,
          phone: parse.data.phone,
          role: 'customer',
          address: parse.data.address,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning()
      if (!newUser?.id) {
        throw new Error('Failed create user')
      }

      // create new participant

      return { user: newUser }
    })

    return jsonResponse({ data: result })
  } catch (error) {
    return errorResponse({ message: 'Failed to sign up data' })
  }
}
