'use client'
import LoadingOverlay from '@/components/LoadingOverlay'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import useFetcher from '@/hooks/useFetcher'
import { getReservationStatusInfo, indonesiaRupiah } from '@/utils'
import { format } from 'date-fns'
import { Star } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function ContainerCustomerReservationDetail() {
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const {
    data: reservation,
    isLoading,
    mutate,
  } = useFetcher({
    path: `/reservations/${params?.id}`,
  })
  const [rating, setRating] = useState({
    rating: reservation?.data?.review?.rating || 0,
    comment: reservation?.data?.review?.cooment || '',
  })

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute(
      'data-client-key',
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    )
    script.async = true
    document.body.appendChild(script)
    if (reservation) {
      setRating({
        rating: reservation?.data?.review?.rating || 0,
        comment: reservation?.data?.review?.comment || '',
      })
    }
  }, [reservation])

  const handlePay = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Jika kamu ingin mengirim data ke server (misalnya customer info atau order detail), bisa tambahkan body:
        body: JSON.stringify({
          code: reservation.data.code,
          amount: reservation.data.total_price,
          name: reservation.data.user.full_name,
          email: reservation.data.user.email,
        }),
      })

      const data = await res.json()

      // panggil Snap UI
      if (data.token) {
        window.snap.pay(data.token)
      } else {
        console.error('Snap belum tersedia atau token tidak valid')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  const handleRate = async () => {
    if (!rating.comment) return toast.info('comment required')
    setLoading(true)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Jika kamu ingin mengirim data ke server (misalnya customer info atau order detail), bisa tambahkan body:
        body: JSON.stringify({
          ...rating,
          room_id: reservation.data.room.id,
          user_id: reservation.data.user.id,
          reservation_id: reservation.data.id,
        }),
      })

      if (res.ok) {
        mutate()
        toast.success('add reviews successful')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-[6rem] p-6">
      <LoadingOverlay isLoading={isLoading} />
      <div>
        <h1 className="font-semibold text-2xl">Reservation Summary</h1>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Card className="p-4">
            <div className="flex justify-between text-gray-500">
              <span>Reservation Code</span>
              <span>{reservation?.data?.code}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Name</span>
              <span>{reservation?.data?.user?.full_name}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Email</span>
              <span>{reservation?.data?.user?.email}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Phone Number</span>
              <span>{reservation?.data?.user?.phone}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Address</span>
              <span>{reservation?.data?.user?.address || '-'}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Arrival</span>
              <span>
                {reservation?.data?.arrival &&
                  format(
                    new Date(reservation?.data?.arrival || ''),
                    'dd MMM yyyy',
                  )}
              </span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Departure</span>
              <span>
                {reservation?.data?.departure &&
                  format(
                    new Date(reservation?.data?.departure || ''),
                    'dd MMM yyyy',
                  )}
              </span>
            </div>
            {reservation?.data?.discount && (
              <div className="flex justify-between text-gray-500">
                <span>Discount</span>
                <span className="text-gray-400">
                  {reservation?.data?.discount} %
                </span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>Total Room</span>
              <span className="text-gray-400">
                {reservation?.data?.total_room}
              </span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Price</span>
              <span className="text-gray-400">
                Rp {indonesiaRupiah(reservation?.data?.price, false)}
              </span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Sub Total</span>
              <span className="text-primary">
                Rp {indonesiaRupiah(reservation?.data?.total_price, false)}
              </span>
            </div>

            <div className="flex justify-between text-gray-500">
              <span>Status</span>
              <Badge
                className={`text-sm font-semibold ${
                  getReservationStatusInfo(reservation?.data?.status)?.textColor
                } ${
                  getReservationStatusInfo(reservation?.data?.status)?.bgColor
                }`}
              >
                {getReservationStatusInfo(reservation?.data?.status)?.label}
              </Badge>
            </div>
          </Card>
          <div>
            <Card>
              <div className="grid md:grid-cols-2 px-4 gap-4">
                <div>
                  <Image
                    src={
                      Array.isArray(reservation?.data?.room?.images) &&
                      reservation?.data?.room?.images?.length > 0 &&
                      reservation?.data?.room?.images[0]
                        ? reservation?.data?.room?.images[0]
                        : 'data:image/jpeg;base64,...'
                    }
                    width={200}
                    height={150}
                    className="object-cover w-full h-auto"
                    alt=""
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <h1 className="font-semibold text-3xl">
                    {reservation?.data?.room?.name}
                  </h1>
                  <span className="text-gray-400 text-2xl">
                    Rp {indonesiaRupiah(reservation?.data?.price, false)} /
                    Night
                  </span>
                </div>
              </div>
            </Card>
            {Number(reservation?.data?.status) === 1 && (
              <Button
                type="button"
                onClick={handlePay}
                disabled={loading}
                className="w-full mt-4 py-6"
              >
                {loading ? 'Processing...' : 'Process Payment'}
              </Button>
            )}
          </div>
        </div>
        <Card className="mt-4 p-4">
          <label htmlFor="" className="font-semibold">
            Rate & Comment
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
                      onClick={() =>
                        setRating({ ...rating, rating: currentRate })
                      }
                    />
                    <Star
                      size={30}
                      color="yellow"
                      className={`${
                        Number(currentRate) <= Number(rating.rating)
                          ? '  fill-yellow-500'
                          : ' fill-gray-700'
                      }`}
                    />
                  </label>
                </div>
              )
            })}
          </div>
          <Textarea
            value={rating.comment}
            onChange={(e) => setRating({ ...rating, comment: e.target.value })}
          />
          <Button onClick={() => handleRate()} type="button">
            Send
          </Button>
        </Card>
      </div>
    </div>
  )
}
