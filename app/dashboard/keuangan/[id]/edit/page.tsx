"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { getData, updateData } from "@/lib/supabaseUtils"
import { Keuangan } from "@/lib/types"

export default function EditKeuanganPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [formData, setFormData] = useState({
    finance_category: "pemasukan" as "pemasukan" | "pengeluaran",
    category: "",
    amount: "",
    description: "",
  })
  const [originalData, setOriginalData] = useState<Keuangan | null>(null)

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setFetchLoading(true)
        const data = await getData("rtrw_finances", { id: params.id })
        if (data && data.length > 0) {
          const finance = data[0] as Keuangan
          setOriginalData(finance)
          setFormData({
            finance_category: finance.finance_category,
            category: finance.category,
            amount: finance.amount.toString(),
            description: finance.description,
          })
        }
      } catch (error) {
        console.error("Error fetching finance data:", error)
        alert("Gagal memuat data transaksi")
      } finally {
        setFetchLoading(false)
      }
    }

    if (params.id) {
      fetchFinanceData()
    }
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const financeData = {
        ...formData,
        amount: parseFloat(formData.amount),
      }
      
      await updateData("rtrw_finances", params.id as string, financeData)
      router.push("/dashboard/keuangan")
    } catch (error) {
      console.error("Error updating finance:", error)
      alert("Gagal memperbarui transaksi. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  const kategoriPemasukan = ["Iuran Bulanan", "Iuran Keamanan", "Donasi", "Lain-lain"]
  const kategoriPengeluaran = ["Kebersihan", "Keamanan", "Pemeliharaan", "Administrasi", "Lain-lain"]

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data transaksi...</span>
      </div>
    )
  }

  return (
    <div>
      <Link href="/dashboard/keuangan">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader title="Edit Transaksi" description="Perbarui informasi transaksi" />

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
                  <SelectValue />
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
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </FormField>
          </div>

          <FormField label="Keterangan" required>
            <Textarea
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
                "Simpan Perubahan"
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
