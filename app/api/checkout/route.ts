import { NextRequest, NextResponse } from 'next/server'
import midtransClient from 'midtrans-client'

export async function POST(req: NextRequest) {
  const body = await req.json()
  console.log(body)

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  })

  const parameter = {
    transaction_details: {
      order_id: `${body.code}-${Date.now()}`,
      gross_amount: body.amount, // contoh: 100000
    },
    customer_details: {
      first_name: body.name,
      email: body.email,
    },
  }

  try {
    const transaction = await snap.createTransaction(parameter)

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    })
  } catch (error) {
    console.error('Midtrans error:', error)
    return NextResponse.json(
      { error: 'Midtrans transaction failed' },
      { status: 500 },
    )
  }
}
