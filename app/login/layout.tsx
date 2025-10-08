import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - RT/RW Manager",
  description: "Masuk ke sistem RT/RW Manager",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="">
        {children}
      </body>
    </html>
  )
}