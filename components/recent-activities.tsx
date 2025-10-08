import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"

const activities = [
  {
    user: "Budi Santoso",
    action: "mengajukan surat keterangan domisili",
    time: "5 menit yang lalu",
    avatar: "BS",
  },
  {
    user: "Siti Aminah",
    action: "melakukan pembayaran iuran bulanan",
    time: "1 jam yang lalu",
    avatar: "SA",
  },
  {
    user: "Ahmad Yani",
    action: "mendaftar kegiatan kerja bakti",
    time: "2 jam yang lalu",
    avatar: "AY",
  },
  {
    user: "Dewi Lestari",
    action: "mengajukan surat pengantar",
    time: "3 jam yang lalu",
    avatar: "DL",
  },
  {
    user: "Rudi Hartono",
    action: "melaporkan lampu jalan rusak",
    time: "5 jam yang lalu",
    avatar: "RH",
  },
]

export function RecentActivities() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Aktivitas Terbaru</h2>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <Avatar className="h-8 w-8 bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-medium">{activity.avatar}</span>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
