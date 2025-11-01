"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { createData } from "@/lib/supabaseUtils"

export default function TambahWargaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nik: "",
    name: "",
    address: "",
    rt: "",
    rw: "",
    phone: "",
    status: "aktif",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const rtrw = `RT ${formData.rt}/RW ${formData.rw}`

    const payload = {
      nik: formData.nik,
      name: formData.name,
      address: formData.address,
      rtrw: rtrw,
      phone: formData.phone,
      status: formData.status,
      created_at: new Date().toISOString(),
    }

    const data = await createData("rtrw_residents", payload)

    setLoading(false)

    if (!data) {
      alert("Gagal menyimpan data warga. Periksa kembali input Anda.")
      return
    }

    alert("Data warga berhasil disimpan!")
    router.push("/dashboard/warga")
  }

  return (
    <div>
      <Link href="/dashboard/warga">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader
        title="Tambah Warga Baru"
        description="Lengkapi formulir di bawah untuk menambahkan warga baru"
      />

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
              label="RT"
              id="rt"
              value={formData.rt}
              onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
              placeholder="001"
              maxLength={3}
              required
            />

            <FormField
              label="RW"
              id="rw"
              value={formData.rw}
              onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
              placeholder="005"
              maxLength={3}
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
            <Link href="/dashboard/warga">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Data"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
