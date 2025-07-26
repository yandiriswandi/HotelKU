/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import useFetcher from '@/hooks/useFetcher'
import { ApiResponse, RoomType } from '@/types/common'
import { indonesiaRupiah } from '@/utils'
import { BadgeAlert, OctagonAlert, Star, StarHalf, StarOff } from 'lucide-react'
import Image from 'next/image'
import JobContainerLoading from './loading'
// import ImagesNoData from '@/public/images/datanotfound.jpg'
import { motion } from 'framer-motion'
import Link from 'next/link'
type RatingProps = {
  value: number
  max?: number
}

const StarRatingLucide: React.FC<RatingProps> = ({ value, max = 5 }) => {
  const stars = []

  for (let i = 1; i <= max; i++) {
    if (value >= i) {
      stars.push(
        <Star key={i} className="text-yellow-500 fill-yellow-500" size={20} />,
      )
    } else if (value >= i - 0.5) {
      stars.push(
        <StarHalf
          key={i}
          className="text-yellow-500 fill-yellow-500"
          size={20}
        />,
      )
    } else {
      stars.push(<StarOff key={i} className="text-gray-300" size={20} />)
    }
  }

  return <div className="flex gap-1">{stars}</div>
}

export default function HomepageJobContainer() {
  const { data: rooms, isLoading } = useFetcher<ApiResponse<RoomType[]>>({
    path: '/rooms',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: false, amount: 0.5 }}
      className="container mx-auto flex justify-around items-center flex-col py-14"
      id="rooms"
    >
      <h1 className="text-3xl font-semibold tracking-wider uppercase">Rooms</h1>
      {!isLoading && !rooms?.data.length && (
        <div className="flex justify-center items-center mt-10">
          {/* <Image src={ImagesNoData} alt="" width={100} height={100} /> */}
          <Alert variant="default">
            <OctagonAlert />
            <AlertTitle>No rooms have been posted</AlertTitle>
          </Alert>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-10 w-full">
        {isLoading && !rooms?.data.length ? (
          <JobContainerLoading />
        ) : (
          rooms?.data?.map((room: any, index) => (
            <Card key={String(index)} className="w-full max-w-sm p-0">
              <div className="w-full h-[300px] relative overflow-hidden">
                <Image
                  src={
                    Array.isArray(room.images) &&
                    room.images.length > 0 &&
                    room?.images?.[0]
                      ? room.images?.[0]
                      : 'data:image/jpeg;base64,...'
                  }
                  fill
                  className="object-cover object-center rounded-t-2xl"
                  alt=""
                />
                {room.discount && (
                  <div className="p-2">
                    <Badge
                      variant={room.discount ? 'default' : 'outline'}
                      className="absolute"
                    >
                      {room.discount}%
                    </Badge>
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex justify-end">
                  <StarRatingLucide value={4} />
                </div>
                <CardTitle className="text-xl">{room.name}</CardTitle>
                <CardDescription className="flex justify-start items-center text-lg">
                  Rp {indonesiaRupiah(room.price, false)} / Night
                </CardDescription>
                <CardDescription className="flex items-center gap-2">
                  <BadgeAlert />
                  {room.total_room} rooms
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-4 flex justify-end">
                <Link href={`/rooms/${room.id}`}>
                  <Button size="default" type="button">
                    Book Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )) || null
        )}
      </div>
    </motion.div>
  )
}
