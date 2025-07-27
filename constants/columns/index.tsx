import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatLocal } from '@/lib/date'
import {
  ApplicationsType,
  reservationLogsType,
  ReservationsType,
  RoomType,
  ValueJobType,
  ValueRoomType,
} from '@/types/common'
import {
  formatRangeRupiah,
  getReservationStatusInfo,
  indonesiaRupiah,
  ReservationStatus,
} from '@/utils'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Clock, MoreHorizontal, Paperclip } from 'lucide-react'

export const columnsReservations = (
  onClickAction: ({ data, type }: ValueJobType) => void,
): ColumnDef<ReservationsType>[] => [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => <p>{row.getValue('code')}</p>,
  },
  {
    accessorKey: 'room',
    header: 'Room Code',
    size: 100,
    cell: ({ row }) => <p>{row.original.room.code}</p>,
  },
  {
    accessorKey: 'room',
    header: 'Room',
    size: 100,
    cell: ({ row }) => <p>{row.original.room.name}</p>,
  },
  {
    accessorKey: 'user',
    header: 'Customer',
    size: 100,
    cell: ({ row }) => <p>{row.original.user.full_name}</p>,
  },
  {
    accessorKey: 'user',
    header: 'Email',
    size: 100,
    cell: ({ row }) => <p>{row.original.user.email}</p>,
  },
  {
    accessorKey: 'user',
    header: 'Phone Number',
    size: 100,
    cell: ({ row }) => <p>{row.original.user.phone}</p>,
  },
  {
    accessorKey: 'note',
    header: 'Note',
    size: 200,
    cell: ({ row }) => (
      <p className="whitespace-normal break-words">
        {row.getValue('note') || '-'}
      </p>
    ),
  },
  {
    header: 'Arrival',
    cell: ({ row }) => (
      <p>{`${
        row?.original?.arrival &&
        format(new Date(row?.original?.arrival || ''), 'dd MMM yyyy')
      }`}</p>
    ),
  },
  {
    header: 'Departure',
    cell: ({ row }) => (
      <p>{`${
        row?.original?.departure &&
        format(new Date(row?.original?.departure || ''), 'dd MMM yyyy')
      }`}</p>
    ),
  },
  {
    accessorKey: 'total_room',
    header: 'Total Room',
    cell: ({ row }) => <p>{row.getValue('total_room')}</p>,
  },
  {
    accessorKey: 'discount',
    header: 'Discount (%)',
    cell: ({ row }) => <p>{row.getValue('discount') || '-'}</p>,
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => (
      <p>{indonesiaRupiah(row.getValue('price'), false) || '-'}</p>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const statusInfo = getReservationStatusInfo(
        row?.original?.status as ReservationStatus,
      )
      return (
        <Badge
          className={`text-sm font-semibold ${
            statusInfo?.textColor ?? 'text-gray-700'
          } ${statusInfo?.bgColor ?? 'bg-gray-200'}`}
        >
          {statusInfo?.label ?? 'Unknown'}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                onClickAction({
                  data: {
                    id: row.original.id,
                  },
                  type: 'view',
                })
              }
            >
              View Reservation Logs
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                onClickAction({
                  data: {
                    ...row.original,
                  },
                  type: 'update',
                })
              }}
            >
              Update Status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const columnsRooms = (
  onClickAction: ({ data, type }: ValueRoomType) => void,
): ColumnDef<RoomType>[] => [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => <p>{row.getValue('code')}</p>,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <p>{row.getValue('name')}</p>,
  },
  {
    accessorKey: 'total_room',
    header: 'Total Room',
    cell: ({ row }) => <p>{row.original.total_room}</p>,
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => <p>{indonesiaRupiah(row.original.price, false)}</p>,
  },
  {
    accessorKey: 'discount',
    header: 'Discount (%)',
    cell: ({ row }) => <p>{row.original.discount}</p>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    size: 200,
    cell: ({ row }) => {
      const desc = row.getValue('description') as string
      const shortDesc = desc.length > 15 ? `${desc.slice(0, 15)}...` : desc

      return <p className="whitespace-normal break-words">{shortDesc}</p>
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                onClickAction({
                  data: {
                    ...row.original,
                  },
                  type: 'edit',
                })
              }
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                const confirm = window.confirm(
                  'Are you sure want delete this data ?',
                )
                if (confirm) {
                  onClickAction({
                    data: {
                      ...row.original,
                    },
                    type: 'delete',
                  })
                }
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const columnsReservationLogs =
  (): // onClickAction: ({ id, status }: { id: string; status: string }) => void,
  ColumnDef<reservationLogsType>[] => [
    {
      header: 'Status',
      cell: ({ row }) => {
        const statusInfo = getReservationStatusInfo(
          row?.original?.status as ReservationStatus,
        )
        return (
          <Badge
            className={`text-sm font-semibold ${
              statusInfo?.textColor ?? 'text-gray-700'
            } ${statusInfo?.bgColor ?? 'bg-gray-200'}`}
          >
            {statusInfo?.label ?? 'Unknown'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'note',
      header: 'Note',
      cell: ({ row }) => <p>{row.getValue('note')}</p>,
    },
    {
      header: 'Created At',
      cell: ({ row }) => (
        <p>{`${
          row?.original?.created_at &&
          format(new Date(row?.original?.created_at || ''), 'dd MMM yyyy HH:mm')
        }`}</p>
      ),
    },
    // {
    //   id: 'actions',
    //   header: 'Actions',
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     return (
    //       <Select
    //         value={row.original.status}
    //         onValueChange={(value) =>
    //           onClickAction({ id: row.original.id, status: value })
    //         }
    //       >
    //         <SelectTrigger className="w-[180px]">
    //           <SelectValue placeholder="Select a status" />
    //         </SelectTrigger>
    //         <SelectContent className="capitalize">
    //           <SelectGroup>
    //             <SelectLabel>Status</SelectLabel>
    //             {reservationStatusArray?.map((status) => {
    //               const statusInfo = getReservationStatusInfo(
    //                 status as ReservationStatus,
    //               )
    //               return (
    //                 <SelectItem
    //                   key={status}
    //                   value={status}
    //                   disabled={status === row.original.status}
    //                 >
    //                   {statusInfo?.label}
    //                 </SelectItem>
    //               )
    //             })}
    //           </SelectGroup>
    //         </SelectContent>
    //       </Select>
    //     )
    //   },
    // },
  ]

export const columnsApplications: ColumnDef<ApplicationsType>[] = [
  {
    header: 'Job Title',
    cell: ({ row }) => <p>{row.original.job.title}</p>,
  },
  {
    header: 'Job Description',
    cell: ({ row }) => <p>{row.original.job.description}</p>,
  },
  {
    header: 'Job Salary Offered',
    cell: ({ row }) => (
      <p>{`${formatRangeRupiah(
        row.original.job.min_salary_offered,
        row.original.job.max_salary_offered,
      )}`}</p>
    ),
  },
  {
    header: 'Applied At',
    cell: ({ row }) => (
      <p>{format(formatLocal(row.original.created_at), 'dd MMM yyyy hh:mm')}</p>
    ),
  },
  {
    header: 'Status',
    cell: ({ row }) => (
      <Badge className="capitalize">
        {String(row.original.status).replaceAll('_', ' ')}
      </Badge>
    ),
  },
  {
    header: 'Logs',
    cell: ({ row }) => (
      <div>
        <ul className="list-disc space-y-2">
          {row.original.status_log.map((log, index) => (
            <li key={String(index)}>
              <p>
                <Badge
                  variant={
                    row.original.status_log.length - 1 === index
                      ? 'default'
                      : 'secondary'
                  }
                  className="capitalize"
                >
                  {String(log.status).replaceAll('_', ' ')}
                </Badge>{' '}
                <small className="flex items-center gap-1">
                  <Clock size="10" />
                  {format(formatLocal(log.created_at), 'dd MMM yyyy kk:mm')}
                </small>
                <small className="flex items-center gap-1">
                  <Paperclip size="10" />
                  {log.note}
                </small>
              </p>
              <p></p>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
]
