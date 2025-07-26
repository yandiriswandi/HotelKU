'use client'

import ListTable from '@/components/section/data-table'
import { Button } from '@/components/ui/button'
import { defaultValueRoom } from '@/constants'
import { columnsRooms } from '@/constants/columns'
import useFetcher from '@/hooks/useFetcher'
import { ApiResponse, RoomType, ValueRoomType } from '@/types/common'
import { useState } from 'react'
import { toast } from 'sonner'
import AdminRoomsForm from './form-rooms'

export default function AdminRoomsTable() {
  const {
    data: rooms,
    isLoading,
    mutate,
  } = useFetcher<ApiResponse<RoomType[]>>({
    path: '/rooms',
  })
  const [valueRoom, setValueRoom] = useState<ValueRoomType>({
    data: defaultValueRoom,
    type: '',
  })

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/rooms/${id}`, { method: 'DELETE' })
      if (response.ok) {
        mutate()
        toast.success('Delete successful')
      }
    } catch (error) {
      console.log('error => ', error)
    }
  }

  const handleClickAction = (value: ValueRoomType) => {
    if (value?.type === 'delete') {
      handleDelete(value?.data.id)
      return
    }
    setValueRoom({ data: value.data, type: value.type })
  }

  const columns = columnsRooms(handleClickAction)

  return (
    <div className="w-full flex flex-col">
      <div className="pb-4 flex justify-between items-center">
        <p className="text-xl font-semibold">Rooms</p>
        <Button
          onClick={() =>
            setValueRoom({ data: defaultValueRoom, type: 'create' })
          }
        >
          Add Room
        </Button>
      </div>
      <ListTable
        columns={columns}
        data={rooms?.data || []}
        isLoading={isLoading}
      />
      <AdminRoomsForm
        open={valueRoom}
        onOpen={() => setValueRoom({ data: defaultValueRoom, type: '' })}
        values={valueRoom.data}
        onFinish={() => {
          mutate()
        }}
      />
    </div>
  )
}
