"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Filter, TrendingUp, TrendingDown, Wallet, Edit, Trash2, Loader2, Download, FileSpreadsheet, Calendar, X } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getData, deleteData } from "@/lib/supabaseUtils"
import { exportToExcel, exportFilteredData } from "@/lib/exportUtils"
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
  const [exportLoading, setExportLoading] = useState<'excel' | null>(null)
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")
  const [filterOpen, setFilterOpen] = useState(false)

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

  const handleExportExcel = async () => {
    try {
      setExportLoading('excel')
      if (dateFrom && dateTo) {
        // Export with date range filter
        await exportFilteredData(keuanganData, '', dateFrom, dateTo)
      } else {
        // Export all data
        await exportToExcel(filteredData, 'Data_Keuangan_RTRW')
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      alert("Gagal mengexport ke Excel")
    } finally {
      setExportLoading(null)
    }
  }



  const filteredData = keuanganData.filter((item) => {
    const matchesSearch = item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Parse item date (only date part, ignore time)
    const itemDate = new Date(item.created_at.split('T')[0])
    
    let matchesDateRange = true
    
    if (dateFrom) {
      const fromDate = new Date(dateFrom)
      matchesDateRange = matchesDateRange && itemDate >= fromDate
    }
    
    if (dateTo) {
      const toDate = new Date(dateTo)
      matchesDateRange = matchesDateRange && itemDate <= toDate
    }
    
    return matchesSearch && matchesDateRange
  })

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
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportExcel}
              disabled={exportLoading === 'excel'}
            >
              {exportLoading === 'excel' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4 mr-2" />
              )}
              Export Excel
            </Button>

            <Link href="/dashboard/keuangan/tambah">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Transaksi
              </Button>
            </Link>
          </div>
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
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="filter-button">
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {(dateFrom || dateTo) && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  1
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Filter Tanggal</h4>
                <p className="text-sm text-muted-foreground">
                  Pilih rentang tanggal untuk memfilter transaksi
                </p>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dari tanggal</label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sampai tanggal</label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDateFrom("")
                    setDateTo("")
                  }}
                  disabled={!dateFrom && !dateTo}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
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
