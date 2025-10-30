import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export interface FormFieldProps {
  label: string
  id?: string
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  maxLength?: number
  required?: boolean
  children?: React.ReactNode
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder = "",
  maxLength,
  required = false,
  children,
}) => {
  // If children are provided, use wrapper mode
  if (children) {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {children}
      </div>
    )
  }

  // Otherwise, use direct input mode (backward compatibility)
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
      />
    </div>
  )
}
