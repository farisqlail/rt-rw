"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Download, Edit, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getData, deleteData } from "@/lib/supabaseUtils"
import type { MailManagement } from "@/lib/types"

export default function DetailSuratPage() {
  const router = useRouter()
  const params = useParams()
  const [mailData, setMailData] = useState<MailManagement | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchMailData()
    }
  }, [params.id])

  const fetchMailData = async () => {
    try {
      setLoading(true)
      const data = await getData<MailManagement>("rtrw_mail_managements", { id: params.id })
      
      if (data && data.length > 0) {
        setMailData(data[0])
      } else {
        alert("Data surat tidak ditemukan")
        router.push("/dashboard/surat")
      }
    } catch (error) {
      console.error("Error fetching mail data:", error)
      alert("Gagal memuat data surat")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!mailData) return
    
    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus surat ini?")
    if (!confirmDelete) return

    try {
      setDeleteLoading(true)
      const result = await deleteData("rtrw_mail_managements", mailData.id)
      
      if (result) {
        router.push("/dashboard/surat")
      } else {
        alert("Gagal menghapus surat. Silakan coba lagi.")
      }
    } catch (error) {
      console.error("Error deleting mail:", error)
      alert("Terjadi kesalahan saat menghapus surat.")
    } finally {
      setDeleteLoading(false)
    }
  }

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

  if (!mailData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Data surat tidak ditemukan</p>
          <Link href="/dashboard/surat">
            <Button className="mt-4">Kembali ke Daftar Surat</Button>
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div>
      <Link href="/dashboard/surat">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader
        title={mailData.mail_category}
        description={`No. Surat: ${mailData.mail_number}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Link href={`/dashboard/surat/${mailData.id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {deleteLoading ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Informasi Surat</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nomor Surat</p>
                <p className="font-medium">{mailData.mail_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kategori Surat</p>
                <p className="font-medium">{mailData.mail_category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nama Pemohon</p>
                <p className="font-medium">{mailData.applicant}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Dibuat</p>
                <p className="font-medium">{new Date(mailData.created_at).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Status Surat</h2>
            <Badge
              variant={
                mailData.status === "selesai"
                  ? "default"
                  : mailData.status === "ditolak"
                    ? "destructive"
                    : "secondary"
              }
              className="text-sm"
            >
              {mailData.status.toUpperCase()}
            </Badge>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Informasi Tambahan</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">UUID</p>
                <p className="font-medium text-xs">{mailData.uuid}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID Surat</p>
                <p className="font-medium">{mailData.id}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
