"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDataById, updateData } from "@/lib/supabaseUtils"
import type { Security } from "@/lib/types"

export default function EditKeamananPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    date: "",
    descriptions: "",
    location: "",
    reporter: "",
    status: ""
  })

  useEffect(() => {
    if (params.id) {
      fetchSecurityData()
    }
  }, [params.id])

  const fetchSecurityData = async () => {
    try {
      const data = await getDataById<Security>("rtrw_securities", Number(params.id))
      if (data) {
        setFormData({
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : "",
          descriptions: data.descriptions || "",
          location: data.location || "",
          reporter: data.reporter || "",
          status: data.status || ""
        })
      }
    } catch (error) {
      console.error("Error fetching security data:", error)
      alert("Gagal memuat data keamanan!")
    } finally {
      setInitialLoading(false)
    }
  }

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

      const data = await updateData<Security>("rtrw_securities", Number(params.id), payload)
      
      if (data) {
        alert("Data keamanan berhasil diperbarui!")
        router.push("/dashboard/keamanan")
      }
    } catch (error) {
      console.error("Error updating security data:", error)
      alert("Gagal memperbarui data keamanan!")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div>
        <PageHeader
          title="Edit Data Keamanan"
          description="Memuat data..."
        />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Edit Data Keamanan"
        description="Perbarui data keamanan"
      />

      <Card>
        <CardHeader>
          <CardTitle>Form Edit Data Keamanan</CardTitle>
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
                {loading ? "Menyimpan..." : "Perbarui"}
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