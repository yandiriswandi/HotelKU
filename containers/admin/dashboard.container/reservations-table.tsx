'use client'

import ListTable from '@/components/section/data-table'
import { columnsReservations } from '@/constants/columns'
import useFetcher from '@/hooks/useFetcher'
import { ApiResponse, ReservationsType, ValueJobType } from '@/types/common'
import { useState } from 'react'
import { toast } from 'sonner'
import AdminDashboardLogsTable from './log-reservation-table'
import UpdateLogs from './update-status-logs'

export default function AdminDashboardReservationsTable() {
  const {
    data: reservations,
    isLoading,
    mutate,
  } = useFetcher<ApiResponse<ReservationsType[]>>({
    path: '/reservations',
  })
  const [logReservations, setLogReservations] = useState<string>('')
  const [logReservationsUpdate, setLogReservationsUpdate] = useState<string>('')

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, { method: 'DELETE' })
      if (response.ok) {
        mutate()
        toast.success('Delete successful')
      }
    } catch (error) {
      console.log('error => ', error)
    }
  }

  const handleClickAction = (value: ValueJobType) => {
    if (value?.type === 'delete') {
      handleDelete(value?.data.id)
      return
    }

    if (value?.type === 'view') {
      setLogReservations(value?.data?.id)
      return
    }
    if (value?.type === 'update') {
      setLogReservationsUpdate(value?.data?.id)
      return
    }
  }

  const columns = columnsReservations(handleClickAction)

  console.log(reservations)

  return (
    <div className="w-full flex flex-col">
      <ListTable
        columns={columns}
        data={reservations?.data || []}
        isLoading={isLoading}
      />

      <AdminDashboardLogsTable
        open={logReservations}
        onOpen={() => setLogReservations('')}
      />
      <UpdateLogs
        open={logReservationsUpdate}
        onOpen={() => setLogReservationsUpdate('')}
        onFinish={() => {
          mutate()
        }}
      />
    </div>
  )
}
