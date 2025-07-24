'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronDown, Gauge, LogIn, LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import UpdateApplicantProfile from '../ProfileDrawer'

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

export default function NavbarMenu() {
  const { data, status } = useSession()
  const dashboardUrl = data?.user.role === 'admin' ? '/dashboard' : '/applicant'
  const [showProfileForm, setShowProfileForm] = useState(false)

  return (
    <header className="bg-white text-white sticky top-0">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link
          href="#"
          target="_top"
          className="flex items-center font-semibold text-primary p-2 rounded-xl text-2xl gap-2"
        >
          <LeafIcon className="w-8 h-8" />
          HotelKU
        </Link>
        {status === 'loading' && <Skeleton className="h-4 w-[100px]" />}
        {status === 'unauthenticated' && (
          <Link href="/sign-in">
            <Button variant="secondary">
              SIGN IN <LogIn />
            </Button>
          </Link>
        )}
        {status === 'authenticated' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                My Profile <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel className="text-gray-400">
                Account
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>{data.user.email}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowProfileForm(true)}>
                  <span>Update Profile</span>
                </DropdownMenuItem>
                <Link href={dashboardUrl}>
                  <DropdownMenuItem>
                    Visit Dashboard
                    <DropdownMenuShortcut>
                      <Gauge />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() =>
                    signOut({
                      callbackUrl: process.env.NEXT_PUBLIC_URL_DOMAIN,
                    })
                  }
                >
                  Sign out
                  <DropdownMenuShortcut>
                    <LogOut />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <UpdateApplicantProfile
        open={showProfileForm}
        onOpen={() => setShowProfileForm(false)}
        onFinish={() => setShowProfileForm(false)}
      />
    </header>
  )
}
