import cloudinary from '@/lib/claudinary'
import { randomUUID } from 'crypto' // atau gunakan nanoid jika mau
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('image') as File
  const folderName = (formData.get('folderName') || 'HotelKU-rooms') as string

  if (!file) {
    return new Response(JSON.stringify({ message: 'No file uploaded' }), {
      status: 400,
    })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = `${folderName}-${Date.now()}-${randomUUID()}`

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: folderName,
            public_id: fileName,
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          },
        )
        .end(buffer)
    })

    return new Response(JSON.stringify({ data: result }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Upload failed', error }), {
      status: 500,
    })
  }
}
