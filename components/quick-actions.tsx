import { FileText, Megaphone, Calendar, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const actions = [
  { icon: Users, label: "Tambah Warga", color: "text-blue-600" },
  { icon: FileText, label: "Buat Surat", color: "text-green-600" },
  { icon: Megaphone, label: "Buat Pengumuman", color: "text-orange-600" },
  { icon: Calendar, label: "Jadwalkan Kegiatan", color: "text-purple-600" },
]

export function QuickActions() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button key={action.label} variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent">
            <action.icon className={`h-6 w-6 ${action.color}`} />
            <span className="text-sm">{action.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  )
}
