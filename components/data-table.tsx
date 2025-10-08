"use client"

import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"

interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => ReactNode)
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (row: T) => void
}

export function DataTable<T extends { id: string | number }>({ data, columns, onRowClick }: DataTableProps<T>) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="text-left p-4 text-sm font-medium text-muted-foreground">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}
              >
                {columns.map((column, index) => (
                  <td key={index} className={`p-4 text-sm ${column.className || ""}`}>
                    {typeof column.accessor === "function" ? column.accessor(row) : String(row[column.accessor])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
