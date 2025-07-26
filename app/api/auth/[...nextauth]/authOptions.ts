/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '@/lib/db'
import { usersTable } from '@/lib/db/schema'
import { UserType } from '@/types/common'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const MAX_AGE = 60 * 60 * 24

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: MAX_AGE,
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<UserType & { token: string }> {
        const user = (await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, credentials?.email || ''))
          .limit(1)
          .then((res) => res[0])) as UserType

        if (!user) {
          throw new Error('User not registered')
        }

        const isValidPassword = await bcrypt.compare(
          credentials?.password || '',
          user.password,
        )

        if (!isValidPassword) {
          throw new Error('User not valid')
        }

        const token = jwt.sign(
          {
            id: user.id,
            full_name: user.full_name,
            image_url: user.image_url,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET!,
          { expiresIn: '1d' },
        )

        return { ...user, token }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.full_name = user.full_name
        token.image_url = user.image_url
        token.email = user.email
        token.token = user.token
        token.expires = Math.floor(Date.now() / 1000) + MAX_AGE
      }

      if (token.expires && Date.now() / 1000 > Number(token.expires || 0)) {
        return {}
      }

      return token
    },
    async session({ session, token }: any) {
      if (!token.id) {
        return null
      }

      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.full_name = token.full_name
        session.user.image_url = token.image_url
        session.user.token = token.token
      }

      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
