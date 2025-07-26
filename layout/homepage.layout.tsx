'use client'

import { SessionProvider } from 'next-auth/react'
import NavbarMenu from '@/components/section/navbar-menu'
import MotionContainer from '@/containers/motion.container'
import { useEffect, useState } from 'react'

export default function HomepageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showNavbar, setShowNavbar] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      // Show navbar jika scrollY lebih dari tinggi layar pertama (misal 100vh)
      setShowNavbar(scrollY > window.innerHeight * 0.8)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <MotionContainer>
      <SessionProvider>
        <div className="flex flex-col min-h-screen bg-white">
          <NavbarMenu showNavbar={showNavbar} />
          <main className="">{children}</main>
        </div>
      </SessionProvider>
    </MotionContainer>
  )
}
