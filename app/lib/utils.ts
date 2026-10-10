import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ADMIN_EMAILS = import.meta.env.VITE_PUBLIC_ADMIN_EMAILS
  ? import.meta.env.VITE_PUBLIC_ADMIN_EMAILS.split(',').map((email: string) =>
      email.trim(),
    )
  : []

export function checkAdminEmail(email: string) {
  return ADMIN_EMAILS.includes(email)
}
