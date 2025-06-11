// Definições de tipos para módulos personalizados
declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}

declare module '*.webp' {
  const content: string
  export default content
}

// Tipos para módulos JavaScript sem suporte a TypeScript
declare module 'lucide-react'
declare module 'zustand'
declare module 'zustand/middleware'

// Tipos para caminhos de importação com @
declare module '@/*'
declare module '@/components/*'
declare module '@/lib/*'
declare module '@/hooks/*'
declare module '@/store/*'
declare module '@/api/*'
declare module '@/pages/*'
declare module '@/assets/*'
declare module '@/styles/*'
