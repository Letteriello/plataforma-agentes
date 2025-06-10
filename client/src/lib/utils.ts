import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  // Lida com datas, se necessário
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any
  }
  // Lida com arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as any
  }
  // Lida com objetos
  const clonedObj = {} as T
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone(obj[key])
    }
  }
  return clonedObj
}

export function generateAvatarUrl(seed: string) {
  return `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(seed)}`
}
