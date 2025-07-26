import ContainerCustomerReservationDetail from '@/containers/customer.reservations.detail'
import React from 'react'
import Script from 'next/script'

export default function page() {
  return (
    <div>
      <ContainerCustomerReservationDetail />
      <Script
        src="https://app.sandbox.midtrans.com/snap.js"
        data-client-key={process.env.MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
    </div>
  )
}
