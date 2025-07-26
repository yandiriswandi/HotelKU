'use client'
import NavbarMenu from '@/components/section/navbar-menu'
import MotionContainer from '@/containers/motion.container'
import { SessionProvider } from 'next-auth/react'

export default function CustomerPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MotionContainer>
      <SessionProvider>
        <div className="flex flex-col min-h-screen">
          <NavbarMenu showNavbar={true} />
          <main className="">{children}</main>
        </div>
      </SessionProvider>
    </MotionContainer>
  )
}
