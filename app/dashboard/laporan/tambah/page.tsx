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
import { createData } from "@/lib/supabaseUtils"
import { v4 as uuidv4 } from "uuid"

export default function TambahLaporanPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "open",
  })

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
      // Prepare data for database
      const laporanData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        created_at: new Date().toISOString(),
        uuid: uuidv4(),
      }

      // Create laporan using supabase utils
      const result = await createData("rtrw_informations", laporanData)
      
      if (result) {
        // Redirect to laporan list on success
        router.push("/dashboard/laporan")
      } else {
        alert("Gagal menyimpan laporan. Silakan coba lagi.")
      }
    } catch (error) {
      console.error("Error creating laporan:", error)
      alert("Terjadi kesalahan saat menyimpan laporan.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Tambah Laporan Baru"
        description="Buat laporan atau keluhan baru"
        action={
          <Link href="/dashboard/laporan">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
        }
      />

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              rows={5}
              required
            />
          </FormField>

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

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan Laporan"}
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
  )
}