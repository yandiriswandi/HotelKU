/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Card } from '@/components/ui/card'
import useFetcher from '@/hooks/useFetcher'
import Image from 'next/image'
import { ApiResponse, RoomType } from '@/types/common'
import { useSession } from 'next-auth/react'
import React from 'react'
import { getReservationStatusInfo, indonesiaRupiah } from '@/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

export default function ContainerCustomerReservation() {
  const router = useRouter()
  const { data } = useSession()
  const { data: reservations, isLoading } = useFetcher({
    path: '/reservations',
  })
  console.log(reservations, 'hakllo')

  return (
    <div className="mt-[6rem] p-6">
      <p className="text-2xl font-semibold">Hi, {data?.user.full_name}</p>
      <p className="text-gray-600">{`Here's your book History`}</p>
      <div className="flex flex-col gap-4 mt-4">
        {reservations?.data.map((reservation: any) => {
          const statusInfo = getReservationStatusInfo(reservation.status)

          return (
            <Card key={reservation.id} className="p-0">
              <div className="bg-gray-400 rounded-t-lg px-4 flex justify-between py-2">
                <span className="text-white">
                  Reservation Code : <span>{reservation.code}</span>
                </span>
                <Badge
                  className={`text-sm font-semibold ${statusInfo.textColor} ${statusInfo.bgColor}`}
                >
                  {statusInfo.label}
                </Badge>
              </div>
              <div className="grid md:grid-cols-3 px-4 pb-4 gap-4">
                <div>
                  <Image
                    src={
                      Array.isArray(reservation.room.images) &&
                      reservation.room.images.length > 0 &&
                      reservation.room.images[0]
                        ? reservation.room.images[0]
                        : 'data:image/jpeg;base64,...'
                    }
                    width={200}
                    height={150}
                    className="object-cover w-full h-auto"
                    alt=""
                  />
                </div>
                <div className="col-span-2 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between font-semibold">
                      <span>Arrival</span>
                      <span className="text-gray-400">
                        {format(new Date(reservation.arrival), 'dd MMM yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Departure</span>
                      <span className="text-gray-400">
                        {format(new Date(reservation.departure), 'dd MMM yyyy')}
                      </span>
                    </div>
                    {reservation.discount && (
                      <div className="flex justify-between font-semibold">
                        <span>Discount</span>
                        <span className="text-gray-400">
                          {reservation.discount} %
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold">
                      <span>Total Room</span>
                      <span className="text-gray-400">
                        {reservation.total_room}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Price</span>
                      <span className="text-gray-400">
                        Rp {indonesiaRupiah(reservation.price, false)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Sub Total</span>
                      <span className="text-primary">
                        Rp {indonesiaRupiah(reservation.total_price, false)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() =>
                        router.push(`/reservations/${reservation.id}`)
                      }
                    >
                      View Detail
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
