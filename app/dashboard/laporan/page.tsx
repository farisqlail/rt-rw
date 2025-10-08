"use client"

import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Users, FileText, Wallet, Calendar, TrendingUp, TrendingDown } from "lucide-react"

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function LaporanPage() {
  // Mock data
  const stats = {
    totalWarga: 245,
    wargaAktif: 230,
    totalSurat: 156,
    suratBulanIni: 12,
    totalPemasukan: 45000000,
    totalPengeluaran: 32000000,
    saldo: 13000000,
    kegiatanBulanIni: 8,
  }

  const keuanganBulanan = [
    { bulan: "Jan", pemasukan: 5000000, pengeluaran: 3500000 },
    { bulan: "Feb", pemasukan: 5200000, pengeluaran: 3800000 },
    { bulan: "Mar", pemasukan: 4800000, pengeluaran: 3200000 },
    { bulan: "Apr", pemasukan: 5500000, pengeluaran: 4000000 },
    { bulan: "Mei", pemasukan: 5300000, pengeluaran: 3600000 },
    { bulan: "Jun", pemasukan: 5100000, pengeluaran: 3900000 },
  ]

  const suratTerbanyak = [
    { jenis: "Surat Keterangan Domisili", jumlah: 45 },
    { jenis: "Surat Pengantar KTP", jumlah: 38 },
    { jenis: "Surat Keterangan Tidak Mampu", jumlah: 28 },
    { jenis: "Surat Keterangan Usaha", jumlah: 22 },
    { jenis: "Surat Pengantar Nikah", jumlah: 15 },
  ]

  return (
    <div>
      <PageHeader
        title="Laporan & Statistik"
        description="Ringkasan dan analisis data RT/RW"
        action={
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Laporan
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Overview Stats */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Ringkasan Umum</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Warga</p>
                  <p className="text-3xl font-semibold mt-1">{stats.totalWarga}</p>
                  <p className="text-xs text-green-600 mt-1">+5 bulan ini</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Surat</p>
                  <p className="text-3xl font-semibold mt-1">{stats.totalSurat}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stats.suratBulanIni} bulan ini</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Kas</p>
                  <p className="text-2xl font-semibold mt-1">{formatRupiah(stats.saldo)}</p>
                  <p className="text-xs text-green-600 mt-1">+15% dari bulan lalu</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Kegiatan</p>
                  <p className="text-3xl font-semibold mt-1">{stats.kegiatanBulanIni}</p>
                  <p className="text-xs text-muted-foreground mt-1">Bulan ini</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Financial Chart */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Grafik Keuangan 6 Bulan Terakhir</h2>
          <Card className="p-6">
            <div className="space-y-4">
              {keuanganBulanan.map((item) => {
                const selisih = item.pemasukan - item.pengeluaran
                return (
                  <div key={item.bulan} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium w-12">{item.bulan}</span>
                      <div className="flex-1 mx-4">
                        <div className="flex gap-2">
                          <div
                            className="bg-green-500 h-8 rounded flex items-center justify-end px-2 text-white text-xs"
                            style={{ width: `${(item.pemasukan / 6000000) * 100}%` }}
                          >
                            {formatRupiah(item.pemasukan)}
                          </div>
                          <div
                            className="bg-red-500 h-8 rounded flex items-center justify-end px-2 text-white text-xs"
                            style={{ width: `${(item.pengeluaran / 6000000) * 100}%` }}
                          >
                            {formatRupiah(item.pengeluaran)}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`font-medium w-32 text-right ${selisih >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {selisih >= 0 ? "+" : ""}
                        {formatRupiah(selisih)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-green-500" />
                <span className="text-sm text-muted-foreground">Pemasukan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-red-500" />
                <span className="text-sm text-muted-foreground">Pengeluaran</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Documents */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Jenis Surat Terbanyak</h2>
            <Card className="p-6">
              <div className="space-y-4">
                {suratTerbanyak.map((item, index) => (
                  <div key={item.jenis} className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.jenis}</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(item.jumlah / suratTerbanyak[0].jumlah) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium shrink-0">{item.jumlah}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Financial Summary */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Ringkasan Keuangan</h2>
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pemasukan</p>
                    <p className="text-xl font-semibold text-green-600">{formatRupiah(stats.totalPemasukan)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
                    <p className="text-xl font-semibold text-red-600">{formatRupiah(stats.totalPengeluaran)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Saldo Akhir</p>
                    <p className="text-xl font-semibold">{formatRupiah(stats.saldo)}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
