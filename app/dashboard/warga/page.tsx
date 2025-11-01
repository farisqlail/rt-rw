"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Filter, Download, Edit, Trash2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getData, deleteData } from "@/lib/supabaseUtils"
import type { Resident } from "@/lib/types"

export default function WargaPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [residents, setResidents] = useState<Resident[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const data = await getData("rtrw_residents")
        setResidents((data as Resident[]) || [])
      } catch (error) {
        console.error("Error fetching residents:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResidents()
  }, [])

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data warga ini?")) {
      try {
        await deleteData("rtrw_residents", id)
        setResidents(residents.filter(resident => resident.id !== id))
        alert("Data warga berhasil dihapus!")
      } catch (error) {
        console.error("Error deleting resident:", error)
        alert("Gagal menghapus data warga!")
      }
    }
  }

  const columns = [
    { header: "NIK", accessor: "nik" as const },
    { header: "Nama", accessor: "name" as const },
    { header: "Alamat", accessor: "address" as const },
    { header: "RT/RW", accessor: "rtrw" as const },
    { header: "Telepon", accessor: "phone" as const },
    {
      header: "Status",
      accessor: (row: Resident) => (
        <Badge variant={row.status === "aktif" ? "default" : row.status === "pindah" ? "secondary" : "destructive"}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Aksi",
      accessor: (row: Resident) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/warga/${row.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(row.id)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const filteredResidents = residents.filter((resident) =>
    resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.nik.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            className="pl-10 search-input"
          />
        </div>
        <Button variant="outline" className="filter-button">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-10" />
          ))}
        </div>
      ) : (
        <DataTable 
          data={filteredResidents} 
          columns={columns} 
          onRowClick={(row) => (window.location.href = `/dashboard/warga/${row.id}`)}
        />
      )}
    </div>
  )
}
