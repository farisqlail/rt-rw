"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { FormField } from "@/components/form-field"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createData } from "@/lib/supabaseUtils"
import { hashPassword } from "@/lib/hashUtils"
import { v4 as uuidv4 } from "uuid" 

interface User {
  id?: string
  uuid?: string
  name: string
  email: string
  password: string
  role: string
  phone: string
  status: string
  created_at?: string
}

export default function TambahUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "pengurus",
    phone: "",
    status: "aktif",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Password dan konfirmasi password tidak sama!")
      return
    }

    setLoading(true)

    try {
      const hashedPassword = await hashPassword(formData.password)
      const generatedUUID = uuidv4()

      const newUser: Partial<User> = {
        uuid: generatedUUID, 
        name: formData.name,
        email: formData.email,
        password: hashedPassword,
        role: formData.role,
        phone: formData.phone,
        status: formData.status,
        created_at: new Date().toISOString(),
      }

      const result = await createData<User>("rtrw_users", newUser)

      if (result) {
        alert("User berhasil disimpan!")
        router.push("/dashboard/users")
      } else {
        alert("Gagal menyimpan user, periksa console untuk detail error.")
      }
    } catch (error) {
      console.error("Error handleSubmit:", error)
      alert("Terjadi kesalahan saat menyimpan user.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tambah User Baru"
        description="Buat akun pengguna baru untuk sistem"
        action={
          <Link href="/dashboard/users">
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
                id="nama"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <FormField
                label="Email"
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />

              <FormField
                label="Password"
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />

              <FormField
                label="Konfirmasi Password"
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
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
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="nonaktif">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/dashboard/users">
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
