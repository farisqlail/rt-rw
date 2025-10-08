"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Filter, AlertCircle } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { Pengumuman } from "@/lib/types"

const mockData: Pengumuman[] = [
  {
    id: "1",
    judul: "Jadwal Kerja Bakti Minggu Ini",
    konten:
      "Dihimbau kepada seluruh warga untuk mengikuti kerja bakti pada hari Minggu, 28 Januari 2024 pukul 07.00 WIB. Mohon kehadiran dan partisipasinya.",
    tanggal: "2024-01-25",
    penulis: "Ketua RT",
    prioritas: "tinggi",
    status: "published",
  },
  {
    id: "2",
    judul: "Pembayaran Iuran Bulan Februari",
    konten: "Pengingat untuk pembayaran iuran bulanan bulan Februari 2024. Dapat dibayarkan melalui bendahara RT.",
    tanggal: "2024-01-20",
    penulis: "Bendahara RT",
    prioritas: "sedang",
    status: "published",
  },
  {
    id: "3",
    judul: "Pemadaman Listrik Terjadwal",
    konten: "Akan ada pemadaman listrik terjadwal pada tanggal 30 Januari 2024 pukul 09.00-12.00 WIB.",
    tanggal: "2024-01-22",
    penulis: "Admin RT",
    prioritas: "tinggi",
    status: "published",
  },
]

export default function PengumumanPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div>
      <PageHeader
        title="Pengumuman & Informasi"
        description="Kelola pengumuman untuk warga"
        action={
          <Link href="/pengumuman/buat">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Buat Pengumuman
            </Button>
          </Link>
        }
      />

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pengumuman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="space-y-4">
        {mockData.map((item) => (
          <Link key={item.id} href={`/pengumuman/${item.id}`}>
            <Card className="p-6 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {item.prioritas === "tinggi" && <AlertCircle className="h-5 w-5 text-red-500" />}
                  <h3 className="text-lg font-semibold">{item.judul}</h3>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={
                      item.prioritas === "tinggi"
                        ? "destructive"
                        : item.prioritas === "sedang"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {item.prioritas}
                  </Badge>
                  <Badge variant={item.status === "published" ? "default" : "secondary"}>{item.status}</Badge>
                </div>
              </div>
              <p className="text-muted-foreground mb-3 line-clamp-2">{item.konten}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{item.penulis}</span>
                <span>•</span>
                <span>{item.tanggal}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
