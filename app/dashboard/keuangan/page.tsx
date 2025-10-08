"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Filter, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { Keuangan } from "@/lib/types"

const mockData: Keuangan[] = [
  {
    id: "1",
    tanggal: "2024-01-15",
    jenis: "pemasukan",
    kategori: "Iuran Bulanan",
    jumlah: 5000000,
    keterangan: "Iuran warga bulan Januari 2024",
  },
  {
    id: "2",
    tanggal: "2024-01-18",
    jenis: "pengeluaran",
    kategori: "Kebersihan",
    jumlah: 1500000,
    keterangan: "Pembayaran petugas kebersihan",
  },
  {
    id: "3",
    tanggal: "2024-01-20",
    jenis: "pengeluaran",
    kategori: "Keamanan",
    jumlah: 2000000,
    keterangan: "Gaji satpam bulan Januari",
  },
]

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function KeuanganPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const totalPemasukan = mockData
    .filter((item) => item.jenis === "pemasukan")
    .reduce((sum, item) => sum + item.jumlah, 0)
  const totalPengeluaran = mockData
    .filter((item) => item.jenis === "pengeluaran")
    .reduce((sum, item) => sum + item.jumlah, 0)
  const saldo = totalPemasukan - totalPengeluaran

  const columns = [
    { header: "Tanggal", accessor: "tanggal" as const },
    {
      header: "Jenis",
      accessor: (row: Keuangan) => (
        <Badge variant={row.jenis === "pemasukan" ? "default" : "secondary"}>
          {row.jenis === "pemasukan" ? "Pemasukan" : "Pengeluaran"}
        </Badge>
      ),
    },
    { header: "Kategori", accessor: "kategori" as const },
    {
      header: "Jumlah",
      accessor: (row: Keuangan) => (
        <span className={row.jenis === "pemasukan" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
          {row.jenis === "pemasukan" ? "+" : "-"} {formatRupiah(row.jumlah)}
        </span>
      ),
    },
    { header: "Keterangan", accessor: "keterangan" as const },
  ]

  return (
    <div>
      <PageHeader
        title="Keuangan RT/RW"
        description="Kelola pemasukan dan pengeluaran"
        action={
          <Link href="/keuangan/tambah">
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
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <DataTable
        data={mockData}
        columns={columns}
        onRowClick={(row) => (window.location.href = `/keuangan/${row.id}`)}
      />
    </div>
  )
}
