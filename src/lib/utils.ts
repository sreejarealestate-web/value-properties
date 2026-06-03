import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`
  return `₹${price.toLocaleString('en-IN')}`
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}
