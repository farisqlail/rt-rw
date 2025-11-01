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

export interface MailManagement {
  id: number
  mail_number: string
  mail_category: string
  applicant: string
  status: string
  created_at: string
  uuid: string
}

export interface Resident {
  id: number
  nik: string
  name: string
  address: string
  rtrw: string
  phone: string
  status: string
  created_at: string
  uuid: string
}

export interface Keuangan {
  id: number
  finance_category: "pemasukan" | "pengeluaran"
  category: string
  amount: number
  description: string
  created_at: string
  uuid: string
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

export interface Announcement {
  id: number
  title: string
  descriptions: string
  priority: "rendah" | "sedang" | "tinggi"
  status: "draft" | "published"
  created_at: string
  uuid: string
}

export interface Kegiatan {
  id: string
  activity_name: string
  date: string
  time_start: string
  time_end: string
  location: string
  description: string
  guarantor: string
  status: "planned" | "ongoing" | "completed" | "cancelled"
  created_at: string
  uuid: string
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

export interface Security {
  id: number
  date: string
  descriptions: string
  location: string
  reporter: string
  status: string
  created_at: string
  uuid: string
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

export interface Laporan {
  id: string
  title: string
  description: string
  priority: "rendah" | "sedang" | "tinggi"
  status: "open" | "in-progress" | "resolved" | "closed"
  created_at: string
  uuid: string
}
