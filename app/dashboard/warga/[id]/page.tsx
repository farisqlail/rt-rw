"use client"

import { ArrowLeft, Edit, Trash2, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data - in real app, fetch based on params.id
const wargaDetail = {
  id: "1",
  nik: "3201012345678901",
  nama: "Budi Santoso",
  alamat: "Jl. Merdeka No. 12",
  rt: "001",
  rw: "005",
  telepon: "081234567890",
  email: "budi@email.com",
  status: "aktif",
  tanggalDaftar: "2024-01-15",
  tempatLahir: "Jakarta",
  tanggalLahir: "1985-05-20",
  jenisKelamin: "Laki-laki",
  pekerjaan: "Wiraswasta",
  statusPerkawinan: "Menikah",
}

export default function DetailWargaPage() {
  return (
    <div>
      <Link href="/warga">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader
        title={wargaDetail.nama}
        description={`NIK: ${wargaDetail.nik}`}
        action={
          <div className="flex gap-2">
            <Link href={`/warga/${wargaDetail.id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" className="text-destructive bg-transparent">
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Informasi Pribadi</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                <p className="font-medium">{wargaDetail.nama}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">NIK</p>
                <p className="font-medium">{wargaDetail.nik}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tempat, Tanggal Lahir</p>
                <p className="font-medium">
                  {wargaDetail.tempatLahir}, {wargaDetail.tanggalLahir}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
                <p className="font-medium">{wargaDetail.jenisKelamin}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pekerjaan</p>
                <p className="font-medium">{wargaDetail.pekerjaan}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status Perkawinan</p>
                <p className="font-medium">{wargaDetail.statusPerkawinan}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Informasi Alamat</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Alamat Lengkap</p>
                <p className="font-medium">{wargaDetail.alamat}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">RT</p>
                <p className="font-medium">{wargaDetail.rt}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">RW</p>
                <p className="font-medium">{wargaDetail.rw}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Status</h2>
            <Badge variant={wargaDetail.status === "aktif" ? "default" : "secondary"} className="text-sm">
              {wargaDetail.status.toUpperCase()}
            </Badge>
            <p className="text-sm text-muted-foreground mt-4">Tanggal Daftar</p>
            <p className="font-medium">{wargaDetail.tanggalDaftar}</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Kontak</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telepon</p>
                  <p className="font-medium">{wargaDetail.telepon}</p>
                </div>
              </div>
              {wargaDetail.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{wargaDetail.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Lokasi</p>
                  <p className="font-medium">
                    RT {wargaDetail.rt} / RW {wargaDetail.rw}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
