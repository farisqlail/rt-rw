"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { getData, updateData } from "@/lib/supabaseUtils"
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

export default function EditSuratPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [formData, setFormData] = useState({
    mail_number: "",
    mail_category: "",
    applicant: "",
    status: "",
  })
  const [originalData, setOriginalData] = useState<MailManagement | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchMailData()
    }
  }, [params.id])

  const fetchMailData = async () => {
    try {
      setFetchLoading(true)
      const data = await getData<MailManagement>("rtrw_mail_managements", { id: params.id })
      
      if (data && data.length > 0) {
        const mailData = data[0]
        setOriginalData(mailData)
        setFormData({
          mail_number: mailData.mail_number,
          mail_category: mailData.mail_category,
          applicant: mailData.applicant,
          status: mailData.status,
        })
      } else {
        alert("Data surat tidak ditemukan")
        router.push("/dashboard/surat")
      }
    } catch (error) {
      console.error("Error fetching mail data:", error)
      alert("Gagal memuat data surat")
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!originalData) return

    try {
      setLoading(true)
      
      const updatedData = {
        mail_number: formData.mail_number,
        mail_category: formData.mail_category,
        applicant: formData.applicant,
        status: formData.status,
      }

      const result = await updateData("rtrw_mail_managements", originalData.id, updatedData)
      
      if (result) {
        router.push("/dashboard/surat")
      } else {
        alert("Gagal mengupdate surat. Silakan coba lagi.")
      }
    } catch (error) {
      console.error("Error updating mail:", error)
      alert("Terjadi kesalahan saat mengupdate surat.")
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Memuat data surat...</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Link href="/dashboard/surat">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader title="Edit Surat" description="Ubah informasi surat yang sudah ada" />

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
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
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