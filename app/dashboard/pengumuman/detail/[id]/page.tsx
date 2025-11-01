"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash2, Calendar, User, AlertTriangle } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Announcement } from "@/lib/types"

export default function DetailPengumumanPage() {
  const params = useParams()
  const id = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/announcements/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch announcement')
        }

        const data: Announcement = await response.json()
        setAnnouncement(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchAnnouncement()
    }
  }, [id])

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'tinggi':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'sedang':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rendah':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Detail Pengumuman"
          description="Memuat data pengumuman..."
        />
        <Card className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </Card>
      </div>
    )
  }

  if (error || !announcement) {
    return (
      <div>
        <PageHeader
          title="Detail Pengumuman"
          description="Terjadi kesalahan"
          action={
            <Link href="/dashboard/pengumuman">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
          }
        />
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Pengumuman tidak ditemukan'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Detail Pengumuman"
        description="Informasi lengkap pengumuman"
        action={
          <div className="flex gap-2">
            <Link href={`/dashboard/pengumuman/edit/${announcement.id}`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Link href="/dashboard/pengumuman">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
          </div>
        }
      />

      <Card className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b pb-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {announcement.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getPriorityColor(announcement.priority)}>
                    {announcement.priority}
                  </Badge>
                  <Badge className={getStatusColor(announcement.status)}>
                    {announcement.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-b">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Dibuat: {formatDate(announcement.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>ID: {announcement.uuid}</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Deskripsi</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {announcement.descriptions}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}