"use client"

import { ArrowLeft, Edit, Trash2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data
const laporanDetail = {
  id: "1",
  tanggal: "2024-01-25",
  jenis: "kejadian",
  deskripsi:
    "Terjadi pencurian sepeda motor di area parkir. Motor hilang pada malam hari sekitar pukul 02.00 WIB. Sudah dilaporkan ke pihak kepolisian.",
  lokasi: "Jl. Merdeka No. 15",
  pelapor: "Budi Santoso",
  status: "in-progress",
  tindakLanjut: "Koordinasi dengan kepolisian dan pemasangan CCTV tambahan",
}

export default function DetailKeamananPage() {
  return (
    <div>
      <Link href="/keamanan">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader
        title="Detail Laporan Keamanan"
        description={`Laporan #${laporanDetail.id}`}
        action={
          <div className="flex gap-2">
            {laporanDetail.status !== "resolved" && (
              <Button>
                <CheckCircle className="h-4 w-4 mr-2" />
                Tandai Selesai
              </Button>
            )}
            <Link href={`/keamanan/${laporanDetail.id}/edit`}>
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
                  laporanDetail.jenis === "kejadian"
                    ? "destructive"
                    : laporanDetail.jenis === "patroli"
                      ? "default"
                      : "secondary"
                }
              >
                {laporanDetail.jenis}
              </Badge>
              <Badge
                variant={
                  laporanDetail.status === "resolved"
                    ? "default"
                    : laporanDetail.status === "in-progress"
                      ? "secondary"
                      : "secondary"
                }
              >
                {laporanDetail.status}
              </Badge>
            </div>

            <h2 className="text-lg font-semibold mb-3">Deskripsi Laporan</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{laporanDetail.deskripsi}</p>

            {laporanDetail.tindakLanjut && (
              <div className="mt-6 pt-6 border-t border-border">
                <h2 className="text-lg font-semibold mb-3">Tindak Lanjut</h2>
                <p className="text-muted-foreground">{laporanDetail.tindakLanjut}</p>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Informasi</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Tanggal</p>
                <p className="font-medium">{laporanDetail.tanggal}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lokasi</p>
                <p className="font-medium">{laporanDetail.lokasi}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pelapor</p>
                <p className="font-medium">{laporanDetail.pelapor}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
