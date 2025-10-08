"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Filter, AlertTriangle } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { LaporanKeamanan } from "@/lib/types"

const mockData: LaporanKeamanan[] = [
  {
    id: "1",
    tanggal: "2024-01-25",
    jenis: "kejadian",
    deskripsi: "Pencurian sepeda motor di area parkir",
    lokasi: "Jl. Merdeka No. 15",
    pelapor: "Budi Santoso",
    status: "in-progress",
  },
  {
    id: "2",
    tanggal: "2024-01-24",
    jenis: "patroli",
    deskripsi: "Patroli malam rutin berjalan lancar",
    lokasi: "Seluruh area RT 001",
    pelapor: "Tim Keamanan",
    status: "resolved",
  },
  {
    id: "3",
    tanggal: "2024-01-23",
    jenis: "keluhan",
    deskripsi: "Lampu jalan mati di area RT",
    lokasi: "Jl. Merdeka No. 20",
    pelapor: "Siti Nurhaliza",
    status: "open",
  },
]

export default function KeamananPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const columns = [
    { header: "Tanggal", accessor: "tanggal" as const },
    {
      header: "Jenis",
      accessor: (row: LaporanKeamanan) => (
        <Badge variant={row.jenis === "kejadian" ? "destructive" : row.jenis === "patroli" ? "default" : "secondary"}>
          {row.jenis}
        </Badge>
      ),
    },
    { header: "Deskripsi", accessor: "deskripsi" as const },
    { header: "Lokasi", accessor: "lokasi" as const },
    { header: "Pelapor", accessor: "pelapor" as const },
    {
      header: "Status",
      accessor: (row: LaporanKeamanan) => (
        <Badge
          variant={row.status === "resolved" ? "default" : row.status === "in-progress" ? "secondary" : "secondary"}
        >
          {row.status}
        </Badge>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Keamanan & Sosial"
        description="Kelola laporan keamanan dan sosial"
        action={
          <Link href="/keamanan/buat">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Buat Laporan
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-sm text-muted-foreground">Laporan Terbuka</p>
              <p className="text-2xl font-semibold">3</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Dalam Proses</p>
              <p className="text-2xl font-semibold">5</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Selesai Bulan Ini</p>
              <p className="text-2xl font-semibold">12</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari laporan..."
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
        onRowClick={(row) => (window.location.href = `/keamanan/${row.id}`)}
      />
    </div>
  )
}
