"use client"

import type React from "react"

import { useState } from "react"
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
import { createData } from "@/lib/supabaseUtils"
import { Kegiatan } from "@/lib/types"

export default function BuatKegiatanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const activityData = {
        ...formData,
        uuid: crypto.randomUUID(),
        created_at: new Date().toISOString()
      }
      
      await createData("rtrw_activities", activityData)
      router.push("/dashboard/kegiatan")
    } catch (error) {
      console.error("Error creating activity:", error)
      alert("Gagal membuat kegiatan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link href="/dashboard/kegiatan">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader title="Buat Kegiatan Baru" description="Rencanakan kegiatan atau acara RT/RW" />

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
                "Buat Kegiatan"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
