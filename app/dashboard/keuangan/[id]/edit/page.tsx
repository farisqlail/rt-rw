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

// Mock initial data
const initialData = {
  tanggal: "2024-01-15",
  jenis: "pemasukan",
  kategori: "Iuran Bulanan",
  jumlah: "5000000",
  keterangan: "Iuran warga bulan Januari 2024",
}

export default function EditKeuanganPage() {
  const router = useRouter()
  const [formData, setFormData] = useState(initialData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Transaction updated:", formData)
    // TODO: Implement API call
    router.push("/keuangan/1")
  }

  const kategoriPemasukan = ["Iuran Bulanan", "Iuran Keamanan", "Donasi", "Lain-lain"]
  const kategoriPengeluaran = ["Kebersihan", "Keamanan", "Pemeliharaan", "Administrasi", "Lain-lain"]

  return (
    <div>
      <Link href="/keuangan/1">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader title="Edit Transaksi" description="Perbarui informasi transaksi" />

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

            <FormField label="Jenis Transaksi" required>
              <Select value={formData.jenis} onValueChange={(value) => setFormData({ ...formData, jenis: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pemasukan">Pemasukan</SelectItem>
                  <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Kategori" required>
              <Select
                value={formData.kategori}
                onValueChange={(value) => setFormData({ ...formData, kategori: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(formData.jenis === "pemasukan" ? kategoriPemasukan : kategoriPengeluaran).map((kat) => (
                    <SelectItem key={kat} value={kat}>
                      {kat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Jumlah (Rp)" required>
              <Input
                type="number"
                value={formData.jumlah}
                onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                required
              />
            </FormField>
          </div>

          <FormField label="Keterangan" required>
            <Textarea
              value={formData.keterangan}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
              rows={3}
              required
            />
          </FormField>

          <FormField label="Bukti Transaksi">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">Upload foto bukti transaksi baru</p>
              <Input type="file" accept="image/*" className="max-w-xs mx-auto" />
            </div>
          </FormField>

          <div className="flex gap-3 justify-end">
            <Link href="/keuangan/1">
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
