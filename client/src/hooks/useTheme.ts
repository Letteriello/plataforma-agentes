import { useContext } from 'react'

import { theme } from '@/theme'

type Theme = typeof theme

/**
 * Hook to access the Nexus Design System theme
 * @returns Theme configuration object
 */
export const useTheme = (): Theme => {
  return theme
}

/**
 * Hook to get a specific value from the theme
 * @param path Dot notation path to the theme value (e.g., 'colors.primary')
 * @returns The theme value or undefined if not found
 */
export const useThemeValue = <T = any>(path: string): T | undefined => {
  const theme = useTheme()

  // Split the path into parts and traverse the theme object
  return path.split('.').reduce((obj, key) => {
    return obj && obj[key as keyof typeof obj]
  }, theme as any) as T
}

export default useTheme
