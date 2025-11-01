"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { createData } from "@/lib/supabaseUtils"
import type { MailManagement } from "@/lib/types"

const mailCategories = [
  "Surat Keterangan Domisili",
  "Surat Pengantar KTP",
  "Surat Keterangan Tidak Mampu",
  "Surat Keterangan Usaha",
  "Surat Pengantar Nikah",
  "Surat Keterangan Kelahiran",
  "Surat Keterangan Pindah",
  "Surat Keterangan Kelakuan Baik",
]

const statusOptions = [
  "pending",
  "diproses",
  "selesai",
  "ditolak",
]

export default function TambahSuratPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    mail_number: "",
    mail_category: "",
    applicant: "",
    status: "pending",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      const mailData: Omit<MailManagement, 'id' | 'created_at' | 'uuid'> = {
        mail_number: formData.mail_number,
        mail_category: formData.mail_category,
        applicant: formData.applicant,
        status: formData.status,
      }

      const result = await createData("rtrw_mail_managements", mailData)
      
      if (result) {
        router.push("/dashboard/surat")
      } else {
        alert("Gagal menambahkan surat. Silakan coba lagi.")
      }
    } catch (error) {
      console.error("Error adding mail:", error)
      alert("Terjadi kesalahan saat menambahkan surat.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link href="/dashboard/surat">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader title="Tambah Surat Baru" description="Lengkapi formulir untuk menambahkan surat baru" />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Nomor Surat" required>
            <Input
              value={formData.mail_number}
              onChange={(e) => setFormData({ ...formData, mail_number: e.target.value })}
              placeholder="Masukkan nomor surat"
              required
            />
          </FormField>

          <FormField label="Kategori Surat" required>
            <Select
              value={formData.mail_category}
              onValueChange={(value) => setFormData({ ...formData, mail_category: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori surat" />
              </SelectTrigger>
              <SelectContent>
                {mailCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Nama Pemohon" required>
            <Input
              value={formData.applicant}
              onChange={(e) => setFormData({ ...formData, applicant: e.target.value })}
              placeholder="Masukkan nama pemohon"
              required
            />
          </FormField>

          <FormField label="Status" required>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {loading ? "Menyimpan..." : "Simpan Surat"}
            </Button>
            <Link href="/dashboard/surat">
              <Button type="button" variant="outline" disabled={loading}>
                Batal
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}