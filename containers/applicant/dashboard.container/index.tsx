'use client'

import CardReports from '@/components/section/card-reports'
import { Separator } from '@/components/ui/separator'
import ApplicationsTable from './applications-table'
import { useEffect, useState } from 'react'

export default function ApplicantDashboardContainer() {
  const [totalApplications, setTotalApplications] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTotalApplications = async () => {
      try {
        const res = await fetch('/api/reports/applicant')
        const { data } = await res.json()
        setTotalApplications(data?.totalApplications ?? 0)
      } catch (error) {
        console.error('Failed to fetch total applications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTotalApplications()
  }, [])

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">
            Loading Reports...
          </div>
        ) : (
          <CardReports
            items={[
              {
                title: 'Applications',
                value: totalApplications,
                description: 'My Job Applications',
              },
            ]}
          />
        )}
        <Separator />
        <ApplicationsTable />
      </div>
    </div>
  )
}
