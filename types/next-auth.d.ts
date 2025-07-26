import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      full_name: string
      image_url: string
      role: string
      token: string
    }
  }

  interface User {
    id: string
    email: string
    full_name: string
    image_url: string
    role: string
    token: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    full_name: string
    image_url: string
    role: string
    token: string
    expires: number
  }
}
