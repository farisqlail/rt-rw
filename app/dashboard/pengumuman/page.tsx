"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Filter, AlertCircle, Trash2, Edit, Eye } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Announcement } from "@/lib/types"

export default function PengumumanPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch announcements from API
  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/announcements')
      if (!response.ok) {
        throw new Error('Failed to fetch announcements')
      }
      const data = await response.json()
      setAnnouncements(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Delete announcement
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete announcement')
      }
      // Refresh the list
      fetchAnnouncements()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete announcement')
    }
  }

  // Filter announcements based on search query
  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.descriptions.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Load announcements on component mount
  useEffect(() => {
    fetchAnnouncements()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Memuat pengumuman...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchAnnouncements} className="mt-4">
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Pengumuman & Informasi"
        description="Kelola pengumuman untuk warga"
        action={
          <Link href="/dashboard/pengumuman/tambah">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Buat Pengumuman
            </Button>
          </Link>
        }
      />

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pengumuman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 search-input"
          />
        </div>
        <Button variant="outline" className="filter-button">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {filteredAnnouncements.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Tidak ada pengumuman</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Tidak ada pengumuman yang sesuai dengan pencarian." : "Belum ada pengumuman yang dibuat."}
          </p>
          <Link href="/dashboard/pengumuman/tambah">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Buat Pengumuman Pertama
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {item.priority === "tinggi" && <AlertCircle className="h-5 w-5 text-red-500" />}
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={
                      item.priority === "tinggi"
                        ? "destructive"
                        : item.priority === "sedang"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {item.priority}
                  </Badge>
                  <Badge variant={item.status === "published" ? "default" : "secondary"}>
                    {item.status}
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground mb-3 line-clamp-2">{item.descriptions}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/pengumuman/detail/${item.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Lihat
                    </Button>
                  </Link>
                  <Link href={`/dashboard/pengumuman/edit/${item.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Hapus
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Pengumuman</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus pengumuman "{item.title}"? 
                          Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
