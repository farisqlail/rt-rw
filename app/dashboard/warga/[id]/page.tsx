"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getData, deleteData } from "@/lib/supabaseUtils"
import type { Resident } from "@/lib/types"

export default function DetailWargaPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [residentData, setResidentData] = useState<Resident | null>(null)

  useEffect(() => {
    const fetchResident = async () => {
      try {
        const data = await getData("rtrw_residents", { id: params.id })
        if (data && data.length > 0) {
          setResidentData(data[0] as Resident)
        }
      } catch (error) {
        console.error("Error fetching resident:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResident()
  }, [params.id])

  const handleDelete = async () => {
    if (!residentData) return

    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus data warga ini?")
    if (!confirmDelete) return

    setDeleting(true)

    try {
      const result = await deleteData("rtrw_residents", residentData.id)
      
      if (result) {
        alert("Data warga berhasil dihapus!")
        router.push("/dashboard/warga")
      } else {
        alert("Gagal menghapus data warga.")
      }
    } catch (error) {
      console.error("Error deleting resident:", error)
      alert("Terjadi kesalahan saat menghapus data.")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!residentData) {
    return <div>Data warga tidak ditemukan.</div>
  }
  return (
    <div>
      <Link href="/dashboard/warga">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader
        title={residentData.name}
        description={`NIK: ${residentData.nik}`}
        action={
          <div className="flex gap-2">
            <Link href={`/dashboard/warga/${residentData.id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="text-destructive bg-transparent"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Informasi Pribadi</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                <p className="font-medium">{residentData.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">NIK</p>
                <p className="font-medium">{residentData.nik}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alamat</p>
                <p className="font-medium">{residentData.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">RT/RW</p>
                <p className="font-medium">{residentData.rtrw}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telepon</p>
                <p className="font-medium">{residentData.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{residentData.status}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Informasi Alamat</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Alamat Lengkap</p>
                <p className="font-medium">{residentData.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">RT/RW</p>
                <p className="font-medium">{residentData.rtrw}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">UUID</p>
                <p className="font-medium text-xs">{residentData.uuid || '-'}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Status</h2>
            <Badge variant={residentData.status === "Aktif" ? "default" : "secondary"} className="text-sm">
              {residentData.status.toUpperCase()}
            </Badge>
            <p className="text-sm text-muted-foreground mt-4">Tanggal Daftar</p>
            <p className="font-medium">
              {residentData.created_at ? new Date(residentData.created_at).toLocaleDateString('id-ID') : '-'}
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Kontak</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telepon</p>
                  <p className="font-medium">{residentData.phone || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Lokasi</p>
                  <p className="font-medium">{residentData.rtrw}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
