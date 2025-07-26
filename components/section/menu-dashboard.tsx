'use client'

import { Separator } from '@/components/ui/separator'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarTrigger,
  SidebarGroupLabel,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EllipsisVertical, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

type Icon = React.ElementType

type ItemsProps = {
  title: string
  url: string
  icon?: Icon
}

const LeafIcon = ({ className = 'w-6 h-6', fill = 'currentColor' }) => {
  return (
    <svg
      className={className}
      fill={fill}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M58.4 5.6c-4.6 0-10.3 1.2-16.8 4.3C33 14 24.6 21.8 19.5 30.5 13 41.3 13 50.3 14.4 54c1.4 3.6 4.9 6.5 9.7 7.7 1.9.5 3.8.7 5.6.7 9.3 0 18.4-5.4 25.4-14.7 5.3-7 7.8-14.3 8.4-20.7.9-8.6-1.2-15.6-5.3-19.7-1.6-1.7-3.8-2.7-6.2-2.7zM19.7 48.2C23.4 39.8 34 30 44.8 22.5c-7.5 10.8-17.3 21.4-26.5 25.7-.2-.1-.5-.1-.7 0-.5.1-.9.3-1.2.7-.3.3-.4.7-.4 1.2 0 .2.1.5.2.7z" />
    </svg>
  )
}

export default function MenuDashboard({
  children,
  items,
}: {
  children: React.ReactNode
  items: ItemsProps[]
}) {
  const { isMobile } = useSidebar()
  const { data } = useSession()

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <Sidebar collapsible="offcanvas" variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <Link
                  href="/"
                  target="_top"
                  className="flex items-center font-bold text-primary p-2 rounded-xl text-xl"
                >
                  <LeafIcon className="w-14 h-14" />
                  HotelKU
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-2">
              <SidebarMenu>
                {items?.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url}>
                      <SidebarMenuButton>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                )) || null}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {data?.user.email || ''}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {data?.user.role || ''}
                      </span>
                    </div>
                    <EllipsisVertical className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() =>
                      signOut({
                        callbackUrl: process.env.NEXT_PUBLIC_URL_DOMAIN,
                      })
                    }
                  >
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <div className="flex flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
