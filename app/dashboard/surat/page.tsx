"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Filter, FileText, Loader2, Edit, Trash2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { getData, deleteData } from "@/lib/supabaseUtils"
import type { MailManagement } from "@/lib/types"



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
  const [mailData, setMailData] = useState<MailManagement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMailData()
  }, [])

  const fetchMailData = async () => {
    try {
      setLoading(true)
      const data = await getData<MailManagement>("rtrw_mail_managements")
      setMailData(data || [])
    } catch (error) {
      console.error("Error fetching mail data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data surat ini?")) {
      try {
        await deleteData("rtrw_mail_managements", id)
        setMailData(mailData.filter(mail => mail.id !== id))
        alert("Data surat berhasil dihapus!")
      } catch (error) {
        console.error("Error deleting mail:", error)
        alert("Gagal menghapus data surat!")
      }
    }
  }

  const columns = [
    { header: "No. Surat", accessor: "mail_number" as const },
    { header: "Kategori Surat", accessor: "mail_category" as const },
    { header: "Pemohon", accessor: "applicant" as const },
    { 
      header: "Tanggal Dibuat", 
      accessor: (row: MailManagement) => new Date(row.created_at).toLocaleDateString('id-ID')
    },
    {
      header: "Status",
      accessor: (row: MailManagement) => {
        const getVariant = (status: string) => {
          switch (status.toLowerCase()) {
            case 'pending': return "secondary" as const
            case 'diproses': return "default" as const
            case 'selesai': return "default" as const
            case 'ditolak': return "destructive" as const
            default: return "secondary" as const
          }
        }
        return <Badge variant={getVariant(row.status)}>{row.status}</Badge>
      },
    },
    {
      header: "Aksi",
      accessor: (row: MailManagement) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/surat/${row.id}/edit`}>
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Memuat data surat...</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Administrasi Surat"
        description="Kelola pengajuan dan pembuatan surat"
        action={
          <Link href="/dashboard/surat/tambah">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Surat
            </Button>
          </Link>
        }
      />

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Template Surat</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {templateSurat.map((template) => (
            <Link key={template.id} href={`/dashboard/surat/tambah?template=${template.id}`}>
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
            className="pl-10 search-input"
          />
        </div>
        <Button variant="outline" className="filter-button">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <DataTable data={mailData} columns={columns} onRowClick={(row) => (window.location.href = `/dashboard/surat/${row.id}`)} />
    </div>
  )
}
