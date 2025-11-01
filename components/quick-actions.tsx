import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Megaphone, Calendar, Shield, DollarSign } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Tambah Warga",
    description: "Daftarkan warga baru",
    icon: Plus,
    href: "/dashboard/warga/tambah",
  },
  {
    title: "Buat Surat",
    description: "Buat surat pengantar",
    icon: FileText,
    href: "/dashboard/surat/buat",
  },
  {
    title: "Buat Pengumuman",
    description: "Publikasikan pengumuman",
    icon: Megaphone,
    href: "/dashboard/pengumuman/buat",
  },
  {
    title: "Jadwalkan Kegiatan",
    description: "Atur kegiatan RT/RW",
    icon: Calendar,
    href: "/dashboard/kegiatan/buat",
  },
  {
    title: "Laporan Keamanan",
    description: "Buat laporan keamanan",
    icon: Shield,
    href: "/dashboard/keamanan/buat",
  },
  {
    title: "Catat Keuangan",
    description: "Input transaksi keuangan",
    icon: DollarSign,
    href: "/dashboard/keuangan/buat",
  },
]

export function QuickActions() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Aksi Cepat</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto min-h-[80px] p-3 flex flex-col items-start gap-2 hover:bg-accent text-left w-full"
              asChild
            >
              <Link href={action.href} className="w-full">
                <div className="flex items-center gap-2 w-full">
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-sm leading-tight truncate">
                    {action.title}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground leading-tight line-clamp-2 w-full">
                  {action.description}
                </span>
              </Link>
            </Button>
          )
        })}
      </div>
    </Card>
  )
}
