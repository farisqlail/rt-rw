"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

export default function BuatLaporanKeamananPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    jenis: "kejadian",
    deskripsi: "",
    lokasi: "",
    pelapor: "",
    status: "open",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Security report created:", formData)
    // TODO: Implement API call
    router.push("/keamanan")
  }

  return (
    <div>
      <Link href="/keamanan">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader title="Buat Laporan Keamanan" description="Catat laporan keamanan atau sosial" />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Tanggal" required>
              <Input
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Jenis Laporan" required>
              <Select value={formData.jenis} onValueChange={(value) => setFormData({ ...formData, jenis: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kejadian">Kejadian</SelectItem>
                  <SelectItem value="patroli">Patroli</SelectItem>
                  <SelectItem value="keluhan">Keluhan</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Lokasi" required>
              <Input
                placeholder="Masukkan lokasi kejadian"
                value={formData.lokasi}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Pelapor" required>
              <Input
                placeholder="Nama pelapor"
                value={formData.pelapor}
                onChange={(e) => setFormData({ ...formData, pelapor: e.target.value })}
                required
              />
            </FormField>
          </div>

          <FormField label="Deskripsi Laporan" required>
            <Textarea
              placeholder="Jelaskan detail laporan..."
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              rows={5}
              required
            />
          </FormField>

          <FormField label="Bukti / Foto">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">Upload foto bukti (opsional)</p>
              <Input type="file" accept="image/*" className="max-w-xs mx-auto" />
            </div>
          </FormField>

          <div className="flex gap-3 justify-end">
            <Link href="/keamanan">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button type="submit">Simpan Laporan</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
