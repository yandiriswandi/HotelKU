'use client'

import CardReports from '@/components/section/card-reports'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'
import AdminRoomsTable from './room-table'

export default function AdminRoomsContainer() {
  const [report, setReport] = useState<{
    totalRooms: number
  } | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch('/api/reports/admin')
        const data = await res.json()
        setReport(data)
      } catch (error) {
        console.error('Failed to fetch report:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [])

  const cardItems = [
    {
      title: 'Rooms',
      value: Number(report?.totalRooms) ?? 0,
      description: 'Total Rooms',
    },
  ]

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm"
              >
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <CardReports items={cardItems} />
        )}
        <Separator />
        <AdminRoomsTable />
      </div>
    </div>
  )
}
