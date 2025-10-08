"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])
    if (status === "loading") {
        return <div className="flex h-screen items-center justify-center">Memuat...</div>
    }

    if (!session) return null
    // if (session.user.role !== "admin") {
    //     return (
    //         <div className="flex h-screen items-center justify-center">
    //             Anda tidak memiliki akses ke halaman ini.
    //         </div>
    //     )
    // }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader />
                <main className="flex-1 overflow-y-auto bg-background p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
