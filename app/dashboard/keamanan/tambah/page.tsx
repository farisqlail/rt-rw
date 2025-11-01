"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createData } from "@/lib/supabaseUtils"
import type { Security } from "@/lib/types"

export default function TambahKeamananPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    date: "",
    descriptions: "",
    location: "",
    reporter: "",
    status: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        date: formData.date,
        descriptions: formData.descriptions,
        location: formData.location,
        reporter: formData.reporter,
        status: formData.status
      }

      const data = await createData<Security>("rtrw_securities", payload)
      
      if (data) {
        alert("Data keamanan berhasil ditambahkan!")
        router.push("/dashboard/keamanan")
      }
    } catch (error) {
      console.error("Error creating security data:", error)
      alert("Gagal menambahkan data keamanan!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Tambah Data Keamanan"
        description="Tambahkan data keamanan baru"
      />

      <Card>
        <CardHeader>
          <CardTitle>Form Data Keamanan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Masukkan lokasi kejadian"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reporter">Pelapor</Label>
                <Input
                  id="reporter"
                  value={formData.reporter}
                  onChange={(e) => handleInputChange("reporter", e.target.value)}
                  placeholder="Masukkan nama pelapor"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descriptions">Deskripsi</Label>
              <Textarea
                id="descriptions"
                value={formData.descriptions}
                onChange={(e) => handleInputChange("descriptions", e.target.value)}
                placeholder="Masukkan deskripsi kejadian keamanan"
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push("/dashboard/keamanan")}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}