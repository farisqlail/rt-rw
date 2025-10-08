"use client"

import { ArrowLeft, Edit, Trash2, Share2 } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data
const pengumumanDetail = {
  id: "1",
  judul: "Jadwal Kerja Bakti Minggu Ini",
  konten:
    "Dihimbau kepada seluruh warga untuk mengikuti kerja bakti pada hari Minggu, 28 Januari 2024 pukul 07.00 WIB.\n\nKegiatan meliputi:\n- Pembersihan selokan\n- Pengecatan pos ronda\n- Penataan taman\n\nMohon kehadiran dan partisipasinya. Terima kasih.",
  tanggal: "2024-01-25",
  penulis: "Ketua RT",
  prioritas: "tinggi",
  status: "published",
  views: 125,
}

export default function DetailPengumumanPage() {
  return (
    <div>
      <Link href="/pengumuman">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader
        title={pengumumanDetail.judul}
        action={
          <div className="flex gap-2">
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Bagikan
            </Button>
            <Link href={`/pengumuman/${pengumumanDetail.id}/edit`}>
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
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant={
                  pengumumanDetail.prioritas === "tinggi"
                    ? "destructive"
                    : pengumumanDetail.prioritas === "sedang"
                      ? "default"
                      : "secondary"
                }
              >
                {pengumumanDetail.prioritas}
              </Badge>
              <Badge variant={pengumumanDetail.status === "published" ? "default" : "secondary"}>
                {pengumumanDetail.status}
              </Badge>
            </div>

            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-foreground">{pengumumanDetail.konten}</p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Informasi</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Penulis</p>
                <p className="font-medium">{pengumumanDetail.penulis}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Publikasi</p>
                <p className="font-medium">{pengumumanDetail.tanggal}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dilihat</p>
                <p className="font-medium">{pengumumanDetail.views} kali</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
