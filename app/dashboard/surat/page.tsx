"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Filter, FileText } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { Surat } from "@/lib/types"

const mockData: Surat[] = [
  {
    id: "1",
    nomorSurat: "001/RT-001/I/2024",
    jenisSurat: "Surat Keterangan Domisili",
    pemohon: "Budi Santoso",
    tanggalPengajuan: "2024-01-15",
    status: "selesai",
    keterangan: "Untuk keperluan administrasi bank",
  },
  {
    id: "2",
    nomorSurat: "002/RT-001/I/2024",
    jenisSurat: "Surat Pengantar KTP",
    pemohon: "Siti Nurhaliza",
    tanggalPengajuan: "2024-01-20",
    status: "diproses",
  },
  {
    id: "3",
    nomorSurat: "003/RT-001/I/2024",
    jenisSurat: "Surat Keterangan Tidak Mampu",
    pemohon: "Ahmad Dahlan",
    tanggalPengajuan: "2024-01-22",
    status: "pending",
  },
]

const templateSurat = [
  { id: "1", nama: "Surat Keterangan Domisili", icon: FileText },
  { id: "2", nama: "Surat Pengantar KTP", icon: FileText },
  { id: "3", nama: "Surat Keterangan Tidak Mampu", icon: FileText },
  { id: "4", nama: "Surat Keterangan Usaha", icon: FileText },
  { id: "5", nama: "Surat Pengantar Nikah", icon: FileText },
  { id: "6", nama: "Surat Keterangan Kelahiran", icon: FileText },
]

export default function SuratPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const columns = [
    { header: "No. Surat", accessor: "nomorSurat" as const },
    { header: "Jenis Surat", accessor: "jenisSurat" as const },
    { header: "Pemohon", accessor: "pemohon" as const },
    { header: "Tanggal Pengajuan", accessor: "tanggalPengajuan" as const },
    {
      header: "Status",
      accessor: (row: Surat) => {
        const variants = {
          pending: "secondary" as const,
          diproses: "default" as const,
          selesai: "default" as const,
          ditolak: "destructive" as const,
        }
        return <Badge variant={variants[row.status]}>{row.status}</Badge>
      },
    },
  ]

  return (
    <div>
      <PageHeader
        title="Administrasi Surat"
        description="Kelola pengajuan dan pembuatan surat"
        action={
          <Link href="/surat/buat">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Buat Surat
            </Button>
          </Link>
        }
      />

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Template Surat</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {templateSurat.map((template) => (
            <Link key={template.id} href={`/surat/buat?template=${template.id}`}>
              <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <template.icon className="h-8 w-8 mb-2 text-primary" />
                <p className="text-sm font-medium leading-tight">{template.nama}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan nomor surat, pemohon..."
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

      <DataTable data={mockData} columns={columns} onRowClick={(row) => (window.location.href = `/surat/${row.id}`)} />
    </div>
  )
}
