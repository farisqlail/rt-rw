export interface Warga {
  id: string
  nik: string
  nama: string
  alamat: string
  rt: string
  rw: string
  telepon: string
  email?: string
  status: "aktif" | "pindah" | "meninggal"
  tanggalDaftar: string
}

export interface Surat {
  id: string
  nomorSurat: string
  jenisSurat: string
  pemohon: string
  tanggalPengajuan: string
  status: "pending" | "diproses" | "selesai" | "ditolak"
  keterangan?: string
}

export interface Keuangan {
  id: string
  tanggal: string
  jenis: "pemasukan" | "pengeluaran"
  kategori: string
  jumlah: number
  keterangan: string
  bukti?: string
}

export interface Pengumuman {
  id: string
  judul: string
  konten: string
  tanggal: string
  penulis: string
  prioritas: "rendah" | "sedang" | "tinggi"
  status: "draft" | "published"
}

export interface Kegiatan {
  id: string
  namaKegiatan: string
  tanggal: string
  waktu: string
  lokasi: string
  deskripsi: string
  penanggungJawab: string
  status: "planned" | "ongoing" | "completed" | "cancelled"
}

export interface LaporanKeamanan {
  id: string
  tanggal: string
  jenis: "kejadian" | "patroli" | "keluhan"
  deskripsi: string
  lokasi: string
  pelapor: string
  status: "open" | "in-progress" | "resolved"
}

export interface User {
  id: string
  nama: string
  email: string
  role: "super-admin" | "admin" | "pengurus"
  telepon: string
  status: "aktif" | "nonaktif"
  tanggalDibuat: string
  terakhirLogin?: string
}
