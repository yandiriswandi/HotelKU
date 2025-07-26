'use client'
import LoadingOverlay from '@/components/LoadingOverlay'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardDescription, CardHeader } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import VideoPlayer from '@/components/VideoPlayer'
import { defaultValueReservation } from '@/constants'
import useFetcher from '@/hooks/useFetcher'
import useFormAction from '@/hooks/useFormAction'
import { cn } from '@/lib/utils'
import { ApiResponse, RoomType } from '@/types/common'
import { formReservationSchema } from '@/types/form-schema'
import { indonesiaRupiah } from '@/utils'
import { differenceInCalendarDays, format } from 'date-fns'
import {
  CalendarIcon,
  Loader2Icon,
  Star,
  StarHalf,
  StarOff,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import z from 'zod'

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

export default function FormDetailRooms() {
  const router = useRouter()
  const session = useSession()
  const formRef = useRef<HTMLFormElement>(null)
  const params = useParams()
  const { data: rooms, isLoading } = useFetcher<ApiResponse<RoomType>>({
    path: `/rooms/${params.id}`,
  })
  const { form } = useFormAction({
    schema: formReservationSchema,
    defaultValues: defaultValueReservation,
  })
  const [loading, setLoading] = useState(false)

  const onSubmitClick = () => {
    formRef.current?.requestSubmit()
  }

  const onSubmit = async (values: z.infer<typeof formReservationSchema>) => {
    const diff =
      differenceInCalendarDays(
        new Date(values.date_range.to),
        new Date(values.date_range.from),
      ) + 1
    const form = {
      user_id: session?.data?.user.id || '',
      room_id: params.id || '',
      price: rooms?.data.price || '0',
      discount: rooms?.data.discount || '0',
      arrival: values.date_range.to,
      departure: values.date_range.from,
      total_room: values.total_room,
      total_price: String(
        Number(values.total_room) *
          (Number(diff) *
            (Number(rooms?.data.price) -
              (Number(rooms?.data.price) * Number(rooms?.data.discount)) /
                100)),
      ),
      status: values.status,
    }
    console.log('form=>', form)

    setLoading(true)
    try {
      const response = await fetch(`/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (response.ok) {
        toast.success(`add reservation successful`)
        router.push(`/reservations/${data.data.id}`)
      }
    } catch (error) {
      console.log('error => ', error)
    } finally {
      setLoading(false)
    }
  }

  console.log(rooms)

  return (
    <div className="mt-[5rem] p-4">
      <LoadingOverlay isLoading={isLoading} />
      <div className="grid md:grid-cols-3 mt-14 p-4 gap-4">
        <div className="md:col-span-2">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className="w-full h-[40rem]"
          >
            {rooms?.data?.images?.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="w-full h-full">
                  <Image
                    src={img}
                    alt={`slide-${idx}`}
                    fill
                    className="object-cover object-center"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div>
          <Card className="p-4 border-2 border-dashed border-primary">
            <CardDescription className="flex justify-end items-center text-lg font-semibold">
              {rooms?.data?.price &&
                `Rp ${indonesiaRupiah(rooms?.data?.price, false)} / Night`}
            </CardDescription>
            <Form {...form}>
              <form
                ref={formRef}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 h-full"
              >
                <FormField
                  name="date_range"
                  render={({ field }) => {
                    const from = field.value?.from
                      ? new Date(field.value.from)
                      : undefined
                    const to = field.value?.to
                      ? new Date(field.value.to)
                      : undefined
                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel>Arrival - Departure</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl className="w-full">
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  !field.value?.from && 'text-muted-foreground',
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {from && to ? (
                                  <>
                                    {format(from, 'LLL dd, y')} -{' '}
                                    {format(to, 'LLL dd, y')}
                                  </>
                                ) : (
                                  <span>Pick a date range</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="range"
                              selected={field.value}
                              onSelect={(range) => {
                                field.onChange(range)
                                console.log(range)
                              }}
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
                <FormField
                  control={form.control}
                  name="total_room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Room</FormLabel>
                      <FormControl>
                        <Input placeholder="total room ..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Note</FormLabel>
                      <FormControl>
                        <Textarea placeholder="note ..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    size="lg"
                    type="button"
                    onClick={() => onSubmitClick()}
                    disabled={loading}
                  >
                    {loading && <Loader2Icon className="animate-spin" />}
                    {loading ? 'Loading' : 'Reserve'}
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">{rooms?.data?.name}</h2>
          <Badge variant="secondary" className="bg-sky-600 text-white">
            {rooms?.data.total_room}
          </Badge>
        </div>
        <div>
          <StarRatingLucide value={4} />
        </div>
        <p className="mt-4">{rooms?.data.description}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {rooms?.data.videos?.map((video) => {
          return (
            <Card className="" key={video.id}>
              <VideoPlayer url={video.video_url} />
              <CardHeader>{video?.title}</CardHeader>
              <CardDescription>
                <p className="px-4">{video?.description}</p>
              </CardDescription>
            </Card>
          )
        })}
      </div>
      <h1 className="text-2xl font-semibold mt-4 p-2 ">Reviews</h1>
      {rooms?.data?.reviews?.map((review) => {
        return (
          <Card className="mt-4 p-4" key={review.id}>
            <div className="flex items-center gap-4 px-2">
              <label htmlFor="" className="font-semibold">
                {review?.user?.full_name}
              </label>
              <div className="flex">
                {[...Array(5)].map((star, index) => {
                  const currentRate = index + 1
                  return (
                    <div key={currentRate}>
                      <label htmlFor={`rate-${currentRate + 1}`}>
                        <input
                          type="radio"
                          id={`rate-${currentRate + 1}`}
                          name="rate"
                          hidden
                          value={currentRate}
                        />
                        <Star
                          size={30}
                          color="yellow"
                          className={`${
                            Number(currentRate) <= Number(review?.rate)
                              ? '  fill-yellow-500'
                              : ' fill-gray-700'
                          }`}
                        />
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
            <Textarea value={review.comment} disabled />
          </Card>
        )
      })}
    </div>
  )
}
