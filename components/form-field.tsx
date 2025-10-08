import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export interface FormFieldProps {
  label: string
  id: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  required = false,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  )
}
