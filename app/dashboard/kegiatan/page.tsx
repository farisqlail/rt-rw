"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Filter, CalendarIcon } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { Kegiatan } from "@/lib/types"

const mockData: Kegiatan[] = [
  {
    id: "1",
    namaKegiatan: "Kerja Bakti Bulanan",
    tanggal: "2024-01-28",
    waktu: "07:00 - 10:00",
    lokasi: "Lingkungan RT 001",
    deskripsi: "Kerja bakti rutin bulanan untuk membersihkan lingkungan RT",
    penanggungJawab: "Ketua RT",
    status: "planned",
  },
  {
    id: "2",
    namaKegiatan: "Rapat Koordinasi RT/RW",
    tanggal: "2024-02-05",
    waktu: "19:00 - 21:00",
    lokasi: "Balai RT",
    deskripsi: "Rapat koordinasi bulanan pengurus RT/RW",
    penanggungJawab: "Sekretaris RT",
    status: "planned",
  },
  {
    id: "3",
    namaKegiatan: "Perayaan 17 Agustus",
    tanggal: "2024-08-17",
    waktu: "08:00 - 16:00",
    lokasi: "Lapangan RT",
    deskripsi: "Perayaan HUT RI dengan berbagai lomba",
    penanggungJawab: "Panitia 17 Agustus",
    status: "planned",
  },
]

export default function KegiatanPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div>
      <PageHeader
        title="Manajemen Kegiatan"
        description="Kelola kegiatan dan acara RT/RW"
        action={
          <Link href="/kegiatan/buat">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Buat Kegiatan
            </Button>
          </Link>
        }
      />

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kegiatan..."
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockData.map((item) => (
          <Link key={item.id} href={`/kegiatan/${item.id}`}>
            <Card className="p-6 hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold line-clamp-2">{item.namaKegiatan}</h3>
                <Badge
                  variant={
                    item.status === "completed"
                      ? "default"
                      : item.status === "ongoing"
                        ? "default"
                        : item.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                  }
                >
                  {item.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{item.tanggal}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Waktu:</span>
                  <span>{item.waktu}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Lokasi:</span>
                  <span>{item.lokasi}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.deskripsi}</p>

              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">Penanggung Jawab</p>
                <p className="text-sm font-medium">{item.penanggungJawab}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
