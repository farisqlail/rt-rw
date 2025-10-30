"use client"

import { ArrowLeft, Edit, Trash2, Calendar, User, Flag, CheckCircle } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Mock data - in real app, fetch based on params.id
const laporanDetail = {
  id: 1,
  title: "Laporan Kerusakan Jalan",
  description: "Jalan di RT 001 mengalami kerusakan parah akibat hujan deras. Terdapat beberapa lubang besar yang dapat membahayakan pengendara, terutama pada malam hari. Perlu segera diperbaiki untuk keselamatan warga.",
  priority: "tinggi",
  status: "open",
  created_at: "2024-01-25T10:30:00Z",
  uuid: "550e8400-e29b-41d4-a716-446655440001",
  pelapor: "Budi Santoso",
  lokasi: "Jl. Merdeka No. 12, RT 001",
  telepon: "081234567890",
}

export default function DetailLaporanPage() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "tinggi":
        return "destructive"
      case "sedang":
        return "default"
      case "rendah":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "destructive"
      case "in-progress":
        return "default"
      case "resolved":
        return "secondary"
      case "closed":
        return "outline"
      default:
        return "default"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Terbuka"
      case "in-progress":
        return "Sedang Diproses"
      case "resolved":
        return "Selesai"
      case "closed":
        return "Ditutup"
      default:
        return status
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "tinggi":
        return <Flag className="h-4 w-4 text-red-500" />
      case "sedang":
        return <Flag className="h-4 w-4 text-yellow-500" />
      case "rendah":
        return <Flag className="h-4 w-4 text-green-500" />
      default:
        return <Flag className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "closed":
        return <CheckCircle className="h-4 w-4 text-gray-500" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <div>
      <PageHeader
        title={`Laporan #${laporanDetail.id}`}
        description="Detail laporan dan informasi lengkap"
        action={
          <div className="flex gap-2">
            <Link href={`/dashboard/laporan/${laporanDetail.id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
            <Link href="/dashboard/laporan">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{laporanDetail.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(laporanDetail.priority)}
                    <Badge variant={getPriorityColor(laporanDetail.priority) as any}>
                      Prioritas {laporanDetail.priority.charAt(0).toUpperCase() + laporanDetail.priority.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(laporanDetail.status)}
                    <Badge variant={getStatusColor(laporanDetail.status) as any}>
                      {getStatusText(laporanDetail.status)}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Deskripsi Laporan</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {laporanDetail.description}
                </p>
              </div>
            </div>
          </Card>

          {/* Timeline/History Section */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Riwayat Laporan</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Laporan dibuat</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(laporanDetail.created_at)}
                  </p>
                </div>
              </div>
              
              {laporanDetail.status === "in-progress" && (
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                    <Calendar className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Laporan sedang diproses</p>
                    <p className="text-sm text-muted-foreground">
                      Tim sedang menangani laporan ini
                    </p>
                  </div>
                </div>
              )}

              {laporanDetail.status === "resolved" && (
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Laporan selesai</p>
                    <p className="text-sm text-muted-foreground">
                      Masalah telah diselesaikan
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Report Info */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Informasi Laporan</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">ID Laporan</p>
                <p className="font-medium">#{laporanDetail.id}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">UUID</p>
                <p className="font-mono text-xs break-all">{laporanDetail.uuid}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Tanggal Dibuat</p>
                <p className="font-medium">{formatDate(laporanDetail.created_at)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Prioritas</p>
                <div className="flex items-center gap-2 mt-1">
                  {getPriorityIcon(laporanDetail.priority)}
                  <Badge variant={getPriorityColor(laporanDetail.priority) as any}>
                    {laporanDetail.priority.charAt(0).toUpperCase() + laporanDetail.priority.slice(1)}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(laporanDetail.status)}
                  <Badge variant={getStatusColor(laporanDetail.status) as any}>
                    {getStatusText(laporanDetail.status)}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Reporter Info */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Informasi Pelapor</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{laporanDetail.pelapor}</p>
                  <p className="text-sm text-muted-foreground">{laporanDetail.telepon}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Lokasi</p>
                <p className="font-medium">{laporanDetail.lokasi}</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Aksi Cepat</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Edit className="h-4 w-4 mr-2" />
                Edit Laporan
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="h-4 w-4 mr-2" />
                Tandai Selesai
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Laporan
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}