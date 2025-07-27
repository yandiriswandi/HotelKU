'use client'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  getReservationStatusInfo,
  ReservationStatus,
  reservationStatusArray,
} from '@/utils'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

type AdminDashboardLogsProps = {
  open: string | number
  onOpen: () => void
  onFinish: () => void
}

export default function UpdateLogs({
  open,
  onOpen,
  onFinish,
}: AdminDashboardLogsProps) {
  const router = useRouter()
  const [data, setData] = useState({
    status: '',
    note: '',
  })
  const handleClickAction = async () => {
    try {
      const response = await fetch(`/api/reservations/${open}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data }),
      })

      if (response.ok) {
        toast.success('add status successful')
        onFinish()
        onOpen()
        router.refresh()
      }
    } catch (error) {
      console.log('error => ', error)
    }
  }

  return (
    <Drawer open={!!open} onOpenChange={onOpen}>
      <DrawerContent className="p-4 mb-10">
        <DrawerTitle className="text-center">
          Update Status Reservations
        </DrawerTitle>
        <div className="container p-4 w-full max-w-sm mx-auto mt-4 space-y-4">
          <div className="w-full space-y-4">
            <Label>Status</Label>
            <Select
              // value={row.original.status}

              onValueChange={(value) => setData({ ...data, status: value })}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent className="capitalize">
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {reservationStatusArray?.map((status) => {
                    const statusInfo = getReservationStatusInfo(
                      status as ReservationStatus,
                    )
                    return (
                      <SelectItem
                        key={status}
                        value={status}
                        // disabled={status === row.original.status}
                      >
                        {statusInfo?.label}
                      </SelectItem>
                    )
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full space-y-4">
            <Label>Note</Label>
            <Textarea
              value={data.note}
              onChange={(e) => setData({ ...data, note: e.target.value })}
            />
          </div>
          <div>
            <Button type="button" onClick={handleClickAction}>
              Submit
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
