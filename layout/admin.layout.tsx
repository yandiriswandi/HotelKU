'use client'

import { SessionProvider } from 'next-auth/react'
import { SidebarProvider } from '@/components/ui/sidebar'
import MenuDashboard from '@/components/section/menu-dashboard'
import { Building2, Gauge } from 'lucide-react'
import React from 'react'
import MotionContainer from '@/containers/motion.container'

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Gauge,
  },
  {
    title: 'Rooms',
    url: '/rooms',
    icon: Building2,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MotionContainer>
      <SessionProvider>
        <SidebarProvider>
          <MenuDashboard items={menuItems}>{children}</MenuDashboard>
        </SidebarProvider>
      </SessionProvider>
    </MotionContainer>
  )
}
