import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function that merges classnames with tailwind classes
 */
export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args))
}
