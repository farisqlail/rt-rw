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

export default function BuatKegiatanPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    namaKegiatan: "",
    tanggal: "",
    waktuMulai: "",
    waktuSelesai: "",
    lokasi: "",
    deskripsi: "",
    penanggungJawab: "",
    status: "planned",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Activity created:", formData)
    // TODO: Implement API call
    router.push("/kegiatan")
  }

  return (
    <div>
      <Link href="/kegiatan">
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
              value={formData.namaKegiatan}
              onChange={(e) => setFormData({ ...formData, namaKegiatan: e.target.value })}
              required
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Tanggal" required>
              <Input
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Waktu Mulai" required>
              <Input
                type="time"
                value={formData.waktuMulai}
                onChange={(e) => setFormData({ ...formData, waktuMulai: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Waktu Selesai" required>
              <Input
                type="time"
                value={formData.waktuSelesai}
                onChange={(e) => setFormData({ ...formData, waktuSelesai: e.target.value })}
                required
              />
            </FormField>
          </div>

          <FormField label="Lokasi" required>
            <Input
              placeholder="Masukkan lokasi kegiatan"
              value={formData.lokasi}
              onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Deskripsi Kegiatan" required>
            <Textarea
              placeholder="Jelaskan detail kegiatan..."
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              rows={5}
              required
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Penanggung Jawab" required>
              <Input
                placeholder="Nama penanggung jawab"
                value={formData.penanggungJawab}
                onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
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
            <Link href="/kegiatan">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button type="submit">Buat Kegiatan</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
