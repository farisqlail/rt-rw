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
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "next-auth/react"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard/" },
  { icon: Users, label: "Manajemen Warga", href: "/dashboard/warga" },
  { icon: FileText, label: "Administrasi Surat", href: "/dashboard/surat" },
  { icon: Wallet, label: "Keuangan", href: "/dashboard/keuangan" },
  { icon: Megaphone, label: "Pengumuman", href: "/dashboard/pengumuman" },
  { icon: Calendar, label: "Kegiatan", href: "/dashboard/kegiatan" },
  { icon: BarChart3, label: "Laporan", href: "/dashboard/laporan" },
  { icon: Shield, label: "Keamanan", href: "/dashboard/keamanan" },
  { icon: UserCog, label: "Manajemen User", href: "/dashboard/users" },
  { icon: Settings, label: "Pengaturan", href: "/dashboard/pengaturan" },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { data: session } = useSession()

  const user = session?.user

  const handleLogout = async () => {
    await signOut({ redirect: false })
    localStorage.clear()
    window.location.href = "/login"
  }

  return (
    <aside
      className={cn(
        "bg-card border-r border-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div>
            <h1 className="font-semibold text-lg">RT/RW Manager</h1>
            <p className="text-xs text-muted-foreground">Admin Console</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-3", collapsed && "justify-center px-2")}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Profile section */}
      <div
        className="p-4 border-t border-border relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 uppercase">
            <span className="text-sm font-medium">{user?.name?.charAt(0) || "?"}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "Pengguna"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
        </div>

        {/* Dropdown logout */}
        {!collapsed && hovered && (
          <div className="absolute left-4 right-4 bottom-16 bg-popover border rounded-md shadow-md py-1 animate-in fade-in">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive gap-2 px-3 py-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}
