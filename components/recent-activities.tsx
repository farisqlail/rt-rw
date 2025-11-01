"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { getData } from "@/lib/supabaseUtils"
import type { MailManagement, Security, Keuangan, Laporan } from "@/lib/types"

interface Activity {
  user: string
  action: string
  time: string
  avatar: string
  type: "surat" | "keamanan" | "keuangan" | "laporan"
}

export function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivities()
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) return "Baru saja"
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`
    return date.toLocaleDateString('id-ID')
  }

  const fetchRecentActivities = async () => {
    try {
      // Fetch recent data from all modules
      const [suratData, securityData, keuanganData, laporanData] = await Promise.all([
        getData<MailManagement>("rtrw_mail_managements"),
        getData<Security>("rtrw_securities"),
        getData<Keuangan>("rtrw_finances"),
        getData<Laporan>("rtrw_reports")
      ])

      const allActivities: Activity[] = []

      // Add surat activities
      suratData?.slice(0, 3).forEach(surat => {
        allActivities.push({
          user: surat.applicant,
          action: `mengajukan ${surat.mail_category}`,
          time: getRelativeTime(surat.created_at),
          avatar: getInitials(surat.applicant),
          type: "surat"
        })
      })

      // Add security activities
      securityData?.slice(0, 2).forEach(security => {
        allActivities.push({
          user: security.reporter,
          action: `melaporkan masalah keamanan di ${security.location}`,
          time: getRelativeTime(security.created_at),
          avatar: getInitials(security.reporter),
          type: "keamanan"
        })
      })

      // Add finance activities
      keuanganData?.slice(0, 2).forEach(keuangan => {
        allActivities.push({
          user: "Admin Keuangan",
          action: `mencatat ${keuangan.finance_category} ${keuangan.category}`,
          time: getRelativeTime(keuangan.created_at),
          avatar: "AK",
          type: "keuangan"
        })
      })

      // Add report activities
      laporanData?.slice(0, 2).forEach(laporan => {
        allActivities.push({
          user: "Admin",
          action: `membuat laporan: ${laporan.title}`,
          time: getRelativeTime(laporan.created_at),
          avatar: "AD",
          type: "laporan"
        })
      })

      // Sort by most recent and take top 5
      allActivities.sort((a, b) => {
        // Simple sorting by time string (this is approximate)
        if (a.time.includes("menit") && b.time.includes("jam")) return -1
        if (a.time.includes("jam") && b.time.includes("menit")) return 1
        return 0
      })

      setActivities(allActivities.slice(0, 5))
    } catch (error) {
      console.error("Error fetching recent activities:", error)
      // Fallback to empty array if error
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Aktivitas Terbaru</h2>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Aktivitas Terbaru</h2>
      </div>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Belum ada aktivitas terbaru
          </p>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <Avatar className="h-8 w-8 bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-medium">{activity.avatar}</span>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
