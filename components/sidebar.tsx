"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Users,
  FileText,
  Wallet,
  Megaphone,
  Calendar,
  BarChart3,
  Shield,
  Settings,
  Home,
  ChevronLeft,
  ChevronRight,
  UserCog,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Users, label: "Manajemen Warga", href: "/warga" },
  { icon: FileText, label: "Administrasi Surat", href: "/surat" },
  { icon: Wallet, label: "Keuangan", href: "/keuangan" },
  { icon: Megaphone, label: "Pengumuman", href: "/pengumuman" },
  { icon: Calendar, label: "Kegiatan", href: "/kegiatan" },
  { icon: BarChart3, label: "Laporan", href: "/laporan" },
  { icon: Shield, label: "Keamanan", href: "/keamanan" },
  { icon: UserCog, label: "Manajemen User", href: "/users" }, // Added user management menu
  { icon: Settings, label: "Pengaturan", href: "/pengaturan" },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "bg-card border-r border-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div>
            <h1 className="font-semibold text-lg">RT/RW Manager</h1>
            <p className="text-xs text-muted-foreground">Admin Console</p>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="ml-auto">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button variant="ghost" className={cn("w-full justify-start gap-3", collapsed && "justify-center px-2")}>
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-medium">A</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@rtrw.id</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
