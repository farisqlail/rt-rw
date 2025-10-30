"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { updateData, getData } from "@/lib/supabaseUtils"
import type { Laporan } from "@/lib/types"

interface EditLaporanPageProps {
  params: {
    id: string
  }
}

export default function EditLaporanPage({ params }: EditLaporanPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [laporanData, setLaporanData] = useState<Laporan | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
  })

  // Fetch laporan data on component mount
  useEffect(() => {
    const fetchLaporanData = async () => {
      try {
        setIsPageLoading(true)
        const data = await getData("rtrw_informations", { id: params.id })
        
        if (data && data.length > 0) {
          const laporan = data[0] as Laporan
          setLaporanData(laporan)
          setFormData({
            title: laporan.title || "",
            description: laporan.description || "",
            priority: laporan.priority || "",
            status: laporan.status || "",
          })
        } else {
          setError("Laporan tidak ditemukan")
        }
      } catch (err) {
        console.error("Error fetching laporan:", err)
        setError("Terjadi kesalahan saat memuat data laporan")
      } finally {
        setIsPageLoading(false)
      }
    }

    if (params.id) {
      fetchLaporanData()
    }
  }, [params.id])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Prepare data for database update
      const updatePayload = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
      }

      // Update laporan using supabase utils
      const result = await updateData("rtrw_informations", params.id, updatePayload)
      
      if (result) {
        // Redirect to laporan list on success
        router.push("/dashboard/laporan")
      } else {
        alert("Gagal memperbarui laporan. Silakan coba lagi.")
      }
    } catch (error) {
      console.error("Error updating laporan:", error)
      alert("Terjadi kesalahan saat memperbarui laporan.")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state
  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Memuat data laporan...</span>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !laporanData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Laporan tidak ditemukan"}</p>
          <Link href="/dashboard/laporan">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Laporan
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div>
      <PageHeader
        title={`Edit Laporan #${laporanData.id}`}
        description="Perbarui informasi laporan"
        action={
          <Link href="/dashboard/laporan">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField label="Judul Laporan" required>
                <Input
                  placeholder="Masukkan judul laporan"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Deskripsi" required>
                <Textarea
                  placeholder="Jelaskan detail laporan atau keluhan"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={6}
                  required
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Prioritas" required>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih prioritas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rendah">Rendah</SelectItem>
                      <SelectItem value="sedang">Sedang</SelectItem>
                      <SelectItem value="tinggi">Tinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Status" required>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Terbuka</SelectItem>
                      <SelectItem value="in-progress">Sedang Diproses</SelectItem>
                      <SelectItem value="resolved">Selesai</SelectItem>
                      <SelectItem value="closed">Ditutup</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
                <Link href="/dashboard/laporan">
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Informasi Laporan</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">ID Laporan</p>
                <p className="font-medium">#{laporanData.id}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">UUID</p>
                <p className="font-mono text-xs break-all">{laporanData.uuid || laporanData.id}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Tanggal Dibuat</p>
                <p className="font-medium">{formatDate(laporanData.created_at)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Panduan Edit</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Judul</p>
                <p>Gunakan judul yang jelas dan deskriptif</p>
              </div>
              
              <div>
                <p className="font-medium text-foreground">Deskripsi</p>
                <p>Jelaskan masalah secara detail dan lengkap</p>
              </div>
              
              <div>
                <p className="font-medium text-foreground">Prioritas</p>
                <p>Tinggi: Urgent, Sedang: Normal, Rendah: Tidak mendesak</p>
              </div>
              
              <div>
                <p className="font-medium text-foreground">Status</p>
                <p>Update status sesuai dengan progress penanganan</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Riwayat Perubahan</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Laporan dibuat</p>
                <p className="text-muted-foreground">{formatDate(laporanData.created_at)}</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Terakhir diperbarui</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}