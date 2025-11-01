"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDataById, updateData, deleteData } from "@/lib/supabaseUtils"
import type { Security } from "@/lib/types"

export default function DetailKeamananPage() {
  const params = useParams()
  const router = useRouter()
  const [securityData, setSecurityData] = useState<Security | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchSecurityData()
    }
  }, [params.id])

  const fetchSecurityData = async () => {
    try {
      const data = await getDataById<Security>("rtrw_securities", Number(params.id))
      setSecurityData(data)
    } catch (error) {
      console.error("Error fetching security data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkResolved = async () => {
    if (!securityData) return
    
    try {
      await updateData<Security>("rtrw_securities", securityData.id, { status: "resolved" })
      setSecurityData({ ...securityData, status: "resolved" })
      alert("Status berhasil diperbarui menjadi resolved!")
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Gagal memperbarui status!")
    }
  }

  const handleDelete = async () => {
    if (!securityData) return
    
    if (confirm("Apakah Anda yakin ingin menghapus data keamanan ini?")) {
      try {
        await deleteData("rtrw_securities", securityData.id)
        alert("Data keamanan berhasil dihapus!")
        router.push("/dashboard/keamanan")
      } catch (error) {
        console.error("Error deleting security data:", error)
        alert("Gagal menghapus data keamanan!")
      }
    }
  }

  if (loading) {
    return (
      <div>
        <Link href="/dashboard/keamanan">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <PageHeader
          title="Detail Data Keamanan"
          description="Memuat data..."
        />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (!securityData) {
    return (
      <div>
        <Link href="/dashboard/keamanan">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <PageHeader
          title="Detail Data Keamanan"
          description="Data tidak ditemukan"
        />
      </div>
    )
  }

  return (
    <div>
      <Link href="/dashboard/keamanan">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader
        title="Detail Data Keamanan"
        description={`Data #${securityData.id}`}
        action={
          <div className="flex gap-2">
            {securityData.status !== "resolved" && (
              <Button onClick={handleMarkResolved}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Tandai Selesai
              </Button>
            )}
            <Link href={`/dashboard/keamanan/${securityData.id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="text-destructive bg-transparent"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant={
                  securityData.status === "resolved"
                    ? "default"
                    : securityData.status === "in-progress"
                      ? "secondary"
                      : "destructive"
                }
              >
                {securityData.status}
              </Badge>
            </div>

            <h2 className="text-lg font-semibold mb-3">Deskripsi</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{securityData.descriptions}</p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Informasi</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Tanggal</p>
                <p className="font-medium">{new Date(securityData.date).toLocaleDateString('id-ID')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lokasi</p>
                <p className="font-medium">{securityData.location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pelapor</p>
                <p className="font-medium">{securityData.reporter}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dibuat</p>
                <p className="font-medium">{new Date(securityData.created_at).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
