"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Filter, AlertTriangle, Edit, Trash2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getData, deleteData } from "@/lib/supabaseUtils"
import type { Security } from "@/lib/types"

export default function KeamananPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [securityData, setSecurityData] = useState<Security[]>([])
  const [loading, setLoading] = useState(true)
  const [statusCounts, setStatusCounts] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0
  })

  useEffect(() => {
    fetchSecurityData()
  }, [])

  const calculateStatusCounts = (data: Security[]) => {
    const counts = {
      open: 0,
      inProgress: 0,
      resolved: 0
    }

    data.forEach(item => {
      switch (item.status) {
        case 'open':
          counts.open++
          break
        case 'in-progress':
          counts.inProgress++
          break
        case 'resolved':
          counts.resolved++
          break
        default:
          // Handle any other status as open
          counts.open++
      }
    })

    return counts
  }

  const fetchSecurityData = async () => {
    try {
      const data = await getData<Security>("rtrw_securities")
      const securityList = data || []
      setSecurityData(securityList)
      
      // Calculate status counts
      const counts = calculateStatusCounts(securityList)
      setStatusCounts(counts)
    } catch (error) {
      console.error("Error fetching security data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data keamanan ini?")) {
      try {
        await deleteData("rtrw_securities", id)
        const updatedData = securityData.filter(item => item.id !== id)
        setSecurityData(updatedData)
        
        // Recalculate status counts after deletion
        const counts = calculateStatusCounts(updatedData)
        setStatusCounts(counts)
        alert("Data keamanan berhasil dihapus!")
      } catch (error) {
        console.error("Error deleting security data:", error)
        alert("Gagal menghapus data keamanan!")
      }
    }
  }

  const filteredData = securityData.filter(item =>
    item.descriptions.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.reporter.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = [
    { 
      header: "Tanggal", 
      accessor: (row: Security) => new Date(row.date).toLocaleDateString('id-ID')
    },
    { header: "Deskripsi", accessor: "descriptions" as const },
    { header: "Lokasi", accessor: "location" as const },
    { header: "Pelapor", accessor: "reporter" as const },
    {
      header: "Status",
      accessor: (row: Security) => (
        <Badge
          variant={row.status === "resolved" ? "default" : row.status === "in-progress" ? "secondary" : "destructive"}
        >
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Aksi",
      accessor: (row: Security) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/keamanan/${row.id}/edit`}>
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

  return (
    <div>
      <PageHeader
        title="Keamanan & Sosial"
        description="Kelola laporan keamanan dan sosial"
        action={
          <Link href="/dashboard/keamanan/tambah">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Data Keamanan
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
              <p className="text-2xl font-semibold">{loading ? "..." : statusCounts.open}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Dalam Proses</p>
              <p className="text-2xl font-semibold">{loading ? "..." : statusCounts.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Selesai</p>
              <p className="text-2xl font-semibold">{loading ? "..." : statusCounts.resolved}</p>
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
            className="pl-10 search-input"
          />
        </div>
        <Button variant="outline" className="filter-button">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <DataTable
        data={filteredData}
        columns={columns}
        onRowClick={(row) => (window.location.href = `/dashboard/keamanan/${row.id}`)}
      />
    </div>
  )
}
