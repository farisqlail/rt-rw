"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Filter, TrendingUp, TrendingDown, Wallet, Edit, Trash2, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { getData, deleteData } from "@/lib/supabaseUtils"
import type { Keuangan } from "@/lib/types"

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function KeuanganPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [keuanganData, setKeuanganData] = useState<Keuangan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchKeuanganData()
  }, [])

  const fetchKeuanganData = async () => {
    try {
      setLoading(true)
      const data = await getData<Keuangan>("rtrw_finances")
      if (data) {
        setKeuanganData(data)
      }
    } catch (error) {
      console.error("Error fetching finance data:", error)
      setError("Gagal memuat data keuangan")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: number) => {
    window.location.href = `/dashboard/keuangan/${id}/edit`
  }

  const handleDelete = async (id: number) => {
    try {
      setDeleteLoading(id)
      const success = await deleteData("rtrw_finances", id)
      if (success) {
        await fetchKeuanganData()
      } else {
        alert("Gagal menghapus data keuangan")
      }
    } catch (error) {
      console.error("Error deleting finance:", error)
      alert("Gagal menghapus data keuangan")
    } finally {
      setDeleteLoading(null)
    }
  }

  const filteredData = keuanganData.filter((item) =>
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPemasukan = filteredData
    .filter((item) => item.finance_category === "pemasukan")
    .reduce((sum, item) => sum + item.amount, 0)
  const totalPengeluaran = filteredData
    .filter((item) => item.finance_category === "pengeluaran")
    .reduce((sum, item) => sum + item.amount, 0)
  const saldo = totalPemasukan - totalPengeluaran

  const columns = [
    { 
      header: "Tanggal", 
      accessor: (row: Keuangan) => formatDate(row.created_at)
    },
    {
      header: "Jenis",
      accessor: (row: Keuangan) => (
        <Badge variant={row.finance_category === "pemasukan" ? "default" : "secondary"}>
          {row.finance_category === "pemasukan" ? "Pemasukan" : "Pengeluaran"}
        </Badge>
      ),
    },
    { header: "Kategori", accessor: "category" as const },
    {
      header: "Jumlah",
      accessor: (row: Keuangan) => (
        <span className={row.finance_category === "pemasukan" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
          {row.finance_category === "pemasukan" ? "+" : "-"} {formatRupiah(row.amount)}
        </span>
      ),
    },
    { header: "Keterangan", accessor: "description" as const },
    {
      header: "Aksi",
      accessor: (row: Keuangan) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(row.id)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => e.stopPropagation()}
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
                <AlertDialogTitle>Hapus Transaksi</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(row.id)}>
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Keuangan RT/RW"
        description="Kelola pemasukan dan pengeluaran"
        action={
          <Link href="/dashboard/keuangan/tambah">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Transaksi
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Pemasukan</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">{formatRupiah(totalPemasukan)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
              <p className="text-2xl font-semibold text-red-600 mt-1">{formatRupiah(totalPengeluaran)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Saldo</p>
              <p className="text-2xl font-semibold mt-1">{formatRupiah(saldo)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari transaksi..."
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

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Memuat data keuangan...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchKeuanganData} className="mt-4">
            Coba Lagi
          </Button>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Belum ada data transaksi keuangan.</p>
          <Link href="/dashboard/keuangan/tambah">
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Transaksi Pertama
            </Button>
          </Link>
        </div>
      ) : (
        <DataTable
          data={filteredData}
          columns={columns}
          onRowClick={(row) => (window.location.href = `/dashboard/keuangan/${row.id}`)}
        />
      )}
    </div>
  )
}
