import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { QuickActions } from "@/components/quick-actions"
import { RecentActivities } from "@/components/recent-activities"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <div className="flex-1 space-y-6">
        <StatsCards />
        <div className="grid gap-6 lg:grid-cols-2">
          <QuickActions />
          <RecentActivities />
        </div>
      </div>
    </div>
  )
}
