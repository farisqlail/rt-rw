"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { createData } from "@/lib/supabaseUtils"
import { Keuangan } from "@/lib/types"

export default function TambahKeuanganPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    finance_category: "pemasukan" as "pemasukan" | "pengeluaran",
    category: "",
    amount: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const financeData = {
        ...formData,
        amount: parseFloat(formData.amount),
        uuid: crypto.randomUUID(),
        created_at: new Date().toISOString()
      }
      
      await createData("rtrw_finances", financeData)
      router.push("/dashboard/keuangan")
    } catch (error) {
      console.error("Error creating finance:", error)
      alert("Gagal membuat transaksi. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  const kategoriPemasukan = ["Iuran Bulanan", "Iuran Keamanan", "Donasi", "Lain-lain"]
  const kategoriPengeluaran = ["Kebersihan", "Keamanan", "Pemeliharaan", "Administrasi", "Lain-lain"]

  return (
    <div>
      <Link href="/dashboard/keuangan">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader title="Tambah Transaksi" description="Catat pemasukan atau pengeluaran baru" />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Jenis Transaksi" required>
              <Select value={formData.finance_category} onValueChange={(value: "pemasukan" | "pengeluaran") => setFormData({ ...formData, finance_category: value })}>
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
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {(formData.finance_category === "pemasukan" ? kategoriPemasukan : kategoriPengeluaran).map((kat) => (
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
                placeholder="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </FormField>
          </div>

          <FormField label="Keterangan" required>
            <Textarea
              placeholder="Masukkan keterangan transaksi"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </FormField>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Transaksi"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              Batal
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
