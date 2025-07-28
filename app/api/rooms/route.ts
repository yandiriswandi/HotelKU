/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/lib/db'
// import { roomTable, jobApplicationsTable } from '@/lib/db/schema'
import { errorResponse, jsonResponse } from '@/utils'
import { formJobSchema, formRoomSchema } from '@/types/form-schema'
import { sql, eq, and, isNull, desc, isNotNull } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import { roomImageTable, roomTable, roomVideosTable } from '@/lib/db/schema'

export async function GET(req: NextRequest) {
  // alias
  const image = alias(roomImageTable, 'imgAllias')
  const videos = alias(roomVideosTable, 'vdsAllias')

  try {
    const baseQuery = db
      .select({
        id: roomTable.id,
        code: roomTable.code,
        name: roomTable.name,
        description: roomTable.description,
        price: roomTable.price,
        discount: roomTable.discount,
        total_room: roomTable.total_room,
        created_at: roomTable.created_at,
        updated_at: roomTable.updated_at,
        deleted_at: roomTable.deleted_at,
        // ambil array images
        images: sql<Array<string>>`array_agg(DISTINCT ${image.image_url})`.as(
          'images',
        ),
        // ambil array of object untuk video
        videos: sql<
          Array<{
            title: string | null
            description: string | null
            video_url: string
          }>
        >`json_agg(DISTINCT jsonb_build_object(
      'title', ${videos.title},
      'description', ${videos.description},
      'video_url', ${videos.video_url}
    ))`.as('videos'),
      })
      .from(roomTable)
      .leftJoin(image, eq(image.room_id, roomTable.id))
      .leftJoin(videos, eq(videos.room_id, roomTable.id))
      .where(isNull(roomTable.deleted_at))
      .groupBy(roomTable.id)
      .orderBy(desc(roomTable.updated_at))

    const result = await baseQuery

    return jsonResponse({ data: result })
  } catch (error) {
    return errorResponse({ message: 'Failed to fetch jobs' })
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  const parse = formRoomSchema.safeParse(body)

  if (!parse.success) {
    return errorResponse({
      message: 'Validation error',
      errors: parse.error.flatten().fieldErrors,
      status: 400,
    })
  }

  try {
    const totalRooms = await db.select().from(roomTable)
    const count = totalRooms.length + 1

    // 2. Buat kode unik
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const number = String(count).padStart(5, '0')
    const code = `RM/${year}/${month}/${day}/${number}`

    // 1. Simpan room utama
    const [newRoom] = await db
      .insert(roomTable)
      .values({
        name: parse.data.name,
        code,
        price: parse.data.price || '0', // ⬅️ pastikan hasilnya number
        discount: parse.data.discount ? parse.data.discount : '', // ⬅️ gunakan `undefined` untuk kolom nullable
        description: parse.data.description || null,
        total_room: parse.data.total_room ? parseInt(parse.data.total_room) : 1, // ⬅️ gunakan 1 sebagai default
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning()

    // 2. Simpan images
    if (Array.isArray(parse.data.images)) {
      const imagesToInsert = parse.data.images.map((url) => ({
        room_id: newRoom.id,
        image_url: url,
        created_at: new Date(),
        updated_at: new Date(),
      }))
      await db.insert(roomImageTable).values(imagesToInsert)
    }

    // 3. Simpan videos
    if (Array.isArray(parse.data.videos)) {
      const videosToInsert = parse.data.videos.map((video) => ({
        room_id: newRoom.id,
        title: video.title || null,
        description: video.description || null,
        video_url: video.video_url,
        created_at: new Date(),
        updated_at: new Date(),
      }))
      await db.insert(roomVideosTable).values(videosToInsert)
    }

    return jsonResponse({ data: newRoom })
  } catch (error) {
    return errorResponse({ message: 'Failed to create room' })
  }
}
