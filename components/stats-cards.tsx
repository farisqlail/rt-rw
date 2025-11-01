"use client"

import { useState, useEffect } from "react"
import { Users, FileText, Wallet, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getData } from "@/lib/supabaseUtils"
import type { Resident, MailManagement, Keuangan, Kegiatan } from "@/lib/types"

interface StatsData {
  totalWarga: number
  suratPending: number
  saldoKas: number
  kegiatanBulanIni: number
}

export function StatsCards() {
  const [statsData, setStatsData] = useState<StatsData>({
    totalWarga: 0,
    suratPending: 0,
    saldoKas: 0,
    kegiatanBulanIni: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatsData()
  }, [])

  const fetchStatsData = async () => {
    try {
      // Fetch data from all tables
      const [wargaData, suratData, keuanganData, kegiatanData] = await Promise.all([
        getData<Resident>("rtrw_residents"),
        getData<MailManagement>("rtrw_mail_managements"),
        getData<Keuangan>("rtrw_finances"),
        getData<Kegiatan>("rtrw_activities")
      ])

      // Calculate stats
      const totalWarga = wargaData?.filter(w => w.status === "aktif").length || 0
      const suratPending = suratData?.filter(s => s.status === "pending").length || 0
      
      // Calculate saldo kas (pemasukan - pengeluaran)
      const totalPemasukan = keuanganData?.filter(k => k.finance_category === "pemasukan").reduce((sum, k) => sum + k.amount, 0) || 0
      const totalPengeluaran = keuanganData?.filter(k => k.finance_category === "pengeluaran").reduce((sum, k) => sum + k.amount, 0) || 0
      const saldoKas = totalPemasukan - totalPengeluaran

      // Calculate kegiatan bulan ini
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const kegiatanBulanIni = kegiatanData?.filter(k => {
        const kegiatanDate = new Date(k.date)
        return kegiatanDate.getMonth() === currentMonth && kegiatanDate.getFullYear() === currentYear
      }).length || 0

      setStatsData({
        totalWarga,
        suratPending,
        saldoKas,
        kegiatanBulanIni
      })
    } catch (error) {
      console.error("Error fetching stats data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const stats = [
    {
      icon: Users,
      label: "Total Warga",
      value: loading ? "..." : statsData.totalWarga.toString(),
      change: "Warga aktif",
      trend: "neutral" as const,
    },
    {
      icon: FileText,
      label: "Surat Pending",
      value: loading ? "..." : statsData.suratPending.toString(),
      change: "Perlu ditindaklanjuti",
      trend: statsData.suratPending > 0 ? "neutral" : "up" as const,
    },
    {
      icon: Wallet,
      label: "Saldo Kas",
      value: loading ? "..." : formatRupiah(statsData.saldoKas),
      change: statsData.saldoKas >= 0 ? "Saldo positif" : "Saldo negatif",
      trend: statsData.saldoKas >= 0 ? "up" : "down" as const,
    },
    {
      icon: Calendar,
      label: "Kegiatan Bulan Ini",
      value: loading ? "..." : statsData.kegiatanBulanIni.toString(),
      change: "Kegiatan terjadwal",
      trend: "neutral" as const,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
