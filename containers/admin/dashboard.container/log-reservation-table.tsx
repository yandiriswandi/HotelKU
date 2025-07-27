'use client'

import ListTable from '@/components/section/data-table'
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer'
import { columnsReservationLogs } from '@/constants/columns'
import useFetcher from '@/hooks/useFetcher'
import { ApiResponse, reservationLogsType } from '@/types/common'

type AdminDashboardLogsProps = {
  open: string | number
  onOpen: () => void
}

export default function AdminDashboardLogsTable({
  open,
  onOpen,
}: AdminDashboardLogsProps) {
  const { data: reservationLogs, isLoading } = useFetcher<
    ApiResponse<reservationLogsType[]>
  >({
    enabled: !!open,
    path: !!open ? `/reservations/${open}/logs` : '',
  })

  const columns = columnsReservationLogs()

  return (
    <Drawer open={!!open} onOpenChange={onOpen}>
      <DrawerContent>
        <DrawerTitle className="text-center">Reservation Logs</DrawerTitle>

        <div className="max-h-[90vh] overflow-y-auto container p-4 w-full mx-auto">
          <ListTable
            columns={columns}
            data={reservationLogs?.data || []}
            isLoading={isLoading}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
