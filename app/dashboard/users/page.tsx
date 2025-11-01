"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react"
import { getData } from "@/lib/supabaseUtils"
import { Skeleton } from "@/components/ui/skeleton"

export interface User {
  id: string
  uuid?: string
  name: string
  email: string
  password?: string
  role: "super-admin" | "admin" | "pengurus"
  phone: string
  status: "aktif" | "nonaktif"
  created_at?: string
  last_login?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const data = await getData<User>("rtrw_users")
        if (data) setUsers(data)
      } catch (error) {
        console.error("Gagal memuat data users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRoleBadge = (role: User["role"]) => {
    const variants = {
      "super-admin": "destructive",
      admin: "default",
      pengurus: "secondary",
    } as const

    const labels = {
      "super-admin": "Super Admin",
      admin: "Admin",
      pengurus: "Pengurus",
    }

    return <Badge variant={variants[role]}>{labels[role]}</Badge>
  }

  const getStatusBadge = (status: User["status"]) => {
    return (
      <Badge variant={status === "aktif" ? "default" : "secondary"}>
        {status === "aktif" ? "Aktif" : "Nonaktif"}
      </Badge>
    )
  }

  const columns = [
    { header: "Nama", accessor: "name" as keyof User },
    { header: "Email", accessor: "email" as keyof User },
    {
      header: "Role",
      accessor: (row: User) => getRoleBadge(row.role),
    },
    { header: "Telepon", accessor: "phone" as keyof User },
    {
      header: "Status",
      accessor: (row: User) => getStatusBadge(row.status),
    },
    {
      header: "Aksi",
      accessor: (row: User) => (
        <div className="flex items-center gap-2">
          <Link href={`/users/${row.id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/users/${row.id}/edit`}>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  const actions = (user: User) => (
    <div className="flex items-center gap-2">
      <Link href={`/users/${user.id}`}>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={`/users/${user.id}/edit`}>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>
      <Button variant="ghost" size="icon">
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen User"
        description="Kelola akses dan hak pengguna sistem"
        action={
          <Link href="/users/tambah">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah User
            </Button>
          </Link>
        }
      />

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-10" />
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={filteredUsers} />
      )}
    </div>
  )
}
