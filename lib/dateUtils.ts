// src/lib/dateUtils.ts

/**
 * Format tanggal ke format Indonesia dengan waktu 24 jam.
 * Contoh output: "04 Oktober 2025 20:09"
 */
export function formatDateTime(dateString: string | Date): string {
    if (!dateString) return "-"
  
    const date = typeof dateString === "string" ? new Date(dateString) : dateString
  
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }
  