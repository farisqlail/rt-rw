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

export default function BuatSuratPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    jenisSurat: "",
    pemohon: "",
    nik: "",
    alamat: "",
    keperluan: "",
    keterangan: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Surat created:", formData)
    // TODO: Implement API call
    router.push("/surat")
  }

  return (
    <div>
      <Link href="/surat">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader title="Buat Surat Baru" description="Lengkapi formulir untuk membuat surat" />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Jenis Surat" required>
            <Select
              value={formData.jenisSurat}
              onValueChange={(value) => setFormData({ ...formData, jenisSurat: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis surat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="domisili">Surat Keterangan Domisili</SelectItem>
                <SelectItem value="pengantar-ktp">Surat Pengantar KTP</SelectItem>
                <SelectItem value="tidak-mampu">Surat Keterangan Tidak Mampu</SelectItem>
                <SelectItem value="usaha">Surat Keterangan Usaha</SelectItem>
                <SelectItem value="pengantar-nikah">Surat Pengantar Nikah</SelectItem>
                <SelectItem value="kelahiran">Surat Keterangan Kelahiran</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Nama Pemohon" required>
              <Input
                placeholder="Masukkan nama pemohon"
                value={formData.pemohon}
                onChange={(e) => setFormData({ ...formData, pemohon: e.target.value })}
                required
              />
            </FormField>

            <FormField label="NIK Pemohon" required>
              <Input
                placeholder="Masukkan NIK (16 digit)"
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                maxLength={16}
                required
              />
            </FormField>
          </div>

          <FormField label="Alamat Pemohon" required>
            <Textarea
              placeholder="Masukkan alamat lengkap"
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              rows={3}
              required
            />
          </FormField>

          <FormField label="Keperluan" required>
            <Input
              placeholder="Contoh: Untuk keperluan administrasi bank"
              value={formData.keperluan}
              onChange={(e) => setFormData({ ...formData, keperluan: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Keterangan Tambahan">
            <Textarea
              placeholder="Keterangan tambahan (opsional)"
              value={formData.keterangan}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
              rows={3}
            />
          </FormField>

          <div className="flex gap-3 justify-end">
            <Link href="/surat">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button type="submit">Buat Surat</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
