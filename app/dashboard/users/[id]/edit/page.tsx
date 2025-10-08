"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { FormField } from "@/components/form-field"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { getData, updateData } from "@/lib/supabaseUtils"

interface UserForm {
  name: string
  email: string
  role: "super-admin" | "admin" | "pengurus"
  phone: string
  status: "aktif" | "nonaktif"
  newPassword: string
  confirmPassword: string
}

export default function EditUserPage() {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<UserForm>({
    name: "",
    email: "",
    role: "admin",
    phone: "",
    status: "aktif",
    newPassword: "",
    confirmPassword: "",
  })

  // Ambil data user berdasarkan ID
  useEffect(() => {
    if (!id) return
    const fetchUser = async () => {
      setLoading(true)
      const result = await getData<UserForm>("rtrw_users", { id })
      if (result && result.length > 0) {
        const data = result[0]
        setFormData({
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone,
          status: data.status,
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        alert("Data user tidak ditemukan.")
        router.push("/users")
      }
      setLoading(false)
    }
    fetchUser()
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Validasi password
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert("Konfirmasi password tidak cocok.")
      setSaving(false)
      return
    }

    // Siapkan payload (jangan kirim password kosong)
    const payload: Partial<UserForm> = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone,
      status: formData.status,
      ...(formData.newPassword ? { password: formData.newPassword } : {}),
    }

    const result = await updateData<UserForm>("rtrw_users", String(id), payload)

    if (result) {
      alert("Data berhasil diperbarui.")
      router.push(`/users/${id}`)
    } else {
      alert("Gagal memperbarui data.")
    }

    setSaving(false)
  }

  if (loading) return <p className="text-center py-10 text-muted-foreground">Memuat data...</p>

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit User"
        description="Perbarui informasi pengguna sistem"
        action={
          <Link href={`/users/${id}`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Nama Lengkap"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <FormField
                label="Email"
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as UserForm["role"] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="pengurus">Pengurus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <FormField
                label="Nomor Telepon"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as UserForm["status"] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="nonaktif">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Ubah Password (Opsional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Password Baru"
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
                <FormField
                  label="Konfirmasi Password Baru"
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href={`/users/${id}`}>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
