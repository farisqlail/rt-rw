"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter, CalendarIcon, Edit, Trash2, Loader2 } from "lucide-react"
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
import { getData, deleteData } from "@/lib/supabaseUtils"
import type { Kegiatan } from "@/lib/types"

export default function KegiatanPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [kegiatanData, setKegiatanData] = useState<Kegiatan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getData<Kegiatan>("rtrw_activities")
        setKegiatanData(data || [])
      } catch (err) {
        console.error("Error fetching kegiatan:", err)
        setError("Gagal memuat data kegiatan")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle edit kegiatan
  const handleEdit = (id: string) => {
    router.push(`/dashboard/kegiatan/${id}/edit`)
  }

  // Handle delete kegiatan
  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(id)
      await deleteData("rtrw_activities", id)
      setKegiatanData(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error("Error deleting kegiatan:", err)
      alert("Gagal menghapus kegiatan. Silakan coba lagi.")
    } finally {
      setDeleteLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5) // Remove seconds from HH:MM:SS
  }

  // Filter data based on search query
  const filteredData = kegiatanData.filter(item =>
    item.activity_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.guarantor.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <PageHeader
        title="Manajemen Kegiatan"
        description="Kelola kegiatan dan acara RT/RW"
        action={
          <Link href="/dashboard/kegiatan/buat">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Buat Kegiatan
            </Button>
          </Link>
        }
      />

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kegiatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Memuat data kegiatan...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Tidak ada kegiatan yang sesuai dengan pencarian" : "Belum ada kegiatan"}
          </p>
          <Link href="/dashboard/kegiatan/buat">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Buat Kegiatan Pertama
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <Card key={item.id} className="p-6 h-full">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold line-clamp-2">{item.activity_name}</h3>
                <Badge
                  variant={
                    item.status === "completed"
                      ? "default"
                      : item.status === "ongoing"
                        ? "default"
                        : item.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                  }
                >
                  {item.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatDate(item.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Waktu:</span>
                  <span>{formatTime(item.time_start)} - {formatTime(item.time_end)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Lokasi:</span>
                  <span>{item.location}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>

              <div className="pt-3 border-t border-border mb-4">
                <p className="text-xs text-muted-foreground">Penanggung Jawab</p>
                <p className="text-sm font-medium">{item.guarantor}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item.id)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={deleteLoading === item.id}
                      className="flex-1"
                    >
                      {deleteLoading === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1" />
                      )}
                      Hapus
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Kegiatan</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus kegiatan "{item.activity_name}"? 
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
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
