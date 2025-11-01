import * as XLSX from 'xlsx'
import type { Keuangan } from './types'

// Format currency for display
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

// Export finance data to Excel
export const exportToExcel = (data: Keuangan[], filename: string = 'laporan-keuangan') => {
  try {
    // Prepare data for Excel
    const excelData = data.map((item) => ({
      'Tanggal': formatDate(item.created_at),
      'Jenis': item.finance_category === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
      'Kategori': item.category,
      'Jumlah': item.amount,
      'Jumlah (Formatted)': formatRupiah(item.amount),
      'Keterangan': item.description
    }))

    // Calculate totals
    const totalPemasukan = data
      .filter(item => item.finance_category === 'pemasukan')
      .reduce((sum, item) => sum + item.amount, 0)
    
    const totalPengeluaran = data
      .filter(item => item.finance_category === 'pengeluaran')
      .reduce((sum, item) => sum + item.amount, 0)
    
    const saldo = totalPemasukan - totalPengeluaran

    // Add summary rows
    excelData.push(
      { 'Tanggal': '', 'Jenis': '', 'Kategori': '', 'Jumlah': 0, 'Jumlah (Formatted)': '', 'Keterangan': '' },
      { 'Tanggal': 'RINGKASAN', 'Jenis': '', 'Kategori': '', 'Jumlah': 0, 'Jumlah (Formatted)': '', 'Keterangan': '' },
      { 'Tanggal': 'Total Pemasukan', 'Jenis': '', 'Kategori': '', 'Jumlah': totalPemasukan, 'Jumlah (Formatted)': formatRupiah(totalPemasukan), 'Keterangan': '' },
      { 'Tanggal': 'Total Pengeluaran', 'Jenis': '', 'Kategori': '', 'Jumlah': totalPengeluaran, 'Jumlah (Formatted)': formatRupiah(totalPengeluaran), 'Keterangan': '' },
      { 'Tanggal': 'Saldo', 'Jenis': '', 'Kategori': '', 'Jumlah': saldo, 'Jumlah (Formatted)': formatRupiah(saldo), 'Keterangan': '' }
    )

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(excelData)

    // Set column widths
    const colWidths = [
      { wch: 5 },   // No
      { wch: 15 },  // Tanggal
      { wch: 12 },  // Jenis
      { wch: 20 },  // Kategori
      { wch: 15 },  // Jumlah
      { wch: 20 },  // Jumlah (Formatted)
      { wch: 30 },  // Keterangan
      { wch: 25 }   // UUID
    ]
    ws['!cols'] = colWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Keuangan')

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const finalFilename = `${filename}-${timestamp}.xlsx`

    // Save file
    XLSX.writeFile(wb, finalFilename)

    return { success: true, filename: finalFilename }
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    return { success: false, error: 'Gagal mengexport ke Excel' }
  }
}

// Export finance data to PDF


// Export filtered data to Excel based on date range
export const exportFilteredData = (
  data: Keuangan[],
  startDate?: string,
  endDate?: string,
  category?: string
) => {
  let filteredData = [...data]

  // Filter by date range
  if (startDate) {
    filteredData = filteredData.filter(item => 
      new Date(item.created_at) >= new Date(startDate)
    )
  }

  if (endDate) {
    filteredData = filteredData.filter(item => 
      new Date(item.created_at) <= new Date(endDate)
    )
  }

  // Filter by category
  if (category && category !== 'all') {
    filteredData = filteredData.filter(item => 
      item.finance_category === category
    )
  }

  // Generate filename with date range
  let filename = 'laporan-keuangan'
  if (startDate && endDate) {
    const start = formatDate(startDate).replace(/\//g, '-')
    const end = formatDate(endDate).replace(/\//g, '-')
    filename = `laporan-keuangan-${start}-sampai-${end}`
  } else if (startDate) {
    const start = formatDate(startDate).replace(/\//g, '-')
    filename = `laporan-keuangan-dari-${start}`
  } else if (endDate) {
    const end = formatDate(endDate).replace(/\//g, '-')
    filename = `laporan-keuangan-sampai-${end}`
  }

  // Export filtered data to Excel
  exportToExcel(filteredData, filename)
}