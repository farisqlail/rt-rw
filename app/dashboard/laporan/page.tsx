"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter, FileText, AlertCircle, Loader2, Edit, Trash2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
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
import type { Laporan } from "@/lib/types"

export default function LaporanPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [laporanData, setLaporanData] = useState<Laporan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  // Fetch data from Supabase
  useEffect(() => {
    const fetchLaporanData = async () => {
      try {
        setLoading(true)
        const data = await getData<Laporan>("rtrw_informations")
        if (data) {
          setLaporanData(data)
        } else {
          setError("Gagal mengambil data laporan")
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data")
        console.error("Error fetching laporan data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchLaporanData()
  }, [])

  // Handle delete laporan
  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(id)
      const success = await deleteData("rtrw_informations", id)
      if (success) {
        // Remove from local state
        setLaporanData(prev => prev.filter(item => item.id !== id))
      } else {
        setError("Gagal menghapus laporan")
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menghapus laporan")
      console.error("Error deleting laporan:", err)
    } finally {
      setDeleteLoading(null)
    }
  }

  // Handle edit laporan
  const handleEdit = (id: string) => {
    router.push(`/dashboard/laporan/${id}/edit`)
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
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
        return "Diproses"
      case "resolved":
        return "Selesai"
      case "closed":
        return "Ditutup"
      default:
        return status
    }
  }

  const columns = [
    { header: "ID", accessor: "id" as const },
    { header: "Judul", accessor: "title" as const },
    { 
      header: "Deskripsi", 
      accessor: (row: Laporan) => (
        <div className="max-w-xs truncate" title={row.description}>
          {row.description}
        </div>
      )
    },
    {
      header: "Prioritas",
      accessor: (row: Laporan) => (
        <Badge variant={getPriorityColor(row.priority) as any}>
          {row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}
        </Badge>
      ),
    },
    {
      header: "Status",
      accessor: (row: Laporan) => (
        <Badge variant={getStatusColor(row.status) as any}>
          {getStatusText(row.status)}
        </Badge>
      ),
    },
    {
      header: "Tanggal Dibuat",
      accessor: (row: Laporan) => formatDate(row.created_at),
    },
    {
      header: "Actions",
      accessor: (row: Laporan) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(row.id)
            }}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => e.stopPropagation()}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={deleteLoading === row.id}
              >
                {deleteLoading === row.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Laporan</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus laporan "{row.title}"? 
                  Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(row.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ]

  // Filter data berdasarkan search query
  const filteredData = laporanData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.priority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Statistik untuk cards
  const totalLaporan = laporanData.length
  const laporanTerbuka = laporanData.filter(item => item.status === "open").length
  const laporanDiproses = laporanData.filter(item => item.status === "in-progress").length
  const laporanSelesai = laporanData.filter(item => item.status === "resolved").length

  // Loading state
  if (loading) {
    return (
      <div>
        <PageHeader
          title="Manajemen Laporan"
          description="Kelola laporan dan keluhan warga RT/RW"
          action={
            <Link href="/dashboard/laporan/tambah">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Laporan
              </Button>
            </Link>
          }
        />
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Memuat data laporan...</span>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div>
        <PageHeader
          title="Manajemen Laporan"
          description="Kelola laporan dan keluhan warga RT/RW"
          action={
            <Link href="/dashboard/laporan/tambah">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Laporan
              </Button>
            </Link>
          }
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-red-600">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Manajemen Laporan"
        description="Kelola laporan dan keluhan warga RT/RW"
        action={
          <Link href="/dashboard/laporan/tambah">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Laporan
            </Button>
          </Link>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Laporan</p>
              <p className="text-2xl font-bold">{totalLaporan}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Laporan Terbuka</p>
              <p className="text-2xl font-bold">{laporanTerbuka}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Sedang Diproses</p>
              <p className="text-2xl font-bold">{laporanDiproses}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Laporan Selesai</p>
              <p className="text-2xl font-bold">{laporanSelesai}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari laporan berdasarkan judul, deskripsi, prioritas, atau status..."
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

      <DataTable
        data={filteredData}
        columns={columns}
        onRowClick={(row) => (window.location.href = `/dashboard/laporan/${row.id}`)}
      />
    </div>
  )
}
