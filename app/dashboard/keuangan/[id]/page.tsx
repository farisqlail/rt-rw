"use client"

import { ArrowLeft, Edit, Trash2, Download } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

// Mock data
const transaksiDetail = {
  id: "1",
  tanggal: "2024-01-15",
  jenis: "pemasukan",
  kategori: "Iuran Bulanan",
  jumlah: 5000000,
  keterangan: "Iuran warga bulan Januari 2024",
  bukti: "/paper-receipt.png",
  dicatatOleh: "Admin RT",
  waktuCatat: "2024-01-15 10:30",
}

export default function DetailKeuanganPage() {
  return (
    <div>
      <Link href="/keuangan">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader
        title="Detail Transaksi"
        description={`Transaksi #${transaksiDetail.id}`}
        action={
          <div className="flex gap-2">
            <Link href={`/keuangan/${transaksiDetail.id}/edit`}>
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
            <h2 className="text-lg font-semibold mb-4">Informasi Transaksi</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tanggal</p>
                <p className="font-medium">{transaksiDetail.tanggal}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jenis</p>
                <Badge variant={transaksiDetail.jenis === "pemasukan" ? "default" : "secondary"}>
                  {transaksiDetail.jenis === "pemasukan" ? "Pemasukan" : "Pengeluaran"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kategori</p>
                <p className="font-medium">{transaksiDetail.kategori}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jumlah</p>
                <p
                  className={`text-xl font-semibold ${transaksiDetail.jenis === "pemasukan" ? "text-green-600" : "text-red-600"}`}
                >
                  {transaksiDetail.jenis === "pemasukan" ? "+" : "-"} {formatRupiah(transaksiDetail.jumlah)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Keterangan</p>
                <p className="font-medium">{transaksiDetail.keterangan}</p>
              </div>
            </div>
          </Card>

          {transaksiDetail.bukti && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Bukti Transaksi</h2>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <img
                src={transaksiDetail.bukti || "/placeholder.svg"}
                alt="Bukti transaksi"
                className="w-full rounded-lg border border-border"
              />
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Informasi Pencatatan</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Dicatat Oleh</p>
                <p className="font-medium">{transaksiDetail.dicatatOleh}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Waktu Pencatatan</p>
                <p className="font-medium">{transaksiDetail.waktuCatat}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
