'use client'

import CardReports from '@/components/section/card-reports'
import { Separator } from '@/components/ui/separator'
import AdminDashboardJobTable from './job-table'
import { useEffect, useState } from 'react'

export default function AdminDashboardContainer() {
  const [report, setReport] = useState<{
    totalApplicants: number
    totalJobs: number
    totalJobApplications: number
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
      title: 'Applicants',
      value: report?.totalApplicants ?? 0,
      description: 'Total Applicants',
    },
    {
      title: 'Jobs',
      value: report?.totalJobs ?? 0,
      description: 'Jobs Opening',
    },
    {
      title: 'Applications',
      value: report?.totalJobApplications ?? 0,
      description: 'Job Applications',
    },
  ]

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">
            Loading Reports...
          </div>
        ) : (
          <CardReports items={cardItems} />
        )}
        <Separator />
        <AdminDashboardJobTable />
      </div>
    </div>
  )
}
