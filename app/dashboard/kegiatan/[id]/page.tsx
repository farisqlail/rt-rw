"use client"

import { ArrowLeft, Edit, Trash2, Users, MapPin, Clock, CalendarIcon } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data
const kegiatanDetail = {
  id: "1",
  namaKegiatan: "Kerja Bakti Bulanan",
  tanggal: "2024-01-28",
  waktu: "07:00 - 10:00",
  lokasi: "Lingkungan RT 001",
  deskripsi:
    "Kerja bakti rutin bulanan untuk membersihkan lingkungan RT. Kegiatan meliputi pembersihan selokan, pengecatan pos ronda, dan penataan taman. Diharapkan seluruh warga dapat berpartisipasi.",
  penanggungJawab: "Ketua RT",
  status: "planned",
  peserta: 45,
  targetPeserta: 60,
}

export default function DetailKegiatanPage() {
  return (
    <div>
      <Link href="/kegiatan">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader
        title={kegiatanDetail.namaKegiatan}
        action={
          <div className="flex gap-2">
            <Link href={`/kegiatan/${kegiatanDetail.id}/edit`}>
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
            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant={
                  kegiatanDetail.status === "completed"
                    ? "default"
                    : kegiatanDetail.status === "ongoing"
                      ? "default"
                      : kegiatanDetail.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                }
              >
                {kegiatanDetail.status}
              </Badge>
            </div>

            <h2 className="text-lg font-semibold mb-3">Deskripsi Kegiatan</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{kegiatanDetail.deskripsi}</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Detail Kegiatan</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal</p>
                  <p className="font-medium">{kegiatanDetail.tanggal}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Waktu</p>
                  <p className="font-medium">{kegiatanDetail.waktu}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Lokasi</p>
                  <p className="font-medium">{kegiatanDetail.lokasi}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Penanggung Jawab</p>
                  <p className="font-medium">{kegiatanDetail.penanggungJawab}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Partisipasi</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Peserta Terdaftar</span>
                  <span className="font-medium">
                    {kegiatanDetail.peserta} / {kegiatanDetail.targetPeserta}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(kegiatanDetail.peserta / kegiatanDetail.targetPeserta) * 100}%` }}
                  />
                </div>
              </div>
              <Button className="w-full mt-4">Lihat Daftar Peserta</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Aksi Cepat</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Kirim Pengingat
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Unduh Laporan
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Bagikan Kegiatan
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
