/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '@/lib/db'
import {
  roomImageTable,
  roomReviewTable,
  roomTable,
  roomVideosTable,
  usersTable,
} from '@/lib/db/schema'
import { errorResponse, jsonResponse } from '@/utils'
import { sql, eq, and, isNull, desc, isNotNull } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id
  // alias
  const image = alias(roomImageTable, 'imgAllias')
  const videos = alias(roomVideosTable, 'vdsAllias')

  try {
    const [baseQuery] = await db
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
        images: sql<Array<string>>`array_agg(DISTINCT ${image.image_url})`.as(
          'images',
        ),
        videos: sql<
          Array<{
            title: string | null
            description: string | null
            video_url: string
          }>
        >`
      json_agg(DISTINCT jsonb_build_object(
        'title', ${videos.title},
        'description', ${videos.description},
        'video_url', ${videos.video_url}
      ))
    `.as('videos'),
        reviews: sql<
          Array<{
            rate: string | null
            comment: string | null
            user: {
              id: string
              fullname: string
              image: string | null
            }
          }>
        >`
  json_agg(DISTINCT jsonb_build_object(
    'rate', ${roomReviewTable.rating},
    'comment', ${roomReviewTable.comment},
    'user', jsonb_build_object(
      'id', ${usersTable.id},
      'full_name', ${usersTable.full_name},
      'image', ${usersTable.image_url}
    )
  ))
`.as('reviews'),
      })
      .from(roomTable)
      .leftJoin(image, eq(image.room_id, roomTable.id))
      .leftJoin(videos, eq(videos.room_id, roomTable.id))
      .leftJoin(roomReviewTable, eq(roomReviewTable.room_id, id))
      .leftJoin(usersTable, eq(usersTable.id, roomReviewTable.user_id))
      .where(and(eq(roomTable.id, id), isNull(roomTable.deleted_at)))
      .groupBy(roomTable.id)
      .orderBy(desc(roomTable.updated_at))

    const result = await baseQuery

    return jsonResponse({ data: result })
  } catch (error) {
    return errorResponse({ message: 'Failed to fetch jobs' })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id
  const body = await req.json()

  try {
    const updatedRoom = await db
      .update(roomTable)
      .set({
        name: body.name,
        price: body.price,
        discount: body.discount ? body.discount : null,
        description: body.description || null,
        total_room: body.total_room ?? 1,
        updated_at: new Date(),
      })
      .where(eq(roomTable.id, id))
      .returning()

    if (updatedRoom.length === 0) {
      return errorResponse({ message: 'Room not found', status: 404 })
    }

    if (Array.isArray(body.images) && body.images.length > 0) {
      // Hapus semua gambar yang terkait dengan room_id
      await db.delete(roomImageTable).where(eq(roomImageTable.room_id, id))

      // Insert gambar baru
      const imagesToInsert = body.images.map((url: string) => ({
        room_id: id,
        image_url: url,
        created_at: new Date(),
        updated_at: new Date(),
      }))

      await db.insert(roomImageTable).values(imagesToInsert)
    }

    if (Array.isArray(body.videos) && body.videos.length > 0) {
      await db.delete(roomVideosTable).where(eq(roomVideosTable.room_id, id))

      const videosToInsert = body.videos.map((video: any) => ({
        room_id: id,
        title: video.title || null,
        description: video.description || null,
        video_url: video.video_url,
        created_at: new Date(),
        updated_at: new Date(),
      }))
      await db.insert(roomVideosTable).values(videosToInsert)
    }

    return jsonResponse({ data: updatedRoom })
  } catch (error) {
    console.log(error)
    return errorResponse({ message: 'Failed to update room' })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const roomId = (await params).id

  try {
    // Hapus data image & video yang berelasi
    await db.delete(roomImageTable).where(eq(roomImageTable.room_id, roomId))
    await db.delete(roomVideosTable).where(eq(roomVideosTable.room_id, roomId))

    // Hapus room-nya sendiri
    await db.delete(roomTable).where(eq(roomTable.id, roomId))

    return NextResponse.json({ message: 'Room deleted successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 },
    )
  }
}
