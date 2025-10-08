"use client"

import { ArrowLeft, Download, Edit, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data
const suratDetail = {
  id: "1",
  nomorSurat: "001/RT-001/I/2024",
  jenisSurat: "Surat Keterangan Domisili",
  pemohon: "Budi Santoso",
  nik: "3201012345678901",
  alamat: "Jl. Merdeka No. 12, RT 001/RW 005",
  keperluan: "Untuk keperluan administrasi bank",
  tanggalPengajuan: "2024-01-15",
  tanggalSelesai: "2024-01-16",
  status: "selesai",
  keterangan: "Surat telah ditandatangani oleh Ketua RT",
  dibuatOleh: "Admin RT",
}

export default function DetailSuratPage() {
  return (
    <div>
      <Link href="/surat">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <PageHeader
        title={suratDetail.jenisSurat}
        description={`No. Surat: ${suratDetail.nomorSurat}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            {suratDetail.status === "pending" && (
              <>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Setujui
                </Button>
                <Button variant="outline" className="text-destructive bg-transparent">
                  <XCircle className="h-4 w-4 mr-2" />
                  Tolak
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Informasi Pemohon</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nama Pemohon</p>
                <p className="font-medium">{suratDetail.pemohon}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">NIK</p>
                <p className="font-medium">{suratDetail.nik}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Alamat</p>
                <p className="font-medium">{suratDetail.alamat}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Detail Surat</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Keperluan</p>
                <p className="font-medium">{suratDetail.keperluan}</p>
              </div>
              {suratDetail.keterangan && (
                <div>
                  <p className="text-sm text-muted-foreground">Keterangan</p>
                  <p className="font-medium">{suratDetail.keterangan}</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Preview Surat</h2>
            <div className="bg-muted/30 p-6 rounded-lg border border-border min-h-[400px]">
              <div className="text-center mb-6">
                <h3 className="font-bold text-lg">SURAT KETERANGAN DOMISILI</h3>
                <p className="text-sm">Nomor: {suratDetail.nomorSurat}</p>
              </div>
              <div className="space-y-4 text-sm">
                <p>Yang bertanda tangan di bawah ini, Ketua RT 001 / RW 005, menerangkan bahwa:</p>
                <div className="ml-6 space-y-2">
                  <p>Nama: {suratDetail.pemohon}</p>
                  <p>NIK: {suratDetail.nik}</p>
                  <p>Alamat: {suratDetail.alamat}</p>
                </div>
                <p>
                  Adalah benar warga yang berdomisili di wilayah RT 001 / RW 005. Surat keterangan ini dibuat untuk
                  keperluan: {suratDetail.keperluan}
                </p>
                <p>
                  Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Status Surat</h2>
            <Badge
              variant={
                suratDetail.status === "selesai"
                  ? "default"
                  : suratDetail.status === "ditolak"
                    ? "destructive"
                    : "secondary"
              }
              className="text-sm"
            >
              {suratDetail.status.toUpperCase()}
            </Badge>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Timeline</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Pengajuan</p>
                <p className="font-medium">{suratDetail.tanggalPengajuan}</p>
              </div>
              {suratDetail.tanggalSelesai && (
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Selesai</p>
                  <p className="font-medium">{suratDetail.tanggalSelesai}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Dibuat Oleh</p>
                <p className="font-medium">{suratDetail.dibuatOleh}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
