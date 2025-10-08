"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

// Mock initial data
const initialData = {
  judul: "Jadwal Kerja Bakti Minggu Ini",
  konten:
    "Dihimbau kepada seluruh warga untuk mengikuti kerja bakti pada hari Minggu, 28 Januari 2024 pukul 07.00 WIB.\n\nKegiatan meliputi:\n- Pembersihan selokan\n- Pengecatan pos ronda\n- Penataan taman\n\nMohon kehadiran dan partisipasinya. Terima kasih.",
  prioritas: "tinggi",
  status: "published",
}

export default function EditPengumumanPage() {
  const router = useRouter()
  const [formData, setFormData] = useState(initialData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Announcement updated:", formData)
    // TODO: Implement API call
    router.push("/pengumuman/1")
  }

  return (
    <div>
      <Link href="/pengumuman/1">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader title="Edit Pengumuman" description="Perbarui pengumuman" />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Judul Pengumuman" required>
            <Input
              placeholder="Masukkan judul pengumuman"
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Konten Pengumuman" required>
            <Textarea
              placeholder="Tulis isi pengumuman..."
              value={formData.konten}
              onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
              rows={8}
              required
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Prioritas" required>
              <Select
                value={formData.prioritas}
                onValueChange={(value) => setFormData({ ...formData, prioritas: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rendah">Rendah</SelectItem>
                  <SelectItem value="sedang">Sedang</SelectItem>
                  <SelectItem value="tinggi">Tinggi</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Status" required>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="flex gap-3 justify-end">
            <Link href="/pengumuman/1">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button type="submit">Simpan Perubahan</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
