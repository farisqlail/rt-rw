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

// Mock data - in real app, fetch based on params.id
const initialData = {
  nik: "3201012345678901",
  nama: "Budi Santoso",
  alamat: "Jl. Merdeka No. 12",
  rt: "001",
  rw: "005",
  telepon: "081234567890",
  email: "budi@email.com",
  status: "aktif",
}

export default function EditWargaPage() {
  const router = useRouter()
  const [formData, setFormData] = useState(initialData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form updated:", formData)
    // TODO: Implement API call
    router.push("/warga/1")
  }

  return (
    <div>
      <Link href="/warga/1">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader title="Edit Data Warga" description="Perbarui informasi warga" />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="NIK" required>
              <Input
                placeholder="Masukkan NIK (16 digit)"
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                maxLength={16}
                required
              />
            </FormField>

            <FormField label="Nama Lengkap" required>
              <Input
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                required
              />
            </FormField>

            <FormField label="RT" required>
              <Input
                placeholder="001"
                value={formData.rt}
                onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                maxLength={3}
                required
              />
            </FormField>

            <FormField label="RW" required>
              <Input
                placeholder="005"
                value={formData.rw}
                onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                maxLength={3}
                required
              />
            </FormField>

            <FormField label="Nomor Telepon" required>
              <Input
                type="tel"
                placeholder="08123456789"
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Email">
              <Input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </FormField>

            <FormField label="Status" required>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="pindah">Pindah</SelectItem>
                  <SelectItem value="meninggal">Meninggal</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField label="Alamat Lengkap" required>
            <Textarea
              placeholder="Masukkan alamat lengkap"
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              rows={3}
              required
            />
          </FormField>

          <div className="flex gap-3 justify-end">
            <Link href="/warga/1">
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
