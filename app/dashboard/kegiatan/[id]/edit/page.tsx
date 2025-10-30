"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { getData, updateData } from "@/lib/supabaseUtils"
import { Kegiatan } from "@/lib/types"

export default function EditKegiatanPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [kegiatanData, setKegiatanData] = useState<Kegiatan | null>(null)
  const [formData, setFormData] = useState({
    activity_name: "",
    date: "",
    time_start: "",
    time_end: "",
    location: "",
    description: "",
    guarantor: "",
    status: "planned",
  })

  useEffect(() => {
    const fetchKegiatanData = async () => {
      try {
        const data = await getData("rtrw_activities", { id: params.id })
        if (data && data.length > 0) {
          const kegiatan = data[0] as Kegiatan
          setKegiatanData(kegiatan)
          setFormData({
            activity_name: kegiatan.activity_name || "",
            date: kegiatan.date || "",
            time_start: kegiatan.time_start || "",
            time_end: kegiatan.time_end || "",
            location: kegiatan.location || "",
            description: kegiatan.description || "",
            guarantor: kegiatan.guarantor || "",
            status: kegiatan.status || "planned",
          })
        }
      } catch (error) {
        console.error("Error fetching activity data:", error)
        alert("Gagal memuat data kegiatan")
      } finally {
        setFetchLoading(false)
      }
    }

    if (params.id) {
      fetchKegiatanData()
    }
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await updateData("rtrw_activities", params.id as string, formData)
      router.push("/dashboard/kegiatan")
    } catch (error) {
      console.error("Error updating activity:", error)
      alert("Gagal memperbarui kegiatan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Memuat data kegiatan...</p>
        </div>
      </div>
    )
  }

  if (!kegiatanData) {
    return (
      <div className="text-center py-8">
        <p>Data kegiatan tidak ditemukan</p>
        <Link href="/dashboard/kegiatan">
          <Button className="mt-4">Kembali ke Daftar Kegiatan</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link href="/dashboard/kegiatan">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader title="Edit Kegiatan" description="Perbarui informasi kegiatan" />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Nama Kegiatan" required>
            <Input
              placeholder="Masukkan nama kegiatan"
              value={formData.activity_name}
              onChange={(e) => setFormData({ ...formData, activity_name: e.target.value })}
              required
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Tanggal" required>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Waktu Mulai" required>
              <Input
                type="time"
                value={formData.time_start}
                onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Waktu Selesai" required>
              <Input
                type="time"
                value={formData.time_end}
                onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
                required
              />
            </FormField>
          </div>

          <FormField label="Lokasi" required>
            <Input
              placeholder="Masukkan lokasi kegiatan"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Deskripsi Kegiatan" required>
            <Textarea
              placeholder="Jelaskan detail kegiatan..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              required
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Penanggung Jawab" required>
              <Input
                placeholder="Nama penanggung jawab"
                value={formData.guarantor}
                onChange={(e) => setFormData({ ...formData, guarantor: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Status" required>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="flex gap-3 justify-end">
            <Link href="/dashboard/kegiatan">
              <Button type="button" variant="outline" disabled={loading}>
                Batal
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
