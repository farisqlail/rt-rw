"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { getData, updateData } from "@/lib/supabaseUtils"
import type { Resident } from "@/lib/types"

export default function EditWargaPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [originalData, setOriginalData] = useState<Resident | null>(null)
  const [formData, setFormData] = useState({
    nik: "",
    name: "",
    address: "",
    rtrw: "",
    phone: "",
    status: "aktif",
  })

  useEffect(() => {
    const fetchResident = async () => {
      try {
        const data = await getData("rtrw_residents", { id: params.id })
        if (data && data.length > 0) {
          const resident = data[0] as Resident
          setOriginalData(resident)
          setFormData({
            nik: resident.nik,
            name: resident.name,
            address: resident.address,
            rtrw: resident.rtrw,
            phone: resident.phone.toString(),
            status: resident.status,
          })
        }
      } catch (error) {
        console.error("Error fetching resident:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResident()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!originalData) return

    setSaving(true)

    const updatedData = {
      nik: formData.nik,
      name: formData.name,
      address: formData.address,
      rtrw: formData.rtrw,
      phone: formData.phone,
      status: formData.status,
    }

    try {
      const result = await updateData("rtrw_residents", originalData.id, updatedData)
      
      if (result) {
        alert("Data warga berhasil diperbarui!")
        router.push(`/dashboard/warga/${originalData.id}`)
      } else {
        alert("Gagal memperbarui data warga. Periksa kembali input Anda.")
      }
    } catch (error) {
      console.error("Error updating resident:", error)
      alert("Terjadi kesalahan saat memperbarui data.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!originalData) {
    return <div>Data warga tidak ditemukan.</div>
  }

  return (
    <div>
      <Link href={`/dashboard/warga/${originalData.id}`}>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader title="Edit Data Warga" description="Perbarui informasi warga" />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="NIK"
              id="nik"
              value={formData.nik}
              onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
              placeholder="Masukkan NIK (16 digit)"
              maxLength={16}
              required
            />

            <FormField
              label="Nama Lengkap"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masukkan nama lengkap"
              required
            />

            <FormField
              label="RT/RW"
              id="rtrw"
              value={formData.rtrw}
              onChange={(e) => setFormData({ ...formData, rtrw: e.target.value })}
              placeholder="RT 001/RW 005"
              required
            />

            <FormField
              label="Nomor Telepon"
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="08123456789"
              required
            />

            <div>
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="pindah">Pindah</SelectItem>
                  <SelectItem value="meninggal">Meninggal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label htmlFor="address" className="text-sm font-medium">
              Alamat Lengkap
            </label>
            <Textarea
              id="address"
              placeholder="Masukkan alamat lengkap"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="mt-2"
              required
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Link href={`/dashboard/warga/${originalData.id}`}>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
