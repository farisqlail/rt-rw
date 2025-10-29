"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Filter, Download } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Warga } from "@/lib/types"

const mockData: Warga[] = [
  {
    id: "1",
    nik: "3201012345678901",
    nama: "Budi Santoso",
    alamat: "Jl. Merdeka No. 12",
    rt: "001",
    rw: "005",
    telepon: "081234567890",
    email: "budi@email.com",
    status: "aktif",
    tanggalDaftar: "2024-01-15",
  },
  {
    id: "2",
    nik: "3201012345678902",
    nama: "Siti Nurhaliza",
    alamat: "Jl. Merdeka No. 15",
    rt: "002",
    rw: "005",
    telepon: "081234567891",
    status: "aktif",
    tanggalDaftar: "2024-02-20",
  },
  {
    id: "3",
    nik: "3201012345678903",
    nama: "Ahmad Dahlan",
    alamat: "Jl. Merdeka No. 20",
    rt: "001",
    rw: "005",
    telepon: "081234567892",
    status: "pindah",
    tanggalDaftar: "2023-11-10",
  },
]

export default function WargaPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const columns = [
    { header: "NIK", accessor: "nik" as const },
    { header: "Nama", accessor: "nama" as const },
    { header: "Alamat", accessor: "alamat" as const },
    { header: "RT/RW", accessor: (row: Warga) => `${row.rt}/${row.rw}` },
    { header: "Telepon", accessor: "telepon" as const },
    {
      header: "Status",
      accessor: (row: Warga) => (
        <Badge variant={row.status === "aktif" ? "default" : row.status === "pindah" ? "secondary" : "destructive"}>
          {row.status}
        </Badge>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Manajemen Warga"
        description="Kelola data warga RT/RW"
        action={
          <Link href="/dashboard/warga/tambah">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Warga
            </Button>
          </Link>
        }
      />

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan nama, NIK, atau alamat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <DataTable data={mockData} columns={columns} onRowClick={(row) => (window.location.href = `/dashboard/warga/${row.id}`)} />
    </div>
  )
}
