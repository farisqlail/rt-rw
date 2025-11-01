"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Pencil, Trash2, Mail, Phone, Calendar, Clock } from "lucide-react"
import { getData } from "@/lib/supabaseUtils"
import { formatDateTime } from "@/lib/dateUtils"

export interface User {
  id: string
  name: string
  email: string
  role: "super-admin" | "admin" | "pengurus"
  phone?: string
  status: "aktif" | "nonaktif"
  created_at: string
  terakhirLogin?: string
}

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      setLoading(true);
      const result = await getData<User>("rtrw_users", { id });
      if (result && result.length > 0) {
        setUser(result[0]);
      } else {
        alert("Data user tidak ditemukan.");
        router.push("/users");
      }
      setLoading(false);
    };
    fetchUser();
  }, [id, router]);

  const getRoleBadge = (role: User["role"]) => {
    const variants = {
      "super-admin": "destructive",
      admin: "default",
      pengurus: "secondary",
    } as const;

    const labels = {
      "super-admin": "Super Admin",
      admin: "Admin",
      pengurus: "Pengurus",
    };

    return <Badge variant={variants[role]}>{labels[role]}</Badge>;
  };

  if (loading) {
    return <p className="text-center py-10 text-muted-foreground">Memuat data...</p>;
  }

  if (!user) {
    return <p className="text-center py-10 text-red-500">User tidak ditemukan.</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detail User"
        description="Informasi lengkap pengguna sistem"
        action={
          <div className="flex gap-2">
            <Link href="/dashboard/users">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <Link href={`/dashboard/users/${user.id}/edit`}>
              <Button>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informasi User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Nama Lengkap</p>
                <p className="font-medium">{user.name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Role</p>
                <div>{getRoleBadge(user.role)}</div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </p>
                <p className="font-medium">{user.email}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telepon
                </p>
                <p className="font-medium">{user.phone || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Tanggal Dibuat
                </p>
                <p className="font-medium">{formatDateTime(user.created_at)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Terakhir Login
                </p>
                <p className="font-medium">{user.terakhirLogin || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant={user.status === "aktif" ? "default" : "secondary"}>
                  {user.status === "aktif" ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
