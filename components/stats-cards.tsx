import { Users, FileText, Wallet, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"

const stats = [
  {
    icon: Users,
    label: "Total Warga",
    value: "1,234",
    change: "+12 bulan ini",
    trend: "up" as const,
  },
  {
    icon: FileText,
    label: "Surat Pending",
    value: "23",
    change: "Perlu ditindaklanjuti",
    trend: "neutral" as const,
  },
  {
    icon: Wallet,
    label: "Saldo Kas",
    value: "Rp 45.2jt",
    change: "+8% dari bulan lalu",
    trend: "up" as const,
  },
  {
    icon: Calendar,
    label: "Kegiatan Bulan Ini",
    value: "8",
    change: "3 akan datang",
    trend: "neutral" as const,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
